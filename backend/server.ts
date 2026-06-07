import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import https from "https";
import http from "http";
import { Pool } from "pg";
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from multiple possible paths sequentially
const envPaths = [
  path.join(process.cwd(), "backend", ".env"),
  path.join(process.cwd(), ".env"),
  path.join(__dirname, ".env"),
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", "backend", ".env")
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[Wed] Environment configuration loaded successfully from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  // Fall back to general dotenv load
  dotenv.config();
  console.log("[Wed] dotenv loaded with default fallback path.");
}

const app = express();
const isProd = process.env.NODE_ENV === "production";
const PORT = isProd ? (process.env.PORT || 3000) : 3001;

// Define directories
const PUBLIC_DIR = path.join(__dirname, "public");
const LOCAL_SONG_FILE = path.join(PUBLIC_DIR, "music.mp3");

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Function to copy wedding images from frontend development public to backend on boot
function copyWorkspaceImagesToBackend() {
  const destImagesDir = path.join(PUBLIC_DIR, "images");
  if (!fs.existsSync(destImagesDir)) {
    fs.mkdirSync(destImagesDir, { recursive: true });
  }

  const srcImagesDir = path.join(process.cwd(), "public", "images");
  if (fs.existsSync(srcImagesDir)) {
    try {
      const files = fs.readdirSync(srcImagesDir);
      let copiedCount = 0;
      files.forEach((file) => {
        const srcFile = path.join(srcImagesDir, file);
        const destFile = path.join(destImagesDir, file);
        if (fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
          copiedCount++;
        }
      });
      console.log(`[Wed] Copied ${copiedCount} wedding image assets to backend public/images/ directory.`);
    } catch (err: any) {
      console.error("[Wed] Error copying workspace images to backend public directory:", err.message);
    }
  } else {
    console.log("[Wed] Workspace images directory not found at:", srcImagesDir);
  }
}

// Ensure CORS is set up correctly so the decoupled frontend from "nugrahagiangn.my.id" can communicate
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["*"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Serve public directory (meaning static files like music.mp3 and images can be reached directly)
app.use(express.static(PUBLIC_DIR));
app.use("/wedding", express.static(PUBLIC_DIR));
app.use("/images", express.static(path.join(PUBLIC_DIR, "images")));
app.use("/wedding/images", express.static(path.join(PUBLIC_DIR, "images")));

// Create PostgreSQL connection pool
// Support both unified DATABASE_URL (ElephantSQL, Neon, Railway, Supabase etc) and cPanel discrete parameters
const connectionString = process.env.DATABASE_URL;
let pool: Pool;

// Ensure we have a clean hostname for DB_HOST (removing protocol prefix if entered by user)
let rawDbHost = process.env.DB_HOST || "localhost";
let cleanDbHost = rawDbHost;
if (cleanDbHost.startsWith("http://")) {
  cleanDbHost = cleanDbHost.replace("http://", "");
}
if (cleanDbHost.startsWith("https://")) {
  cleanDbHost = cleanDbHost.replace("https://", "");
}
// Strip path trailing slashes or ports if present
cleanDbHost = cleanDbHost.split("/")[0].split(":")[0];

// Mask password for safe logging
const maskedPassword = process.env.DB_PASSWORD ? "***" : "not set";
console.log(`[DB Setup] Initializing PostgreSQL connection with parameters:
 - DB_HOST: ${cleanDbHost} (raw: ${rawDbHost})
 - DB_PORT: ${process.env.DB_PORT || "5432"}
 - DB_USER: ${process.env.DB_USER || "postgres"}
 - DB_NAME: ${process.env.DB_NAME || "gnwedd"}
 - DB_SSL: ${process.env.DB_SSL || "false"}
 - DATABASE_URL (configured): ${connectionString ? "Yes" : "No"}
`);

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: process.env.DB_SSL === "true" || process.env.DB_SSL === undefined ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000
  });
} else {
  pool = new Pool({
    host: cleanDbHost,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "gnwedd",
    port: parseInt(process.env.DB_PORT || "5432"),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000
  });
}

// Keep trace of the last database initialization error
let dbInitError: string | null = null;
let useLocalFallback = false;

const LOCAL_DB_PATH = path.join(__dirname, "local_db.json");

interface LocalDb {
  guestbook: Array<{
    id: string;
    name: string;
    relationship: string;
    rsvpHadir: string;
    countGuests: number;
    comment: string;
    createdAt: string;
  }>;
  settings: Record<string, string>;
  admin_users: Array<{
    id: number;
    username: string;
    password: string;
    name: string;
  }>;
  photos: Array<{
    id: string;
    url: string;
    caption: string;
    isActive: boolean;
    createdAt: string;
  }>;
}

function loadLocalDb(): LocalDb {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, "utf8");
      const parsed = JSON.parse(data);
      if (!parsed.photos) {
        parsed.photos = [
          { id: "g1", url: "/images/male.jpeg", caption: "Momen Kebersamaan", isActive: true, createdAt: new Date().toISOString() },
          { id: "g2", url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", caption: "Buket Bunga Impian", isActive: true, createdAt: new Date().toISOString() },
          { id: "g3", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800", caption: "Simbol Ikatan Suci", isActive: true, createdAt: new Date().toISOString() },
          { id: "g4", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", caption: "Langkah Bersama", isActive: true, createdAt: new Date().toISOString() },
          { id: "g5", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", caption: "Pesta Keakraban", isActive: true, createdAt: new Date().toISOString() },
          { id: "g6", url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800", caption: "Kue Pernikahan Cantik", isActive: true, createdAt: new Date().toISOString() }
        ];
        saveLocalDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Failed to read local DB file, initializing fresh:", err);
  }

  // Fresh setup with defaults
  const adminHash = crypto.createHash("sha256").update("admin").digest("hex");
  const gianHash = crypto.createHash("sha256").update("051196").digest("hex");
  const cucuHash = crypto.createHash("sha256").update("110599").digest("hex");

  return {
    guestbook: [],
    settings: {
      "active_song_url": "/music.mp3",
      "active_song_title": "Bruno Mars - Risk It All (Aplikasi Lokal)"
    },
    admin_users: [
      { id: 1, username: "admin", password: adminHash, name: "Administrator" },
      { id: 2, username: "gian", password: gianHash, name: "Gian Nugraha" },
      { id: 3, username: "cucu", password: cucuHash, name: "Cucu" }
    ],
    photos: [
      { id: "g1", url: "/images/male.jpeg", caption: "Momen Kebersamaan", isActive: true, createdAt: new Date().toISOString() },
      { id: "g2", url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", caption: "Buket Bunga Impian", isActive: true, createdAt: new Date().toISOString() },
      { id: "g3", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800", caption: "Simbol Ikatan Suci", isActive: true, createdAt: new Date().toISOString() },
      { id: "g4", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", caption: "Langkah Bersama", isActive: true, createdAt: new Date().toISOString() },
      { id: "g5", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", caption: "Pesta Keakraban", isActive: true, createdAt: new Date().toISOString() },
      { id: "g6", url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800", caption: "Kue Pernikahan Cantik", isActive: true, createdAt: new Date().toISOString() }
    ]
  };
}

function saveLocalDb(data: LocalDb) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to local DB file:", err);
  }
}

// Auto-bootstrap and check database tables on startup
async function initDb() {
  console.log("Connecting and initializing PostgreSQL database...");
  try {
    // Check basic connectivity first
    await pool.query("SELECT NOW()");
    dbInitError = null;
    useLocalFallback = false;
    console.log("[DB Connectivity] Successful connection ping to Postgres.");

    // 1. Create Guestbook Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        relationship VARCHAR(100) DEFAULT 'Teman',
        rsvp_hadir VARCHAR(20) NOT NULL,
        count_guests INT DEFAULT 1,
        comment TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Index on Guestbook created_at
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);
    `);

    // 3. Create Settings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // 4. Prepopulate Settings
    await pool.query(`
      INSERT INTO settings (key, value)
      VALUES 
        ('active_song_url', '/music.mp3'),
        ('active_song_title', 'Bruno Mars - Risk It All (Aplikasi Lokal)')
      ON CONFLICT (key) DO NOTHING;
    `);

    // 5. Create admin_users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(120) DEFAULT 'Administrator',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Prepopulate admin_users
    // 'admin' -> we compute sha256 of 'admin'
    // 'gian' -> user requested pin: '051196'
    // 'cucu' -> user requested pin: '110599'
    const adminHash = crypto.createHash("sha256").update("admin").digest("hex");
    const gianHash = crypto.createHash("sha256").update("051196").digest("hex");
    const cucuHash = crypto.createHash("sha256").update("110599").digest("hex");

    await pool.query(`
      INSERT INTO admin_users (username, password, name)
      VALUES 
        ($1, $2, $3),
        ($4, $5, $6),
        ($7, $8, $9)
      ON CONFLICT (username) DO UPDATE 
      SET password = EXCLUDED.password, name = EXCLUDED.name;
    `, [
      'admin', adminHash, 'Administrator',
      'gian', gianHash, 'Gian Nugraha',
      'cucu', cucuHash, 'Cucu'
    ]);

    // 7. Create Photos Table for dynamic upload
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        caption VARCHAR(255) DEFAULT '',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Prepopulate photos (if empty)
    const checkPhotos = await pool.query("SELECT COUNT(*) FROM photos");
    if (parseInt(checkPhotos.rows[0].count) === 0) {
      console.log("[DB Setup] Prepopulating photos table with default gallery images...");
      const defaultPhotos = [
        ["/images/male.jpeg", "Momen Kebersamaan"],
        ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", "Buket Bunga Impian"],
        ["https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800", "Simbol Ikatan Suci"],
        ["https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", "Langkah Bersama"],
        ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", "Pesta Keakraban"],
        ["https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800", "Kue Pernikahan Cantik"]
      ];
      for (const p of defaultPhotos) {
        await pool.query("INSERT INTO photos (url, caption) VALUES ($1, $2)", p);
      }
    }

    console.log("PostgreSQL schema validated successfully.");
  } catch (err: any) {
    dbInitError = err.message || String(err);
    useLocalFallback = true;
    console.warn(`[DB Setup] Failed to connect/initialize Postgres: ${dbInitError}. Switching to self-contained JSON-file fallback.`);
    // Save/validate local template DB exists or copy it
    const currentLocalDb = loadLocalDb();
    saveLocalDb(currentLocalDb);
  }
}

// Download stream helper
function downloadUrl(url: string, destPath: string, callback: (err?: Error) => void) {
  const protocol = url.startsWith("https") ? https : http;
  
  protocol.get(url, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
      const redirectUrl = response.headers.location;
      if (redirectUrl) {
        downloadUrl(redirectUrl, destPath, callback);
        return;
      }
    }

    if (response.statusCode !== 200) {
      callback(new Error(`Server returned status code ${response.statusCode}`));
      return;
    }

    const file = fs.createWriteStream(destPath);
    response.pipe(file);

    file.on("finish", () => {
      file.close();
      callback();
    });

    file.on("error", (err) => {
      fs.unlink(destPath, () => {});
      callback(err);
    });
  }).on("error", (err) => {
    fs.unlink(destPath, () => {});
    callback(err);
  });
}

// Download default background song on startup if local file does not exist
function checkAndDownloadLocalSong() {
  if (fs.existsSync(LOCAL_SONG_FILE)) {
    console.log("Local backup music.mp3 already exists.");
    return;
  }
  console.log("Downloading default romantic song to local public storage...");
  const defaultUrl = "https://pub-c5e31b5cdafb419a86617dd1d3e92ef9.r2.dev/ZAYN%20%26%20Usher%20-%20Risk%20It%20All.mp3";
  downloadUrl(defaultUrl, LOCAL_SONG_FILE, (err) => {
    if (err) {
      console.error("Failed to download default background song:", err.message);
    } else {
      console.log("Romantic song downloaded successfully to backend internal static storage!");
    }
  });
}

// -----------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------

// API Home / Health Monitor
app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "Wedding Invitation PostgreSQL Decoupled Backend is healthy.",
    domain: "nugrahagiangn.my.id",
    dbInitError: dbInitError,
    diagnosticsRoute: "/api/db-debug"
  });
});

// Live Database Diagnostic Endpoint for user troubleshooting
app.get("/api/db-debug", async (req, res) => {
  const diagnostics: Record<string, any> = {
    envLoadedAt: new Date().toISOString(),
    configuredConnectionString: !!process.env.DATABASE_URL,
    dbHost: process.env.DB_HOST || "localhost (default)",
    dbUser: process.env.DB_USER || "postgres (default)",
    dbName: process.env.DB_NAME || "gnwedd (default)",
    dbPort: process.env.DB_PORT || "5432",
    dbSsl: process.env.DB_SSL || "false",
    nodeEnv: process.env.NODE_ENV || "development",
    lastInitError: dbInitError
  };

  try {
    const testResult = await pool.query("SELECT NOW() as current_time");
    diagnostics.connected = true;
    diagnostics.dbTime = testResult.rows[0].current_time;

    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    diagnostics.tables = tablesResult.rows.map(r => r.table_name);

    if (diagnostics.tables.includes("guestbook")) {
      const countResult = await pool.query("SELECT COUNT(*)::int as count FROM guestbook");
      diagnostics.guestbookCount = countResult.rows[0].count;
      
      const sampleResult = await pool.query("SELECT * FROM guestbook LIMIT 1");
      diagnostics.sampleEntry = sampleResult.rows;
    }
  } catch (err: any) {
    diagnostics.connected = false;
    diagnostics.errorMessage = err.message;
    diagnostics.errorCode = err.code;
    diagnostics.stackTrace = err.stack;
  }

  res.json(diagnostics);
});

// GET Guestbook entries (from Postgres)
app.get("/api/guestbook", async (req, res) => {
  if (useLocalFallback) {
    try {
      const db = loadLocalDb();
      const sorted = [...db.guestbook].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(sorted);
    } catch (err: any) {
      return res.status(500).json({ error: "Gagal mengambil daftar ucapan dari local DB.", details: err.message });
    }
  }

  try {
    const result = await pool.query(
      "SELECT id::text, name, relationship, rsvp_hadir AS \"rsvpHadir\", count_guests AS \"countGuests\", comment, created_at AS \"createdAt\" FROM guestbook ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("Error retrieving guestbook from Postgres:", err);
    res.status(500).json({ 
      error: "Gagal mengambil daftar ucapan tamu.", 
      details: err.message,
      code: err.code
    });
  }
});

// POST new Guestbook entry
app.post("/api/guestbook", async (req, res) => {
  const { name, relationship, rsvpHadir, comment, countGuests } = req.body;

  if (!name || !rsvpHadir || !comment) {
    return res.status(400).json({ error: "Missing required fields: name, rsvpHadir, comment" });
  }

  if (useLocalFallback) {
    try {
      const db = loadLocalDb();
      const newEntry = {
        id: String(Date.now() + Math.floor(Math.random() * 1000)),
        name: String(name).trim(),
        relationship: String(relationship || "Teman").trim(),
        rsvpHadir: String(rsvpHadir),
        countGuests: Number(countGuests) || 1,
        comment: String(comment).trim(),
        createdAt: new Date().toISOString()
      };
      db.guestbook.push(newEntry);
      saveLocalDb(db);
      return res.status(201).json(newEntry);
    } catch (err: any) {
      return res.status(500).json({ error: "Gagal menyimpan ucapan ke local DB.", details: err.message });
    }
  }

  try {
    const queryStr = `
      INSERT INTO guestbook (name, relationship, rsvp_hadir, count_guests, comment, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id::text, name, relationship, rsvp_hadir AS "rsvpHadir", count_guests AS "countGuests", comment, created_at AS "createdAt"
    `;
    const values = [
      String(name).trim(),
      String(relationship || "Teman").trim(),
      String(rsvpHadir),
      Number(countGuests) || 1,
      String(comment).trim()
    ];

    const result = await pool.query(queryStr, values);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("Error inserting guestbook into Postgres:", err);
    res.status(500).json({ 
      error: "Gagal menyimpan ucapan tamu ke database.", 
      details: err.message,
      code: err.code
    });
  }
});

// DELETE Guestbook entry by ID
app.delete("/api/guestbook/:id", async (req, res) => {
  const { id } = req.params;

  if (useLocalFallback) {
    try {
      const db = loadLocalDb();
      const initialLength = db.guestbook.length;
      db.guestbook = db.guestbook.filter(entry => entry.id !== id);
      if (db.guestbook.length < initialLength) {
        saveLocalDb(db);
        return res.json({ success: true, message: "Komentar berhasil dihapus dari local DB." });
      } else {
        return res.status(404).json({ error: "Komentar tidak ditemukan." });
      }
    } catch (err: any) {
      return res.status(500).json({ error: "Gagal menghapus komentar dari local DB.", details: err.message });
    }
  }

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Format ID komentar tidak valid." });
  }

  try {
    const result = await pool.query("DELETE FROM guestbook WHERE id = $1 RETURNING id", [parsedId]);
    
    if (result.rowCount && result.rowCount > 0) {
      res.json({ success: true, message: "Komentar berhasil dihapus dari database." });
    } else {
      res.status(404).json({ error: "Komentar tidak ditemukan." });
    }
  } catch (err) {
    console.error("Error deleting guestbook entry:", err);
    res.status(500).json({ error: "Gagal menghapus ucapan tamu." });
  }
});

// GET App settings (active music etc)
app.get("/api/settings", async (req, res) => {
  if (useLocalFallback) {
    try {
      const db = loadLocalDb();
      return res.json({
        activeSongUrl: db.settings["active_song_url"] || "/music.mp3",
        activeSongTitle: db.settings["active_song_title"] || "Bruno Mars - Risk It All (Aplikasi Lokal)"
      });
    } catch (err) {
      return res.json({
        activeSongUrl: "/music.mp3",
        activeSongTitle: "Bruno Mars - Risk It All (Aplikasi Lokal)"
      });
    }
  }

  try {
    const result = await pool.query("SELECT key, value FROM settings");
    const settingsMap: Record<string, string> = {};
    
    result.rows.forEach(row => {
      settingsMap[row.key] = row.value;
    });

    res.json({
      activeSongUrl: settingsMap["active_song_url"] || "/music.mp3",
      activeSongTitle: settingsMap["active_song_title"] || "Bruno Mars - Risk It All (Aplikasi Lokal)"
    });
  } catch (err) {
    console.error("Error retrieving settings:", err);
    // Fallback to default
    res.json({
      activeSongUrl: "/music.mp3",
      activeSongTitle: "Bruno Mars - Risk It All (Aplikasi Lokal)"
    });
  }
});

// POST Update App settings manually
app.post("/api/settings", async (req, res) => {
  const { activeSongUrl, activeSongTitle } = req.body;

  if (!activeSongUrl || !activeSongTitle) {
    return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
  }

  if (useLocalFallback) {
    try {
      const db = loadLocalDb();
      db.settings["active_song_url"] = String(activeSongUrl).trim();
      db.settings["active_song_title"] = String(activeSongTitle).trim();
      saveLocalDb(db);
      return res.json({ 
        success: true, 
        settings: { activeSongUrl, activeSongTitle } 
      });
    } catch (err) {
      return res.status(500).json({ error: "Gagal menyimpan konfigurasi musik ke local DB." });
    }
  }

  try {
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ('active_song_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [String(activeSongUrl).trim()]
    );
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ('active_song_title', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [String(activeSongTitle).trim()]
    );

    res.json({ 
      success: true, 
      settings: { activeSongUrl, activeSongTitle } 
    });
  } catch (err) {
    console.error("Error saving settings:", err);
    res.status(500).json({ error: "Gagal menyimpan konfigurasi musik." });
  }
});

// -----------------------------------------------------------------
// PHOTOS / GALLERY ENDPOINTS (Relational & Local Fallback)
// -----------------------------------------------------------------

// GET list of wedding gallery photos
app.get("/api/photos", async (req, res) => {
  if (useLocalFallback) {
    try {
      const db = loadLocalDb();
      return res.json(db.photos || []);
    } catch (err: any) {
      return res.status(500).json({ error: "Gagal mengambil daftar foto dari local DB.", details: err.message });
    }
  }

  try {
    const result = await pool.query(
      "SELECT id::text, url, caption, is_active AS \"isActive\", created_at AS \"createdAt\" FROM photos ORDER BY created_at DESC"
    );
    return res.json(result.rows);
  } catch (err: any) {
    console.error("Error fetching photos from database:", err);
    return res.status(500).json({ error: "Gagal mengambil daftar foto dari database.", details: err.message });
  }
});

// POST Upload a wedding gallery photo as Base64 JSON
app.post("/api/photos/upload", async (req, res) => {
  const { caption, imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: "Data gambar (imageData) berbentuk Base64 wajib disertakan." });
  }

  try {
    // Parse base64 string
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let base64Data = imageData;
    let fileExtension = "jpg";

    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      base64Data = matches[2];
      
      if (mimeType === "image/png") fileExtension = "png";
      else if (mimeType === "image/gif") fileExtension = "gif";
      else if (mimeType === "image/webp") fileExtension = "webp";
    }

    const buffer = Buffer.from(base64Data, "base64");
    
    // Generate clean file name based on caption and timestamp
    const sanitizedCaption = (caption || "galeri")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    const savedFilename = `galeri_${sanitizedCaption}_${uniqueSuffix}.${fileExtension}`;
    
    const destImagesDir = path.join(PUBLIC_DIR, "images");
    if (!fs.existsSync(destImagesDir)) {
      fs.mkdirSync(destImagesDir, { recursive: true });
    }
    
    // Save image to active server static folder
    const filePath = path.join(destImagesDir, savedFilename);
    fs.writeFileSync(filePath, buffer);
    
    // Also save directly to workspace public images folder (parallel to src)
    const rootPublicImagesDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(rootPublicImagesDir)) {
      fs.mkdirSync(rootPublicImagesDir, { recursive: true });
    }
    const rootFilePath = path.join(rootPublicImagesDir, savedFilename);
    fs.writeFileSync(rootFilePath, buffer);
    
    // Serve from public static asset route
    const publicUrl = `/images/${savedFilename}`;
    const cleanCaption = String(caption || "Momen Indah").trim();

    if (useLocalFallback) {
      const db = loadLocalDb();
      if (!db.photos) {
        db.photos = [];
      }
      const newPhoto = {
        id: String(Date.now() + Math.floor(Math.random() * 1000)),
        url: publicUrl,
        caption: cleanCaption,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      db.photos.unshift(newPhoto); // Insert exciting photo at the top
      saveLocalDb(db);
      return res.status(201).json(newPhoto);
    } else {
      const queryStr = `
        INSERT INTO photos (url, caption, is_active, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id::text, url, caption, is_active AS "isActive", created_at AS "createdAt"
      `;
      const result = await pool.query(queryStr, [publicUrl, cleanCaption, true]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err: any) {
    console.error("Error processing photo upload to database:", err);
    return res.status(500).json({ error: "Gagal memproses pengunggahan gambar ke server.", details: err.message });
  }
});

// DELETE a wedding gallery photo by ID
app.delete("/api/photos/:id", async (req, res) => {
  const { id } = req.params;

  if (useLocalFallback) {
    try {
      const db = loadLocalDb();
      if (!db.photos) db.photos = [];
      const initialLength = db.photos.length;
      
      const photoToDelete = db.photos.find(p => p.id === id);
      if (photoToDelete && photoToDelete.url.startsWith("/images/")) {
        const localFileName = photoToDelete.url.replace("/images/", "");
        const localFilePath = path.join(PUBLIC_DIR, "images", localFileName);
        if (fs.existsSync(localFilePath)) {
          try { fs.unlinkSync(localFilePath); } catch (e) {}
        }
        const rootFilePath = path.join(process.cwd(), "public", "images", localFileName);
        if (fs.existsSync(rootFilePath)) {
          try { fs.unlinkSync(rootFilePath); } catch (e) {}
        }
      }
      
      db.photos = db.photos.filter(p => p.id !== id);
      if (db.photos.length < initialLength) {
        saveLocalDb(db);
        return res.json({ success: true, message: "Foto berhasil dihapus dari local DB." });
      } else {
        return res.status(404).json({ error: "Foto tidak ditemukan." });
      }
    } catch (err: any) {
      return res.status(500).json({ error: "Gagal menghapus foto dari local DB.", details: err.message });
    }
  }

  try {
    // Attempt deleting local file to keep space green
    const pResult = await pool.query("SELECT url FROM photos WHERE id = $1", [id]);
    if (pResult.rows.length > 0) {
      const photoUrl = pResult.rows[0].url;
      if (photoUrl.startsWith("/images/")) {
        const localFileName = photoUrl.replace("/images/", "");
        const localFilePath = path.join(PUBLIC_DIR, "images", localFileName);
        if (fs.existsSync(localFilePath)) {
          try { fs.unlinkSync(localFilePath); } catch (e) {}
        }
        const rootFilePath = path.join(process.cwd(), "public", "images", localFileName);
        if (fs.existsSync(rootFilePath)) {
          try { fs.unlinkSync(rootFilePath); } catch (e) {}
        }
      }
    }

    const result = await pool.query("DELETE FROM photos WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount && result.rowCount > 0) {
      return res.json({ success: true, message: "Foto berhasil dihapus dari database." });
    } else {
      return res.status(404).json({ error: "Foto tidak ditemukan di database." });
    }
  } catch (err: any) {
    console.error("Error deleting photo from database:", err);
    return res.status(500).json({ error: "Gagal menghapus foto dari database.", details: err.message });
  }
});

// POST Admin Login (Database-Based)
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username dan Password/PIN wajib diisi." });
  }

  try {
    const trimmedUser = String(username).trim();
    const trimmedPass = String(password).trim();
    
    // Hash password with sha256 to compare against the database
    const hashedPassword = crypto.createHash("sha256").update(trimmedPass).digest("hex");
    
    if (useLocalFallback) {
      const db = loadLocalDb();
      const user = db.admin_users.find(u => u.username.toLowerCase() === trimmedUser.toLowerCase());

      if (!user) {
        return res.status(401).json({ error: "Username atau sandi/PIN salah." });
      }

      if (user.password === hashedPassword) {
        return res.json({
          success: true,
          message: "Autentikasi berhasil.",
          user: {
            id: user.id,
            username: user.username,
            name: user.name || user.username
          }
        });
      } else {
        return res.status(401).json({ error: "Username atau sandi/PIN salah." });
      }
    }

    const queryStr = `
      SELECT id, username, name, password 
      FROM admin_users 
      WHERE LOWER(username) = LOWER($1)
    `;
    const result = await pool.query(queryStr, [trimmedUser]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Username atau sandi/PIN salah." });
    }

    const user = result.rows[0];
    if (user.password === hashedPassword) {
      return res.json({
        success: true,
        message: "Autentikasi berhasil.",
        user: {
          id: user.id,
          username: user.username,
          name: user.name || user.username
        }
      });
    } else {
      return res.status(401).json({ error: "Username atau sandi/PIN salah." });
    }
  } catch (err: any) {
    console.error("Error during admin login verification:", err);
    res.status(500).json({ 
      error: "Sistem gagal memproses autentikasi ke database.", 
      details: err.message 
    });
  }
});

// GET Music.mp3 endpoint (backward-compatible server stream)
app.get("/api/music.mp3", (req, res) => {
  if (fs.existsSync(LOCAL_SONG_FILE)) {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    fs.createReadStream(LOCAL_SONG_FILE).pipe(res);
  } else {
    // Redirect to default live audio source if file isn't populated
    res.redirect("https://pub-c5e31b5cdafb419a86617dd1d3e92ef9.r2.dev/ZAYN%20%26%20Usher%20-%20Risk%20It%2520All.mp3");
  }
});

// POST Download kustom audio file to local public storage to resolve CORS issue
app.post("/api/download-song", async (req, res) => {
  const { url, title } = req.body;

  if (!url || !title) {
    return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
  }

  console.log(`Downloading custom song on separated server: ${title} (${url})`);
  const tempDest = path.join(PUBLIC_DIR, "song_temp.mp3");

  downloadUrl(url, tempDest, async (err) => {
    if (err) {
      console.error("Failed to download requested song kustom:", err.message);
      return res.status(500).json({ error: `Gagal mengunduh musik dari URL: ${err.message}` });
    }

    try {
      if (fs.existsSync(LOCAL_SONG_FILE)) {
        fs.unlinkSync(LOCAL_SONG_FILE);
      }
      fs.renameSync(tempDest, LOCAL_SONG_FILE);

      // Save configurations back to the database
      if (useLocalFallback) {
        const db = loadLocalDb();
        db.settings["active_song_url"] = "/music.mp3";
        db.settings["active_song_title"] = `${title} (Aplikasi Lokal)`;
        saveLocalDb(db);
      } else {
        await pool.query(
          "INSERT INTO settings (key, value) VALUES ('active_song_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
          ["/music.mp3"]
        );
        await pool.query(
          "INSERT INTO settings (key, value) VALUES ('active_song_title', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
          [`${title} (Aplikasi Lokal)`]
        );
      }

      res.json({ 
        success: true, 
        settings: {
          activeSongUrl: "/music.mp3",
          activeSongTitle: `${title} (Aplikasi Lokal)`
        }
      });
    } catch (processErr: any) {
      console.error("Error processing download path details:", processErr);
      res.status(500).json({ error: "Gagal memproses file hasil unduhan kustom musik." });
    }
  });
});

// POST Upload custom local audio file directly to local server storage
app.post("/api/upload-song", (req, res) => {
  const songTitle = req.query.title 
    ? decodeURIComponent(req.query.title as string) 
    : "Lagu Kustom Pengantin";
    
  console.log(`Receiving decoupled stream upload of: "${songTitle}"`);

  const writeStream = fs.createWriteStream(LOCAL_SONG_FILE);
  req.pipe(writeStream);

  writeStream.on("finish", async () => {
    try {
      if (useLocalFallback) {
        const db = loadLocalDb();
        db.settings["active_song_url"] = "/music.mp3";
        db.settings["active_song_title"] = `${songTitle} (Hasil Unggah)`;
        saveLocalDb(db);
      } else {
        await pool.query(
          "INSERT INTO settings (key, value) VALUES ('active_song_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
          ["/music.mp3"]
        );
        await pool.query(
          "INSERT INTO settings (key, value) VALUES ('active_song_title', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
          [`${songTitle} (Hasil Unggah)`]
        );
      }

      res.json({ 
        success: true, 
        settings: {
          activeSongUrl: "/music.mp3",
          activeSongTitle: `${songTitle} (Hasil Unggah)`
        } 
      });
    } catch (dbErr) {
      console.error("Gagal memperbarui konfigurasi musik database:", dbErr);
      res.status(500).json({ error: "Lagu diunggah tapi db gagal memperbarui settings." });
    }
  });

  writeStream.on("error", (err) => {
    console.error("Error processing request upload streams:", err);
    res.status(500).json({ error: "Gagal memproses streams berkas musik di server." });
  });
});

// Serve static frontend assets in production
if (isProd) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    // Avoid intercepting API routes
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// -----------------------------------------------------------------
// BOOTSTRAP EXPRESS SERVER
// -----------------------------------------------------------------
async function main() {
  await initDb();
  checkAndDownloadLocalSong();
  copyWorkspaceImagesToBackend();
  
  app.listen(PORT, () => {
    console.log(`[Wed] Separated Express Backend running on PORT: ${PORT}`);
  });
}

main().catch(console.error);

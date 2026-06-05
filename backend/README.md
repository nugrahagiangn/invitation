# Panduan Hubungan Frontend & Backend PostgreSQL (Domainesia)

Repositori ini telah dikonversi dan menyertakan folder `/backend` terpisah yang menggunakan **PostgreSQL** sebagai database utama menggantikan file JSON lokal. Dengan arsitektur ini, Anda dapat menghosting frontend secara statis (seperti di Github Pages atau cPanel Public HTML) dan backend Node.js pada subdomain atau server terpisah (misalnya `https://api.nugrahagiangn.my.id`).

---

## 📂 Struktur Folder Backend (`/backend`)

Seluruh komponen Server Node.js berada di dalam direktori `/backend`:

- `server.ts` — Server Express utama yang terhubung ke PostgreSQL, menangani CORS, melayani unggahan berkas lagu, melayani berkas foto undangan pengantin secara statis, dan memicu auto-bootstrap tabel database serta penyalinan gambar otomatis pada boot pertama.
- `public/images/` — Ruang peyimpanan gambar-gambar undangan (seperti gambar mempelai pria/wanita, background, dan emblem) agar sepenuhnya dilayani dari backend.
- `schema.sql` — Skrip DQL/DDL untuk membuat tabel `guestbook` dan `settings` beserta indeksnya di database PostgreSQL.
- `package.json` & `tsconfig.json` — Dependensi server (`pg`, `express`, `cors`, `dotenv`) serta petunjuk tipe data TypeScript.
- `.env.example` — Contoh konfigurasi variabel lingkungan (.env) untuk kredensial database.

---

## 🛠️ Langkah Menghubungkan Frontend ke Backend Baru

### 1. Konfigurasi Endpoint di Frontend (React Vite)

Di dalam kode React Anda, semua panggilan API kini merujuk pada helper `getApiUrl` yang memanfaatkan variabel lingkungan `VITE_API_URL`. Untuk menghubungkan frontend dengan server terpisah Anda:

1. Buat berkas `.env.production` (atau ganti dalam konfigurasi build Anda) di folder root proyek (induk frontend):
   ```env
   VITE_API_URL=https://api.nugrahagiangn.my.id
   ```
2. Jalankan perintah build untuk menghasilkan aset statis HTML/JS/CSS yang sudah dikompilasi:
   ```bash
   npm run build
   ```
3. Aset di dalam direktori `/dist` adalah frontend statis murni siap pasang. Unggah semua berkas di dalam `/dist` ke folder `public_html` domain utama Anda (`nugrahagiangn.my.id`) di Domainesia.

---

## 🗄️ Langkah Menyiapkan PostgreSQL di Domainesia (cPanel)

1. Masuk ke **cPanel Domainesia** Anda.
2. Cari menu **PostgreSQL Databases**.
3. **Buat Database Baru:** Masukkan nama database, misalnya `gnwedd`.
4. **Buat Pengguna Database Baru:** Masukkan nama pengguna (misal: `nugrahag_wedding_user`) dan buat password yang aman.
5. **Hubungkan User ke Database:** Tambahkan user tersebut ke database baru dengan seluruh hak akses (All Privileges).
6. **Impor Skrip Tabel:**
   - Buka **phpPgAdmin** di cPanel Anda.
   - Pilih database yang baru dibuat.
   - Masuk ke menu **SQL**, salin seluruh kode dari file `/backend/schema.sql`, tempel di kolom teks SQL, lalu klik **Execute/Go**. (Sebagai alternatif, Express backend akan otomatis mencoba membuat tabel saat pertama kali berhasil terhubung ke server database Anda).

---

## 🚀 Langkah Menghosting Backend Node.js di Domainesia

Ada dua cara utama tergantung jenis layanan Domainesia Anda (Shared Hosting cPanel vs VPS):

### Opsi A: Menggunakan Node.js Selector di cPanel (Shared/Cloud Hosting)

1. Buka menu **Setup Node.js App** di cPanel Domainesia Anda.
2. Klik **Create Application**.
3. Isi parameter aplikasi:
   - **Node.js Version:** Pilih versi terbaru (misal: `20.x` atau `18.x`).
   - **Application Mode:** Pilih `Production`.
   - **Application Root:** Isi dengan lokasi berkas backend Anda (misalnya `public_html/api` atau folder root khusus seperti `wedding-backend`).
   - **Application URL:** Hubungkan ke subdomain Anda, misalnya `api.nugrahagiangn.my.id`.
   - **Application Startup File:** Isi dengan berkas entri server yang dikompilasi `dist/server.js` (Atau jika menggunakan `tsx` langsung jalankan `server.ts`).
4. Klik **Create**.
5. **Tambahkan Environment Variables (Variables Lingkungan):** Di halaman konfigurasi aplikasi Node.js tersebut, tambahkan variabel berikut:
   - `NODE_ENV` = `production`
   - `DB_HOST` = `localhost` (atau host server PostgreSQL Anda)
   - `DB_PORT` = `5432`
   - `DB_USER` = `username_database_anda` (seperti `nugrahag_wedding_user`)
   - `DB_PASSWORD` = `password_database_anda`
   - `DB_NAME` = `nama_database_anda` (seperti `gnwedd`)
   - `ALLOWED_ORIGINS` = `https://nugrahagiangn.my.id` (Alamat domain frontend Anda agar diperbolehkan mengakses database)
6. **Unggah Berkas Backend:**
   - Unggah berkas dari folder `/backend` lokal ke folder Application Root Anda di cPanel (menggunakan cPanel File Manager / FTP).
7. **Instalasi Paket npm:**
   - Di panel Setup Node.js App cPanel, scroll ke bawah ke bagian **npm Packages** dan klik tombol **Run npm Install**.
   - Setelah selesai, klik tombol **Start/Restart Application** di kanan atas.

---

### Opsi B: Menggunakan VPS (Akses SSH)

Jika Anda menggunakan VPS Domainesia, Anda memiliki kendali penuh:

1. Clone / Salin folder `/backend` ke VPS Anda.
2. Masuk ke folder `/backend` via SSH:
   ```bash
   cd /path/to/backend
   ```
3. Instal semua dependensi:
   ```bash
   npm install
   ```
4. Ubah nama `.env.example` menjadi `.env` dan sesuaikan nilainya:
   ```bash
   mv .env.example .env
   nano .env
   ```
5. Kompilasi TypeScript ke format Javascript siap saji:
   ```bash
   npm run build
   ```
6. Jalankan menggunakan manajer proses latar belakang seperti **PM2** agar server terus menyala secara otomatis:
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name "wedding-backend"
   pm2 save
   pm2 startup
   ```

---

## 🎯 Verifikasi Pengujian

Setelah semuanya berjalan:

1. Akses halaman backend gratis Anda di browser: `https://api.nugrahagiangn.my.id/`.
   - Anda harus menerima respons bertuliskan:
     ```json
     {
       "status": "online",
       "message": "Wedding Invitation PostgreSQL Decoupled Backend is healthy.",
       "domain": "nugrahagiangn.my.id"
     }
     ```
2. Buka web undangan pernikahan utama Anda di `https://nugrahagiangn.my.id`.
3. Coba isi Buku Tamu / RSVP dan kirim ucapan. Layanan akan otomatis mengirim data tersebut ke database PostgreSQL Anda dengan aman dan cepat!

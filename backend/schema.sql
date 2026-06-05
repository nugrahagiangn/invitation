-- =====================================================================
-- SCHEMA BOOTSTRAP FOR WEDDING INVITATION GIAN & CUCU
-- Target Host: Domainesia PostgreSQL database (nugrahagiangn.my.id)
-- =====================================================================

-- 1. Create Guestbook table for storing comments and RSVPs
CREATE TABLE IF NOT EXISTS guestbook (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    relationship VARCHAR(100) DEFAULT 'Teman',
    rsvp_hadir VARCHAR(20) NOT NULL,
    count_guests INT DEFAULT 1,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index to optimize fetching and ordering guest messages by date
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);

-- 2. Create Settings table to store custom background music states
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL
);

-- Prepopulate Settings defaults
INSERT INTO settings (key, value)
VALUES 
    ('active_song_url', '/music.mp3'),
    ('active_song_title', 'Bruno Mars - Risk It All (Aplikasi Lokal)')
ON CONFLICT (key) DO NOTHING;

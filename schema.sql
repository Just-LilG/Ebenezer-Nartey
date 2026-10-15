-- Run this once in your Neon (Postgres) database
CREATE TABLE guestbook (id SERIAL PRIMARY KEY, name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80), message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000), status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE memories (id SERIAL PRIMARY KEY, name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80), story TEXT CHECK (char_length(story) <= 2000), media_url TEXT, media_type TEXT CHECK (media_type IN ('image','video','audio')), status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE rsvps (id SERIAL PRIMARY KEY, name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80), phone TEXT, attending_events TEXT[] NOT NULL DEFAULT '{}', headcount INT NOT NULL DEFAULT 1 CHECK (headcount BETWEEN 1 AND 50), dietary TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE candles (id SERIAL PRIMARY KEY, name TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE events (id SERIAL PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, event_date DATE NOT NULL, start_time TEXT, venue TEXT, address TEXT, map_url TEXT, notes TEXT, sort_order INT NOT NULL DEFAULT 0);
CREATE TABLE site_content (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE timeline (id SERIAL PRIMARY KEY, year INT NOT NULL, title TEXT NOT NULL, description TEXT, photo_url TEXT);
CREATE TABLE media (id SERIAL PRIMARY KEY, content_type TEXT NOT NULL, data BYTEA NOT NULL, kind TEXT NOT NULL DEFAULT 'guest', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX guestbook_status_idx ON guestbook(status, created_at DESC);
CREATE INDEX memories_status_idx ON memories(status, created_at DESC);
INSERT INTO events (slug,title,event_date,venue,sort_order) VALUES ('laying-in-state','Laying in state','2026-10-16','Kpongunor',1),('burial','Burial service','2026-10-17','Kpongunor',2),('thanksgiving','Thanksgiving service','2026-10-18','Kpongunor',3);
INSERT INTO site_content (key,value) VALUES ('full_name','Ebenezer Nartey'),('born','1981-05-08'),('passed','July 2026'),('age','45'),('admin_email','godblessnartey@gmail.com'),('life_story',''),('quote',''),('contact','');

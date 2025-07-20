-- =============================================
-- DEPLOYMENT SCRIPT FOR AURARADIO DATABASE
-- This script will update your existing database to match the new schema
-- =============================================

BEGIN;

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- UPDATE EXISTING TABLES
-- =============================================

-- Update profiles table
ALTER TABLE profiles 
  DROP COLUMN IF EXISTS subscription_expires_at,
  DROP COLUMN IF EXISTS deleted_at,
  ADD COLUMN IF NOT EXISTS play_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ DEFAULT NOW();

-- Ensure profiles has correct constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'premium', 'free'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'profiles_subscription_plan_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_plan_check 
    CHECK (subscription_plan IN ('free', 'premium', 'family'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'profiles_subscription_status_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
    CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'pending'));
  END IF;
END $$;

-- Update artists table (remove extra columns)
ALTER TABLE artists 
  DROP COLUMN IF EXISTS spotify_id,
  DROP COLUMN IF EXISTS apple_music_id,
  DROP COLUMN IF EXISTS metadata,
  DROP COLUMN IF EXISTS deleted_at,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by;

-- =============================================
-- CREATE NEW TABLES
-- =============================================

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  release_date DATE,
  genre TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update songs table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'songs' AND column_name = 'file_url') THEN
    ALTER TABLE songs RENAME COLUMN file_url TO url;
  END IF;
END $$;

ALTER TABLE songs 
  DROP COLUMN IF EXISTS file_size,
  DROP COLUMN IF EXISTS file_format,
  DROP COLUMN IF EXISTS compressed_url,
  DROP COLUMN IF EXISTS compressed_size,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS play_count,
  DROP COLUMN IF EXISTS metadata,
  DROP COLUMN IF EXISTS deleted_at,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by,
  ADD COLUMN IF NOT EXISTS album_id UUID REFERENCES albums(id) ON DELETE SET NULL;

-- Ensure songs has url column and it's not null
ALTER TABLE songs 
  ALTER COLUMN url SET NOT NULL;

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  tracks_count INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlist tracks table
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jams table
CREATE TABLE IF NOT EXISTS jams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  invite_code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  current_song_id UUID REFERENCES songs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update radio_stations table
ALTER TABLE radio_stations 
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS deleted_at,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;

-- Ensure radio_stations has the new columns and constraints
ALTER TABLE radio_stations 
  ALTER COLUMN stream_url SET NOT NULL;

-- Radio station songs table
CREATE TABLE IF NOT EXISTS radio_station_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_station_id UUID REFERENCES radio_stations(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update subscriptions table
ALTER TABLE subscriptions 
  DROP COLUMN IF EXISTS stripe_subscription_id,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS current_period_start,
  DROP COLUMN IF EXISTS current_period_end,
  DROP COLUMN IF EXISTS cancel_at_period_end,
  DROP COLUMN IF EXISTS cancelled_at,
  DROP COLUMN IF EXISTS metadata,
  DROP COLUMN IF EXISTS deleted_at,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS renewed_at TIMESTAMPTZ;

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI radio jobs table
CREATE TABLE IF NOT EXISTS ai_radio_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  radio_station_id UUID REFERENCES radio_stations(id) ON DELETE SET NULL,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly AI radios table
CREATE TABLE IF NOT EXISTS weekly_ai_radios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  theme TEXT NOT NULL,
  generated_at TIMESTAMPTZ,
  radio_station_id UUID REFERENCES radio_stations(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- =============================================
-- CREATE OR UPDATE FUNCTIONS
-- =============================================

-- Function to increment play count
CREATE OR REPLACE FUNCTION increment_play_count(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE profiles 
  SET play_count = COALESCE(play_count, 0) + 1,
      updated_at = NOW()
  WHERE id = user_id_param;
END;
$function$;

-- Function to update playlist stats
CREATE OR REPLACE FUNCTION update_playlist_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE playlists 
    SET tracks_count = (
      SELECT COUNT(*) 
      FROM playlist_tracks 
      WHERE playlist_id = OLD.playlist_id
    ),
    total_duration = (
      SELECT COALESCE(SUM(s.duration), 0)
      FROM playlist_tracks pt
      JOIN songs s ON pt.song_id = s.id
      WHERE pt.playlist_id = OLD.playlist_id
    ),
    updated_at = NOW()
    WHERE id = OLD.playlist_id;
    RETURN OLD;
  ELSE
    UPDATE playlists 
    SET tracks_count = (
      SELECT COUNT(*) 
      FROM playlist_tracks 
      WHERE playlist_id = NEW.playlist_id
    ),
    total_duration = (
      SELECT COALESCE(SUM(s.duration), 0)
      FROM playlist_tracks pt
      JOIN songs s ON pt.song_id = s.id
      WHERE pt.playlist_id = NEW.playlist_id
    ),
    updated_at = NOW()
    WHERE id = NEW.playlist_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to generate weekly AI radios
CREATE OR REPLACE FUNCTION generate_weekly_ai_radio()
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    user_record RECORD;
    current_week_start DATE;
    theme_options TEXT[] := ARRAY[
        'Chill Vibes',
        'Energy Boost',
        'Focus Mode',
        'Party Mix',
        'Nostalgic Hits',
        'Discovery Mode',
        'Workout Beats'
    ];
    selected_theme TEXT;
BEGIN
    -- Get the start of current week (Monday)
    current_week_start := DATE_TRUNC('week', CURRENT_DATE);
    
    -- Loop through all premium and family users
    FOR user_record IN 
        SELECT id FROM profiles 
        WHERE subscription_plan IN ('premium', 'family') 
        AND subscription_status = 'active'
    LOOP
        -- Check if user doesn't already have a radio for this week
        IF NOT EXISTS (
            SELECT 1 FROM weekly_ai_radios 
            WHERE user_id = user_record.id 
            AND week_start_date = current_week_start
        ) THEN
            -- Select a random theme
            selected_theme := theme_options[FLOOR(RANDOM() * ARRAY_LENGTH(theme_options, 1)) + 1];
            
            -- Insert new weekly radio job
            INSERT INTO weekly_ai_radios (
                user_id, 
                week_start_date, 
                theme, 
                status
            ) VALUES (
                user_record.id, 
                current_week_start, 
                selected_theme, 
                'pending'
            );
        END IF;
    END LOOP;
END;
$function$;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CREATE OR UPDATE TRIGGERS
-- =============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS playlist_stats_trigger ON playlist_tracks;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
DROP TRIGGER IF EXISTS update_artists_updated_at ON artists;
DROP TRIGGER IF EXISTS update_albums_updated_at ON albums;
DROP TRIGGER IF EXISTS update_playlists_updated_at ON playlists;
DROP TRIGGER IF EXISTS update_jams_updated_at ON jams;
DROP TRIGGER IF EXISTS update_radio_stations_updated_at ON radio_stations;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
DROP TRIGGER IF EXISTS update_ai_radio_jobs_updated_at ON ai_radio_jobs;
DROP TRIGGER IF EXISTS update_weekly_ai_radios_updated_at ON weekly_ai_radios;

-- Create triggers
CREATE TRIGGER playlist_stats_trigger
  AFTER INSERT OR DELETE ON playlist_tracks
  FOR EACH ROW EXECUTE FUNCTION update_playlist_stats();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jams_updated_at BEFORE UPDATE ON jams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_radio_stations_updated_at BEFORE UPDATE ON radio_stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_radio_jobs_updated_at BEFORE UPDATE ON ai_radio_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_ai_radios_updated_at BEFORE UPDATE ON weekly_ai_radios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_song_id ON playlist_tracks(song_id);
CREATE INDEX IF NOT EXISTS idx_jams_host_id ON jams(host_id);
CREATE INDEX IF NOT EXISTS idx_jams_invite_code ON jams(invite_code);
CREATE INDEX IF NOT EXISTS idx_radio_stations_genre ON radio_stations(genre);
CREATE INDEX IF NOT EXISTS idx_radio_stations_is_ai_generated ON radio_stations(is_ai_generated);
CREATE INDEX IF NOT EXISTS idx_radio_station_songs_radio_station_id ON radio_station_songs(radio_station_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_radio_jobs_user_id ON ai_radio_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_radio_jobs_status ON ai_radio_jobs(status);
CREATE INDEX IF NOT EXISTS idx_weekly_ai_radios_user_id ON weekly_ai_radios(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_ai_radios_week_start_date ON weekly_ai_radios(week_start_date);

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
GRANT EXECUTE ON FUNCTION increment_play_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_weekly_ai_radio() TO authenticated;

COMMIT;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Uncomment these to verify the deployment
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT function_name FROM information_schema.routines WHERE routine_schema = 'public' ORDER BY function_name;

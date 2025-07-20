-- =============================================
-- AURARADIO DATABASE SCHEMA (COMPLETO Y ACTUALIZADO)
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CREATE AUTH SCHEMA IF NOT EXISTS
-- =============================================
CREATE SCHEMA IF NOT EXISTS auth;

-- =============================================
-- AUTH.USERS TABLE (Compatible with Supabase Auth)
-- =============================================
CREATE TABLE IF NOT EXISTS auth.users (
  instance_id UUID,
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aud VARCHAR(255),
  role VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  encrypted_password VARCHAR(255),
  email_confirmed_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  confirmation_token VARCHAR(255),
  confirmation_sent_at TIMESTAMPTZ,
  recovery_token VARCHAR(255),
  recovery_sent_at TIMESTAMPTZ,
  email_change_token_new VARCHAR(255),
  email_change VARCHAR(255),
  email_change_sent_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  phone TEXT,
  phone_confirmed_at TIMESTAMPTZ,
  phone_change TEXT,
  phone_change_token VARCHAR(255),
  phone_change_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  email_change_token_current VARCHAR(255),
  email_change_confirm_status SMALLINT DEFAULT 0,
  banned_until TIMESTAMPTZ,
  reauthentication_token VARCHAR(255),
  reauthentication_sent_at TIMESTAMPTZ,
  is_sso_user BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  is_anonymous BOOLEAN DEFAULT FALSE
);

-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert/update/delete
CREATE POLICY "Service role can manage users" ON auth.users
FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Users can view own profile" ON auth.users
FOR SELECT USING (auth.uid() = id);

-- Grant permissions to service role and authenticated users
GRANT ALL ON auth.users TO service_role;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth.users TO anon;

-- =============================================
-- USER CREDENTIALS TABLE (Sistema propio de auth)
-- =============================================
CREATE TABLE IF NOT EXISTS user_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires_at TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  id_profile UUID
);

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'free' CHECK (role IN ('admin', 'premium', 'free')),
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'family')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'pending')),
  play_count INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint after both tables are created
ALTER TABLE user_credentials 
ADD CONSTRAINT fk_user_credentials_profile 
FOREIGN KEY (id_profile) REFERENCES profiles(id) ON DELETE CASCADE;

-- =============================================
-- USER SESSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ARTISTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ALBUMS TABLE
-- =============================================
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

-- =============================================
-- SONGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL,
  genre TEXT,
  url TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PLAYLISTS TABLE
-- =============================================
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

-- =============================================
-- PLAYLIST TRACKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- JAMS (USER MUSIC SHARING / TEMP PLAYLISTS)
-- =============================================
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

-- =============================================
-- RADIO STATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS radio_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  logo_url TEXT,
  genre TEXT,
  language TEXT,
  country TEXT,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  play_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RADIO STATION SONGS (para radios AI generadas)
-- =============================================
CREATE TABLE IF NOT EXISTS radio_station_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_station_id UUID REFERENCES radio_stations(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free', 'premium', 'family')),
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  renewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER PREFERENCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AI RADIO GENERATION JOBS TABLE
-- =============================================
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

-- =============================================
-- WEEKLY AI RADIO SCHEDULE TABLE
-- =============================================
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
-- PROCEDURE TO INCREMENT PLAY COUNT
-- =============================================
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

-- =============================================
-- FUNCTION TO UPDATE PLAYLIST STATS
-- =============================================
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

-- =============================================
-- FUNCTION TO GENERATE WEEKLY AI RADIO
-- =============================================
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

-- =============================================
-- TRIGGER FOR PLAYLIST TRACKS INSERT/DELETE
-- =============================================
DROP TRIGGER IF EXISTS playlist_stats_trigger ON playlist_tracks;
CREATE TRIGGER playlist_stats_trigger
  AFTER INSERT OR DELETE ON playlist_tracks
  FOR EACH ROW EXECUTE FUNCTION update_playlist_stats();

-- =============================================
-- FUNCTION TO UPDATE updated_at ON ROW CHANGES
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS FOR AUTOMATIC updated_at
-- =============================================
DROP TRIGGER IF EXISTS update_user_credentials_updated_at ON user_credentials;
CREATE TRIGGER update_user_credentials_updated_at BEFORE UPDATE ON user_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_artists_updated_at ON artists;
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_albums_updated_at ON albums;
CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_playlists_updated_at ON playlists;
CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jams_updated_at ON jams;
CREATE TRIGGER update_jams_updated_at BEFORE UPDATE ON jams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_radio_stations_updated_at ON radio_stations;
CREATE TRIGGER update_radio_stations_updated_at BEFORE UPDATE ON radio_stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_radio_jobs_updated_at ON ai_radio_jobs;
CREATE TRIGGER update_ai_radio_jobs_updated_at BEFORE UPDATE ON ai_radio_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_weekly_ai_radios_updated_at ON weekly_ai_radios;
CREATE TRIGGER update_weekly_ai_radios_updated_at BEFORE UPDATE ON weekly_ai_radios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
GRANT EXECUTE ON FUNCTION increment_play_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_weekly_ai_radio() TO authenticated;

-- =============================================
-- AUTHENTICATION FUNCTIONS
-- =============================================

-- Función para hashear contraseñas
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TABLE(hash TEXT, salt TEXT) AS $$
DECLARE
  generated_salt TEXT;
  password_hash TEXT;
BEGIN
  generated_salt := encode(gen_random_bytes(16), 'hex');
  password_hash := encode(digest(password || generated_salt, 'sha256'), 'hex');
  RETURN QUERY SELECT password_hash, generated_salt;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar contraseñas
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT, salt TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN encode(digest(password || salt, 'sha256'), 'hex') = hash;
END;
$$ LANGUAGE plpgsql;

-- Función para crear usuario (VERSION SIMPLIFICADA SIN AUTH.USERS)
CREATE OR REPLACE FUNCTION create_user(
  email_param TEXT,
  password_param TEXT,
  full_name_param TEXT DEFAULT NULL
)
RETURNS TABLE(user_id UUID, success BOOLEAN, message TEXT) AS $$
DECLARE
  new_user_id UUID;
  credentials_id UUID;
  pwd_hash TEXT;
  pwd_salt TEXT;
BEGIN
  -- Verificar si el email ya existe en user_credentials
  IF EXISTS (SELECT 1 FROM user_credentials WHERE email = email_param) THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Email already exists';
    RETURN;
  END IF;

  -- Verificar formato de email básico
  IF email_param !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid email format';
    RETURN;
  END IF;

  -- Verificar longitud mínima de contraseña
  IF LENGTH(password_param) < 6 THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Password must be at least 6 characters';
    RETURN;
  END IF;

  -- Generar un nuevo UUID que será usado en todas las tablas
  new_user_id := uuid_generate_v4();

  -- Hashear contraseña para nuestro sistema
  SELECT hash, salt INTO pwd_hash, pwd_salt FROM hash_password(password_param);

  BEGIN
    -- Crear perfil con el ID generado
    INSERT INTO profiles (id, email, full_name)
    VALUES (new_user_id, email_param, full_name_param);

    -- Crear credenciales con el mismo ID de perfil
    INSERT INTO user_credentials (email, password_hash, salt, id_profile)
    VALUES (email_param, pwd_hash, pwd_salt, new_user_id);

    -- OPCIONAL: Solo si tienes permisos, crear en auth.users
    BEGIN
      INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        aud,
        role
      ) VALUES (
        new_user_id,
        email_param,
        crypt(password_param, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        NOW(),
        jsonb_build_object('full_name', full_name_param),
        'authenticated',
        'authenticated'
      );
    EXCEPTION
      WHEN insufficient_privilege THEN
        -- Si no tienes permisos para auth.users, continúa sin error
        RAISE NOTICE 'Warning: Could not create user in auth.users table due to insufficient privileges';
      WHEN OTHERS THEN
        -- Para otros errores en auth.users, también continúa
        RAISE NOTICE 'Warning: Could not create user in auth.users table: %', SQLERRM;
    END;

    RETURN QUERY SELECT new_user_id, TRUE, 'User created successfully';

  EXCEPTION
    WHEN OTHERS THEN
      -- Si hay algún error en las tablas principales, devolver el error
      RETURN QUERY SELECT NULL::UUID, FALSE, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;

-- Función para login
CREATE OR REPLACE FUNCTION login_user(
  email_param TEXT,
  password_param TEXT,
  ip_address_param TEXT DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
)
RETURNS TABLE(
  user_id UUID, 
  success BOOLEAN, 
  message TEXT,
  session_token TEXT,
  user_data JSONB
) AS $$
DECLARE
  cred_record RECORD;
  profile_record RECORD;
  new_session_token TEXT;
  expires_at TIMESTAMPTZ;
BEGIN
  -- Buscar credenciales
  SELECT * INTO cred_record 
  FROM user_credentials 
  WHERE email = email_param;

  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid credentials', NULL::TEXT, NULL::JSONB;
    RETURN;
  END IF;

  -- Verificar si está bloqueado
  IF cred_record.locked_until IS NOT NULL AND cred_record.locked_until > NOW() THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Account temporarily locked. Try again later.', NULL::TEXT, NULL::JSONB;
    RETURN;
  END IF;

  -- Verificar contraseña
  IF NOT verify_password(password_param, cred_record.password_hash, cred_record.salt) THEN
    -- Incrementar intentos fallidos
    UPDATE user_credentials 
    SET failed_login_attempts = failed_login_attempts + 1,
        locked_until = CASE 
          WHEN failed_login_attempts >= 4 THEN NOW() + INTERVAL '15 minutes'
          ELSE locked_until
        END,
        updated_at = NOW()
    WHERE id = cred_record.id;
    
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid credentials', NULL::TEXT, NULL::JSONB;
    RETURN;
  END IF;

  -- Resetear intentos fallidos y actualizar último login
  UPDATE user_credentials 
  SET failed_login_attempts = 0,
      locked_until = NULL,
      last_login = NOW(),
      updated_at = NOW()
  WHERE id = cred_record.id;

  -- Obtener datos del perfil
  SELECT * INTO profile_record
  FROM profiles
  WHERE id = cred_record.id_profile;

  -- Crear sesión
  new_session_token := encode(gen_random_bytes(32), 'hex');
  expires_at := NOW() + INTERVAL '7 days';
  
  INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
  VALUES (profile_record.id, new_session_token, expires_at, ip_address_param::INET, user_agent_param);

  -- Actualizar última actividad
  UPDATE profiles SET last_active = NOW(), updated_at = NOW() WHERE id = profile_record.id;

  RETURN QUERY SELECT 
    profile_record.id,
    TRUE,
    'Login successful',
    new_session_token,
    jsonb_build_object(
      'id', profile_record.id,
      'email', profile_record.email,
      'full_name', profile_record.full_name,
      'avatar_url', profile_record.avatar_url,
      'role', profile_record.role,
      'subscription_plan', profile_record.subscription_plan,
      'subscription_status', profile_record.subscription_status,
      'play_count', profile_record.play_count,
      'created_at', profile_record.created_at
    );
END;
$$ LANGUAGE plpgsql;

-- Función para validar sesión
CREATE OR REPLACE FUNCTION validate_session(session_token_param TEXT)
RETURNS TABLE(user_data JSONB, valid BOOLEAN) AS $$
DECLARE
  session_record RECORD;
  profile_record RECORD;
BEGIN
  -- Buscar sesión activa
  SELECT * INTO session_record
  FROM user_sessions
  WHERE session_token = session_token_param
    AND expires_at > NOW()
    AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::JSONB, FALSE;
    RETURN;
  END IF;

  -- Obtener datos del usuario
  SELECT * INTO profile_record
  FROM profiles
  WHERE id = session_record.user_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::JSONB, FALSE;
    RETURN;
  END IF;

  -- Actualizar última actividad
  UPDATE profiles SET last_active = NOW(), updated_at = NOW() WHERE id = profile_record.id;
  UPDATE user_sessions SET updated_at = NOW() WHERE id = session_record.id;

  RETURN QUERY SELECT 
    jsonb_build_object(
      'id', profile_record.id,
      'email', profile_record.email,
      'full_name', profile_record.full_name,
      'avatar_url', profile_record.avatar_url,
      'role', profile_record.role,
      'subscription_plan', profile_record.subscription_plan,
      'subscription_status', profile_record.subscription_status,
      'play_count', profile_record.play_count,
      'preferences', profile_record.preferences,
      'last_active', profile_record.last_active,
      'created_at', profile_record.created_at
    ),
    TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para logout (invalidar sesión)
CREATE OR REPLACE FUNCTION logout_user(session_token_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_sessions 
  SET is_active = FALSE, updated_at = NOW()
  WHERE session_token = session_token_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Función para logout de todas las sesiones de un usuario
CREATE OR REPLACE FUNCTION logout_all_sessions(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE user_sessions 
  SET is_active = FALSE, updated_at = NOW()
  WHERE user_id = user_id_param AND is_active = TRUE;
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Función para cambiar contraseña
CREATE OR REPLACE FUNCTION change_password(
  user_id_param UUID,
  old_password TEXT,
  new_password TEXT
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  cred_record RECORD;
  pwd_hash TEXT;
  pwd_salt TEXT;
BEGIN
  -- Buscar credenciales del usuario
  SELECT uc.* INTO cred_record
  FROM user_credentials uc
  WHERE uc.id_profile = user_id_param;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'User not found';
    RETURN;
  END IF;

  -- Verificar contraseña actual
  IF NOT verify_password(old_password, cred_record.password_hash, cred_record.salt) THEN
    RETURN QUERY SELECT FALSE, 'Current password is incorrect';
    RETURN;
  END IF;

  -- Verificar longitud mínima de la nueva contraseña
  IF LENGTH(new_password) < 6 THEN
    RETURN QUERY SELECT FALSE, 'New password must be at least 6 characters';
    RETURN;
  END IF;

  -- Hashear nueva contraseña
  SELECT hash, salt INTO pwd_hash, pwd_salt FROM hash_password(new_password);

  -- Actualizar contraseña
  UPDATE user_credentials 
  SET password_hash = pwd_hash,
      salt = pwd_salt,
      updated_at = NOW()
  WHERE id = cred_record.id;

  -- Invalidar todas las sesiones activas (forzar re-login)
  PERFORM logout_all_sessions(user_id_param);

  RETURN QUERY SELECT TRUE, 'Password changed successfully';
END;
$$ LANGUAGE plpgsql;

-- Función para generar token de verificación de email
CREATE OR REPLACE FUNCTION generate_verification_token(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  token TEXT;
BEGIN
  token := encode(gen_random_bytes(32), 'hex');
  
  UPDATE user_credentials 
  SET verification_token = token,
      updated_at = NOW()
  WHERE id_profile = user_id_param;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar email
CREATE OR REPLACE FUNCTION verify_email(token TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
BEGIN
  UPDATE user_credentials 
  SET email_verified = TRUE,
      verification_token = NULL,
      updated_at = NOW()
  WHERE verification_token = token;

  IF FOUND THEN
    RETURN QUERY SELECT TRUE, 'Email verified successfully';
  ELSE
    RETURN QUERY SELECT FALSE, 'Invalid or expired verification token';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar plan de suscripción
CREATE OR REPLACE FUNCTION update_subscription_plan(
  user_id_param UUID,
  new_plan TEXT,
  new_status TEXT DEFAULT 'active'
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
BEGIN
  -- Verificar que el plan sea válido
  IF new_plan NOT IN ('basic', 'premium', 'family') THEN
    RETURN QUERY SELECT FALSE, 'Invalid subscription plan';
    RETURN;
  END IF;

  -- Verificar que el status sea válido
  IF new_status NOT IN ('active', 'cancelled', 'expired', 'pending') THEN
    RETURN QUERY SELECT FALSE, 'Invalid subscription status';
    RETURN;
  END IF;

  -- Actualizar perfil
  UPDATE profiles 
  SET subscription_plan = new_plan,
      subscription_status = new_status,
      role = CASE 
        WHEN new_plan IN ('premium', 'family') AND new_status = 'active' THEN 'premium'
        ELSE 'free'
      END,
      updated_at = NOW()
  WHERE id = user_id_param;

  IF FOUND THEN
    -- Actualizar o crear registro de suscripción
    INSERT INTO subscriptions (user_id, plan, status, started_at)
    VALUES (user_id_param, new_plan, new_status, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      plan = EXCLUDED.plan,
      status = EXCLUDED.status,
      renewed_at = NOW(),
      updated_at = NOW();

    RETURN QUERY SELECT TRUE, 'Subscription updated successfully';
  ELSE
    RETURN QUERY SELECT FALSE, 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for authentication functions
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_user(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION login_user(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_session(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION logout_user(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION logout_all_sessions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION change_password(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_verification_token(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_subscription_plan(UUID, TEXT, TEXT) TO authenticated;

-- Also grant to anonymous for registration and login
GRANT EXECUTE ON FUNCTION create_user(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION login_user(TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_email(TEXT) TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_id ON auth.users(id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_email ON user_credentials(email);
CREATE INDEX IF NOT EXISTS idx_user_credentials_id_profile ON user_credentials(id_profile);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);
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
-- INSERT DEMO USERS (FOR TESTING)
-- =============================================

-- Create demo free user
DO $$
BEGIN
    -- Insert only if the user doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo_free@auraradio.com') THEN
        PERFORM create_user('demo_free@auraradio.com', 'demo123', 'Demo Free User');
    END IF;
END $$;

-- Create demo premium user  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo_premium@auraradio.com') THEN
        PERFORM create_user('demo_premium@auraradio.com', 'demo123', 'Demo Premium User');
        -- Update to premium subscription
        PERFORM update_subscription_plan(
            (SELECT id FROM profiles WHERE email = 'demo_premium@auraradio.com'),
            'premium',
            'active'
        );
    END IF;
END $$;

-- Create admin user
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'admin@auraradio.com') THEN
        PERFORM create_user('admin@auraradio.com', 'admin123', 'Admin User');
        -- Update to admin role
        UPDATE profiles 
        SET role = 'admin', 
            subscription_plan = 'premium',
            subscription_status = 'active',
            updated_at = NOW()
        WHERE email = 'admin@auraradio.com';
    END IF;
END $$;

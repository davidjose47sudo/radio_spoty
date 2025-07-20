-- =============================================
-- DATOS DE EJEMPLO PARA AURARADIO
-- =============================================

-- Insertar artistas de ejemplo
INSERT INTO artists (name, bio, image_url) VALUES
('The Midnight Runners', 'Indie rock band known for their atmospheric sound', 'https://example.com/midnight-runners.jpg'),
('Luna Martinez', 'Singer-songwriter with a focus on acoustic ballads', 'https://example.com/luna-martinez.jpg'),
('Electronic Pulse', 'Electronic music producer and DJ', 'https://example.com/electronic-pulse.jpg'),
('Vintage Collective', 'Retro-inspired pop group', 'https://example.com/vintage-collective.jpg'),
('Acoustic Souls', 'Folk duo with harmonious vocals', 'https://example.com/acoustic-souls.jpg')
ON CONFLICT DO NOTHING;

-- Insertar albums de ejemplo
INSERT INTO albums (title, artist_id, release_date, genre, cover_url)
SELECT 
  album_data.title,
  a.id as artist_id,
  album_data.release_date::date,
  album_data.genre,
  album_data.cover_url
FROM (
  VALUES 
    ('Midnight Dreams', 'The Midnight Runners', '2023-03-15', 'Indie Rock', 'https://example.com/midnight-dreams.jpg'),
    ('Whispered Stories', 'Luna Martinez', '2022-11-20', 'Acoustic', 'https://example.com/whispered-stories.jpg'),
    ('Digital Horizons', 'Electronic Pulse', '2023-07-08', 'Electronic', 'https://example.com/digital-horizons.jpg'),
    ('Retro Vibes', 'Vintage Collective', '2023-01-12', 'Pop', 'https://example.com/retro-vibes.jpg'),
    ('Harmony & Peace', 'Acoustic Souls', '2022-09-30', 'Folk', 'https://example.com/harmony-peace.jpg')
) AS album_data (title, artist_name, release_date, genre, cover_url)
JOIN artists a ON a.name = album_data.artist_name
ON CONFLICT DO NOTHING;

-- Insertar canciones de ejemplo
INSERT INTO songs (title, artist_id, album_id, duration, genre, url, cover_url)
SELECT 
  song_data.title,
  a.id as artist_id,
  alb.id as album_id,
  song_data.duration,
  song_data.genre,
  song_data.url,
  song_data.cover_url
FROM (
  VALUES 
    -- The Midnight Runners - Midnight Dreams
    ('City Lights', 'The Midnight Runners', 'Midnight Dreams', 235, 'Indie Rock', 'https://example.com/audio/city-lights.mp3', 'https://example.com/covers/city-lights.jpg'),
    ('Neon Shadows', 'The Midnight Runners', 'Midnight Dreams', 198, 'Indie Rock', 'https://example.com/audio/neon-shadows.mp3', 'https://example.com/covers/neon-shadows.jpg'),
    ('Midnight Runner', 'The Midnight Runners', 'Midnight Dreams', 267, 'Indie Rock', 'https://example.com/audio/midnight-runner.mp3', 'https://example.com/covers/midnight-runner.jpg'),
    
    -- Luna Martinez - Whispered Stories
    ('Coffee Shop Serenade', 'Luna Martinez', 'Whispered Stories', 189, 'Acoustic', 'https://example.com/audio/coffee-shop-serenade.mp3', 'https://example.com/covers/coffee-shop-serenade.jpg'),
    ('Rainy Day Blues', 'Luna Martinez', 'Whispered Stories', 156, 'Acoustic', 'https://example.com/audio/rainy-day-blues.mp3', 'https://example.com/covers/rainy-day-blues.jpg'),
    ('Whispered Promises', 'Luna Martinez', 'Whispered Stories', 203, 'Acoustic', 'https://example.com/audio/whispered-promises.mp3', 'https://example.com/covers/whispered-promises.jpg'),
    
    -- Electronic Pulse - Digital Horizons
    ('Synthetic Dreams', 'Electronic Pulse', 'Digital Horizons', 245, 'Electronic', 'https://example.com/audio/synthetic-dreams.mp3', 'https://example.com/covers/synthetic-dreams.jpg'),
    ('Digital Pulse', 'Electronic Pulse', 'Digital Horizons', 189, 'Electronic', 'https://example.com/audio/digital-pulse.mp3', 'https://example.com/covers/digital-pulse.jpg'),
    ('Future Waves', 'Electronic Pulse', 'Digital Horizons', 276, 'Electronic', 'https://example.com/audio/future-waves.mp3', 'https://example.com/covers/future-waves.jpg'),
    
    -- Vintage Collective - Retro Vibes
    ('Dancing Through Time', 'Vintage Collective', 'Retro Vibes', 212, 'Pop', 'https://example.com/audio/dancing-through-time.mp3', 'https://example.com/covers/dancing-through-time.jpg'),
    ('Neon Nights', 'Vintage Collective', 'Retro Vibes', 198, 'Pop', 'https://example.com/audio/neon-nights.mp3', 'https://example.com/covers/neon-nights.jpg'),
    ('Retro Romance', 'Vintage Collective', 'Retro Vibes', 234, 'Pop', 'https://example.com/audio/retro-romance.mp3', 'https://example.com/covers/retro-romance.jpg'),
    
    -- Acoustic Souls - Harmony & Peace
    ('Mountain Breeze', 'Acoustic Souls', 'Harmony & Peace', 167, 'Folk', 'https://example.com/audio/mountain-breeze.mp3', 'https://example.com/covers/mountain-breeze.jpg'),
    ('Peaceful Waters', 'Acoustic Souls', 'Harmony & Peace', 145, 'Folk', 'https://example.com/audio/peaceful-waters.mp3', 'https://example.com/covers/peaceful-waters.jpg'),
    ('Campfire Stories', 'Acoustic Souls', 'Harmony & Peace', 223, 'Folk', 'https://example.com/audio/campfire-stories.mp3', 'https://example.com/covers/campfire-stories.jpg')
) AS song_data (title, artist_name, album_title, duration, genre, url, cover_url)
JOIN artists a ON a.name = song_data.artist_name
JOIN albums alb ON alb.title = song_data.album_title AND alb.artist_id = a.id
ON CONFLICT DO NOTHING;

-- Insertar estaciones de radio tradicionales
INSERT INTO radio_stations (name, stream_url, logo_url, genre, language, country, is_ai_generated, is_active) VALUES
('Indie Rock Central', 'https://stream.example.com/indie-rock', 'https://example.com/logos/indie-rock-central.jpg', 'Indie Rock', 'en', 'US', false, true),
('Acoustic Café', 'https://stream.example.com/acoustic', 'https://example.com/logos/acoustic-cafe.jpg', 'Acoustic', 'en', 'US', false, true),
('Electronic Vibes', 'https://stream.example.com/electronic', 'https://example.com/logos/electronic-vibes.jpg', 'Electronic', 'en', 'US', false, true),
('Pop Classics', 'https://stream.example.com/pop', 'https://example.com/logos/pop-classics.jpg', 'Pop', 'en', 'US', false, true),
('Folk & Country', 'https://stream.example.com/folk', 'https://example.com/logos/folk-country.jpg', 'Folk', 'en', 'US', false, true)
ON CONFLICT DO NOTHING;

-- Crear una radio AI de ejemplo
INSERT INTO radio_stations (name, stream_url, logo_url, genre, language, country, is_ai_generated, ai_prompt, is_active, metadata) VALUES
('AI Chill Vibes', '', 'https://example.com/logos/ai-chill-vibes.jpg', 'Mixed', 'en', 'US', true, 'Create a relaxing radio station with chill music perfect for studying and focus', true, '{"generated_by_ai": true, "description": "A relaxing mix of chill music perfect for studying and focus"}')
ON CONFLICT DO NOTHING;

-- Agregar algunas canciones a la radio AI de ejemplo
DO $$
DECLARE
    ai_radio_id UUID;
    song_record RECORD;
    counter INTEGER := 0;
BEGIN
    -- Get the AI radio station ID
    SELECT id INTO ai_radio_id FROM radio_stations WHERE name = 'AI Chill Vibes' LIMIT 1;
    
    IF ai_radio_id IS NOT NULL THEN
        -- Add some chill songs (acoustic and folk) to the AI radio
        FOR song_record IN 
            SELECT s.id 
            FROM songs s 
            JOIN artists a ON s.artist_id = a.id 
            WHERE s.genre IN ('Acoustic', 'Folk') 
            ORDER BY RANDOM() 
            LIMIT 8
        LOOP
            INSERT INTO radio_station_songs (radio_station_id, song_id, order_index)
            VALUES (ai_radio_id, song_record.id, counter);
            counter := counter + 1;
        END LOOP;
    END IF;
END $$;

-- Insertar datos de ejemplo para un usuario admin (necesitarás cambiar el UUID por uno real después de crear un usuario)
-- NOTA: Esto es solo un ejemplo, deberás ejecutar esto después de que tengas usuarios reales
/*
INSERT INTO profiles (id, email, full_name, role, subscription_plan, subscription_status) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@auraradio.com', 'Admin User', 'admin', 'premium', 'active')
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    subscription_plan = 'premium',
    subscription_status = 'active';
*/

-- Mostrar un resumen de los datos insertados
SELECT 
    'Artists' as table_name, COUNT(*) as record_count FROM artists
UNION ALL
SELECT 
    'Albums' as table_name, COUNT(*) as record_count FROM albums
UNION ALL
SELECT 
    'Songs' as table_name, COUNT(*) as record_count FROM songs
UNION ALL
SELECT 
    'Radio Stations' as table_name, COUNT(*) as record_count FROM radio_stations
UNION ALL
SELECT 
    'Radio Station Songs' as table_name, COUNT(*) as record_count FROM radio_station_songs
ORDER BY table_name;

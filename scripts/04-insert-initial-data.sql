-- Insert initial genres
INSERT INTO genres (name, description, color, created_by) VALUES
('Pop', 'Popular music with catchy melodies and mainstream appeal', '#FF6B6B', NULL),
('Rock', 'Guitar-driven music with strong rhythms', '#4ECDC4', NULL),
('Hip Hop', 'Rhythmic music with rap vocals and beats', '#45B7D1', NULL),
('Electronic', 'Music created using electronic instruments and technology', '#96CEB4', NULL),
('Jazz', 'Improvisational music with complex harmonies', '#FFEAA7', NULL),
('Classical', 'Traditional orchestral and chamber music', '#DDA0DD', NULL),
('R&B', 'Rhythm and blues with soulful vocals', '#98D8C8', NULL),
('Country', 'American folk music with storytelling lyrics', '#F7DC6F', NULL),
('Reggae', 'Jamaican music with distinctive rhythm', '#82E0AA', NULL),
('Blues', 'Emotional music with twelve-bar structure', '#85C1E9', NULL),
('Folk', 'Traditional acoustic music', '#F8C471', NULL),
('Punk', 'Fast, aggressive rock music', '#EC7063', NULL),
('Metal', 'Heavy, distorted guitar music', '#A569BD', NULL),
('Indie', 'Independent alternative music', '#5DADE2', NULL),
('Funk', 'Groove-based music with strong bass lines', '#58D68D', NULL);

-- Insert sample artists
INSERT INTO artists (name, bio, created_by) VALUES
('The Beatles', 'Legendary British rock band from Liverpool', NULL),
('Michael Jackson', 'King of Pop, iconic solo artist', NULL),
('Queen', 'British rock band known for theatrical performances', NULL),
('Bob Dylan', 'Influential singer-songwriter and Nobel Prize winner', NULL),
('Madonna', 'Pop icon and cultural influencer', NULL),
('Prince', 'Multi-instrumentalist and musical genius', NULL),
('David Bowie', 'Innovative artist known for reinvention', NULL),
('Led Zeppelin', 'Pioneering hard rock and heavy metal band', NULL),
('Pink Floyd', 'Progressive rock band known for concept albums', NULL),
('The Rolling Stones', 'Enduring rock and roll band', NULL),
('Stevie Wonder', 'Multi-talented musician and songwriter', NULL),
('Aretha Franklin', 'Queen of Soul', NULL),
('Johnny Cash', 'Country music legend', NULL),
('Miles Davis', 'Influential jazz trumpeter', NULL),
('Radiohead', 'Alternative rock band from Oxford', NULL);

-- Insert sample radio stations
INSERT INTO radio_stations (name, description, is_ai_generated, is_active, created_by) VALUES
('Classic Hits FM', 'The best classic hits from the 70s, 80s, and 90s', false, true, NULL),
('Chill Vibes', 'Relaxing music for work and study', false, true, NULL),
('Rock Legends', 'Greatest rock anthems of all time', false, true, NULL),
('Jazz Lounge', 'Smooth jazz for sophisticated listeners', false, true, NULL),
('Electronic Pulse', 'Latest electronic and dance music', false, true, NULL),
('Hip Hop Central', 'The hottest hip hop tracks', false, true, NULL),
('Indie Discovery', 'Discover new independent artists', false, true, NULL),
('Country Roads', 'Classic and modern country music', false, true, NULL),
('Pop Hits Today', 'Current pop chart toppers', false, true, NULL),
('Workout Energy', 'High-energy music for fitness', false, true, NULL);

-- Create admin user (this would typically be done through the application)
-- Note: This is just for reference, actual admin creation should be done through Supabase Auth

-- Insert sample subscription plans data
INSERT INTO subscriptions (user_id, plan, status, current_period_start, current_period_end) 
SELECT 
  id,
  CASE 
    WHEN role = 'premium' THEN 'premium'::subscription_plan
    WHEN role = 'admin' THEN 'premium'::subscription_plan
    ELSE 'free'::subscription_plan
  END,
  'active'::subscription_status,
  NOW(),
  NOW() + INTERVAL '1 month'
FROM profiles 
WHERE deleted_at IS NULL;

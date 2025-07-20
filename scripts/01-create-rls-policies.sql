-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE jams ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_station_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_radio_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_ai_radios ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- ARTISTS POLICIES
-- =============================================
CREATE POLICY "Anyone can view artists" ON artists
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create artists" ON artists
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update artists" ON artists
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete artists" ON artists
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- ALBUMS POLICIES
-- =============================================
CREATE POLICY "Anyone can view albums" ON albums
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create albums" ON albums
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update albums" ON albums
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete albums" ON albums
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- SONGS POLICIES
-- =============================================
CREATE POLICY "Anyone can view songs" ON songs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create songs" ON songs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update songs" ON songs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete songs" ON songs
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- PLAYLISTS POLICIES
-- =============================================
CREATE POLICY "Users can view public playlists" ON playlists
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own playlists" ON playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON playlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON playlists
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- PLAYLIST TRACKS POLICIES
-- =============================================
CREATE POLICY "Users can view tracks in public playlists" ON playlist_tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.is_public = true
    )
  );

CREATE POLICY "Users can view tracks in their own playlists" ON playlist_tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add tracks to their own playlists" ON playlist_tracks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove tracks from their own playlists" ON playlist_tracks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- =============================================
-- JAMS POLICIES
-- =============================================
CREATE POLICY "Anyone can view active jams" ON jams
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create their own jams" ON jams
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own jams" ON jams
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Users can delete their own jams" ON jams
  FOR DELETE USING (auth.uid() = host_id);

-- =============================================
-- RADIO STATIONS POLICIES
-- =============================================
CREATE POLICY "Anyone can view active radio stations" ON radio_stations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create radio stations" ON radio_stations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update radio stations" ON radio_stations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete radio stations" ON radio_stations
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- RADIO STATION SONGS POLICIES
-- =============================================
CREATE POLICY "Anyone can view radio station songs" ON radio_station_songs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_stations 
      WHERE radio_stations.id = radio_station_songs.radio_station_id 
      AND radio_stations.is_active = true
    )
  );

CREATE POLICY "Authenticated users can add songs to radio stations" ON radio_station_songs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can remove songs from radio stations" ON radio_station_songs
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- SUBSCRIPTIONS POLICIES
-- =============================================
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- USER PREFERENCES POLICIES
-- =============================================
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- AI RADIO JOBS POLICIES
-- =============================================
CREATE POLICY "Users can view their own AI radio jobs" ON ai_radio_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI radio jobs" ON ai_radio_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI radio jobs" ON ai_radio_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- WEEKLY AI RADIOS POLICIES
-- =============================================
CREATE POLICY "Users can view their own weekly AI radios" ON weekly_ai_radios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly AI radios" ON weekly_ai_radios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly AI radios" ON weekly_ai_radios
  FOR UPDATE USING (auth.uid() = user_id);

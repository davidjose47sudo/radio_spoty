-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_station_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Artists policies
CREATE POLICY "Everyone can view active artists" ON artists
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage artists" ON artists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Genres policies
CREATE POLICY "Everyone can view active genres" ON genres
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage genres" ON genres
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Songs policies
CREATE POLICY "Everyone can view active songs" ON songs
  FOR SELECT USING (deleted_at IS NULL AND status = 'ready');

CREATE POLICY "Admins can manage songs" ON songs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Song artists policies
CREATE POLICY "Everyone can view song artists" ON song_artists
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage song artists" ON song_artists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Song genres policies
CREATE POLICY "Everyone can view song genres" ON song_genres
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage song genres" ON song_genres
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Radio stations policies
CREATE POLICY "Everyone can view active radio stations" ON radio_stations
  FOR SELECT USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY "Admins can manage radio stations" ON radio_stations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Radio station songs policies
CREATE POLICY "Everyone can view radio station songs" ON radio_station_songs
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage radio station songs" ON radio_station_songs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

CREATE POLICY "Admins can manage subscriptions" ON subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Play history policies
CREATE POLICY "Users can view their own play history" ON play_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own play history" ON play_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all play history" ON play_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

-- Global events policies
CREATE POLICY "Admins can view all events" ON global_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

CREATE POLICY "System can insert events" ON global_events
  FOR INSERT WITH CHECK (true);

-- AI generations policies
CREATE POLICY "Users can view their own AI generations" ON ai_generations
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all AI generations" ON ai_generations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

CREATE POLICY "Authenticated users can create AI generations" ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can manage AI generations" ON ai_generations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin' AND deleted_at IS NULL
    )
  );

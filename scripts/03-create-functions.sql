-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update play count
CREATE OR REPLACE FUNCTION increment_play_count(song_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE songs 
  SET play_count = play_count + 1,
      updated_at = NOW()
  WHERE id = song_uuid AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update station play count
CREATE OR REPLACE FUNCTION increment_station_play_count(station_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE radio_stations 
  SET play_count = play_count + 1,
      updated_at = NOW()
  WHERE id = station_uuid AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE(
  total_plays BIGINT,
  total_time_listened BIGINT,
  favorite_genre TEXT,
  favorite_artist TEXT,
  total_stations_created BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(ph.id)::BIGINT as total_plays,
    COALESCE(SUM(ph.duration_played), 0)::BIGINT as total_time_listened,
    (
      SELECT g.name 
      FROM play_history ph2
      JOIN songs s ON ph2.song_id = s.id
      JOIN song_genres sg ON s.id = sg.song_id
      JOIN genres g ON sg.genre_id = g.id
      WHERE ph2.user_id = user_uuid AND s.deleted_at IS NULL AND g.deleted_at IS NULL
      GROUP BY g.name
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as favorite_genre,
    (
      SELECT a.name
      FROM play_history ph3
      JOIN songs s ON ph3.song_id = s.id
      JOIN song_artists sa ON s.id = sa.song_id
      JOIN artists a ON sa.artist_id = a.id
      WHERE ph3.user_id = user_uuid AND s.deleted_at IS NULL AND a.deleted_at IS NULL
      GROUP BY a.name
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as favorite_artist,
    (
      SELECT COUNT(*)::BIGINT
      FROM radio_stations rs
      WHERE rs.created_by = user_uuid AND rs.deleted_at IS NULL
    ) as total_stations_created
  FROM play_history ph
  WHERE ph.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE(
  total_users BIGINT,
  total_songs BIGINT,
  total_artists BIGINT,
  total_stations BIGINT,
  total_plays_today BIGINT,
  premium_users BIGINT,
  storage_used_mb NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM profiles WHERE deleted_at IS NULL)::BIGINT as total_users,
    (SELECT COUNT(*) FROM songs WHERE deleted_at IS NULL)::BIGINT as total_songs,
    (SELECT COUNT(*) FROM artists WHERE deleted_at IS NULL)::BIGINT as total_artists,
    (SELECT COUNT(*) FROM radio_stations WHERE deleted_at IS NULL)::BIGINT as total_stations,
    (SELECT COUNT(*) FROM play_history WHERE played_at >= CURRENT_DATE)::BIGINT as total_plays_today,
    (SELECT COUNT(*) FROM profiles WHERE role IN ('premium', 'admin') AND deleted_at IS NULL)::BIGINT as premium_users,
    (SELECT COALESCE(SUM(file_size), 0) / (1024 * 1024) FROM songs WHERE deleted_at IS NULL)::NUMERIC as storage_used_mb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete with audit
CREATE OR REPLACE FUNCTION soft_delete_record(table_name TEXT, record_id UUID, user_id UUID)
RETURNS boolean AS $$
DECLARE
  sql_query TEXT;
BEGIN
  sql_query := format('UPDATE %I SET deleted_at = NOW(), updated_by = %L WHERE id = %L AND deleted_at IS NULL', 
                     table_name, user_id, record_id);
  EXECUTE sql_query;
  
  IF FOUND THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore soft deleted record
CREATE OR REPLACE FUNCTION restore_record(table_name TEXT, record_id UUID, user_id UUID)
RETURNS boolean AS $$
DECLARE
  sql_query TEXT;
BEGIN
  sql_query := format('UPDATE %I SET deleted_at = NULL, updated_by = %L, updated_at = NOW() WHERE id = %L AND deleted_at IS NOT NULL', 
                     table_name, user_id, record_id);
  EXECUTE sql_query;
  
  IF FOUND THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

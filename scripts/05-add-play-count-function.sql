-- Function to increment play count for users
CREATE OR REPLACE FUNCTION increment_play_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles 
  SET play_count = COALESCE(play_count, 0) + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_play_count(UUID) TO authenticated;

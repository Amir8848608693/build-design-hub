-- Fix security warning: Set search_path for update_follower_counts function
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET following_count = following_count + 1 
    WHERE user_id = NEW.follower_id;
    
    UPDATE profiles 
    SET followers_count = followers_count + 1 
    WHERE user_id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles 
    SET following_count = following_count - 1 
    WHERE user_id = OLD.follower_id;
    
    UPDATE profiles 
    SET followers_count = followers_count - 1 
    WHERE user_id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
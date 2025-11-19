import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Grid3x3, ShoppingBag, Star } from "lucide-react";
import Header from "@/components/Header";
import PostsTab from "@/components/profile/PostsTab";
import PurchasedProductsTab from "@/components/profile/PurchasedProductsTab";
import ReviewsTab from "@/components/profile/ReviewsTab";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  bio: string | null;
  profile_photo: string | null;
  followers_count: number;
  following_count: number;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        setCurrentUserId(user.id);
        
        // If no userId in URL, show own profile
        const targetUserId = userId || user.id;
        const isOwn = targetUserId === user.id;
        setIsOwnProfile(isOwn);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", targetUserId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          if (isOwn) {
            navigate("/profile/create");
          } else {
            toast({
              title: "Profile not found",
              variant: "destructive",
            });
          }
          return;
        }

        setProfile(data);

        // Check if following (only for other users' profiles)
        if (!isOwn) {
          const { data: followData } = await supabase
            .from("follows")
            .select("id")
            .eq("follower_id", user.id)
            .eq("following_id", targetUserId)
            .maybeSingle();

          setIsFollowing(!!followData);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast, userId]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) return;

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", profile.user_id);

        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${profile.username}`,
        });
      } else {
        // Follow
        await supabase
          .from("follows")
          .insert({
            follower_id: currentUserId,
            following_id: profile.user_id,
          });

        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You are now following ${profile.username}`,
        });
      }

      // Refresh profile to get updated counts
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", profile.user_id)
        .single();

      if (data) setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMessage = () => {
    navigate("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header - Instagram Style */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Profile Photo */}
          <div className="flex justify-center md:justify-start">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary/20">
              <AvatarImage src={profile.profile_photo || ""} alt={profile.username} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            {/* Username and Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <h1 className="text-2xl font-semibold">{profile.username}</h1>
              
              {isOwnProfile ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate("/profile/edit")}
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleFollowToggle}
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    onClick={handleMessage}
                    variant="outline"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center md:justify-start">
              <div className="text-center">
                <p className="font-semibold text-lg">0</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{profile.followers_count}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{profile.following_count}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            {/* Full Name and Bio */}
            <div>
              <p className="font-semibold">{profile.full_name}</p>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="posts" className="gap-2">
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="purchased" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Purchased</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <PostsTab userId={profile.user_id} isOwnProfile={isOwnProfile} />
          </TabsContent>

          <TabsContent value="purchased" className="mt-6">
            <PurchasedProductsTab userId={profile.user_id} isOwnProfile={isOwnProfile} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ReviewsTab userId={profile.user_id} isOwnProfile={isOwnProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

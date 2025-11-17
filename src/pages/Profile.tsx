import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, UserPlus, Edit, MapPin, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string | null;
  phone_number: string | null;
  email: string;
  profile_photo: string | null;
  house_number: string | null;
  street: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  followers_count: number;
  following_count: number;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          navigate("/profile/create");
          return;
        }

        setProfile(data);
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
  }, [navigate, toast]);

  const handleFollowToggle = () => {
    setFollowing(!following);
    toast({
      title: following ? "Unfollowed" : "Following",
      description: following ? "You unfollowed this user" : "You are now following this user",
    });
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

  const fullAddress = [
    profile.house_number,
    profile.street,
    profile.district,
    profile.state,
    profile.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.profile_photo || ""} />
                  <AvatarFallback className="text-3xl">
                    {profile.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => navigate("/profile/edit")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">@{profile.username}</h1>
                  <p className="text-xl text-muted-foreground">{profile.full_name}</p>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.followers_count}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.following_count}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}

                <div className="space-y-2">
                  {profile.phone_number && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  {fullAddress && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-1" />
                      <span>{fullAddress}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleFollowToggle}
                    variant={following ? "outline" : "default"}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {following ? "Unfollow" : "Follow"}
                  </Button>
                  <Button onClick={handleMessage} variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Purchased Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No products yet</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

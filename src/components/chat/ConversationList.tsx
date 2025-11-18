import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  updated_at: string;
  other_user?: {
    username: string;
    full_name: string;
  };
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  onCreateGroup: () => void;
  selectedConversationId: string | null;
}

const ConversationList = ({ onSelectConversation, onCreateGroup, selectedConversationId }: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all conversations the user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      const conversationIds = memberData?.map(m => m.conversation_id) || [];

      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get conversation details
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      // For 1-on-1 chats, get the other user's info
      const enrichedConversations = await Promise.all(
        (convData || []).map(async (conv) => {
          if (!conv.is_group) {
            // Get other member
            const { data: members } = await supabase
              .from('conversation_members')
              .select('user_id')
              .eq('conversation_id', conv.id)
              .neq('user_id', user.id)
              .single();

            if (members) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, full_name')
                .eq('user_id', members.user_id)
                .single();

              return {
                ...conv,
                other_user: profile || undefined
              };
            }
          }
          return conv;
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.is_group) {
      return conv.name || 'Unnamed Group';
    }
    return conv.other_user?.full_name || conv.other_user?.username || 'Unknown User';
  };

  const getInitials = (conv: Conversation) => {
    const name = getConversationName(conv);
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <div className="p-4">Loading conversations...</div>;
  }

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Messages</h2>
        <Button size="icon" variant="ghost" onClick={onCreateGroup}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-accent rounded-lg transition-colors ${
                  selectedConversationId === conv.id ? 'bg-accent' : ''
                }`}
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback>{getInitials(conv)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium">{getConversationName(conv)}</div>
                  <div className="text-sm text-muted-foreground">
                    {conv.is_group ? 'Group' : 'Direct message'}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
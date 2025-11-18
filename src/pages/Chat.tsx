import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ConversationList from "@/components/chat/ConversationList";
import CreateGroupDialog from "@/components/chat/CreateGroupDialog";
import TypingIndicator from "@/components/chat/TypingIndicator";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    full_name: string;
  };
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversationInfo, setConversationInfo] = useState<any>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const presenceChannelRef = useRef<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages();
      loadConversationInfo();
      subscribeToMessages();
      subscribeToTyping();
    }
    
    return () => {
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
    };
  }, [selectedConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(user);
  };

  const subscribeToMessages = () => {
    if (!selectedConversationId) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          
          // Get sender info
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('user_id', newMsg.sender_id)
            .single();

          setMessages(prev => [...prev, { ...newMsg, sender: profile || undefined }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToTyping = async () => {
    if (!selectedConversationId || !currentUser) return;

    // Clean up previous channel
    if (presenceChannelRef.current) {
      await supabase.removeChannel(presenceChannelRef.current);
    }

    const channel = supabase.channel(`typing:${selectedConversationId}`, {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const typing: string[] = [];

        Object.keys(state).forEach((userId) => {
          if (userId !== currentUser.id) {
            const presences = state[userId];
            if (presences && presences.length > 0) {
              const presence = presences[0] as any;
              if (presence.typing && presence.username) {
                typing.push(presence.username);
              }
            }
          }
        });

        setTypingUsers(typing);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Get current user's profile info
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('user_id', currentUser.id)
            .single();

          // Initialize presence with not typing
          await channel.track({
            typing: false,
            username: profile?.full_name || profile?.username || 'Unknown',
          });
        }
      });

    presenceChannelRef.current = channel;
  };

  const updateTypingStatus = async (isTyping: boolean) => {
    if (!presenceChannelRef.current || !currentUser) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name')
      .eq('user_id', currentUser.id)
      .single();

    await presenceChannelRef.current.track({
      typing: isTyping,
      username: profile?.full_name || profile?.username || 'Unknown',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing to true
    updateTypingStatus(true);

    // Set timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 2000);
  };

  const loadConversationInfo = async () => {
    if (!selectedConversationId || !currentUser) return;

    try {
      const { data: conv } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', selectedConversationId)
        .single();

      if (conv && !conv.is_group) {
        // Get other user info for 1-on-1 chat
        const { data: members } = await supabase
          .from('conversation_members')
          .select('user_id')
          .eq('conversation_id', selectedConversationId)
          .neq('user_id', currentUser.id)
          .single();

        if (members) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('user_id', members.user_id)
            .single();

          setConversationInfo({ ...conv, other_user: profile });
        }
      } else {
        setConversationInfo(conv);
      }
    } catch (error) {
      console.error('Error loading conversation info:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversationId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender info for all messages
      const enrichedMessages = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('user_id', msg.sender_id)
            .single();

          return { ...msg, sender: profile || undefined };
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !currentUser) return;

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator
    await updateTypingStatus(false);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversationId,
          sender_id: currentUser.id,
          content: newMessage,
        });

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversationId);

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getConversationTitle = () => {
    if (!conversationInfo) return "Select a conversation";
    if (conversationInfo.is_group) {
      return conversationInfo.name || "Unnamed Group";
    }
    return conversationInfo.other_user?.full_name || conversationInfo.other_user?.username || "Unknown User";
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-80">
        <ConversationList
          onSelectConversation={setSelectedConversationId}
          onCreateGroup={() => setShowCreateGroup(true)}
          selectedConversationId={selectedConversationId}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <Card className="flex-1 flex flex-col m-4">
            <div className="border-b p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {getConversationTitle().substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{getConversationTitle()}</h2>
                  <p className="text-sm text-muted-foreground">
                    {conversationInfo?.is_group ? 'Group Chat' : 'Online'}
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === currentUser?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender_id === currentUser?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.sender_id !== currentUser?.id && (
                        <p className="text-xs font-semibold mb-1">
                          {message.sender?.full_name || message.sender?.username || 'Unknown'}
                        </p>
                      )}
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <TypingIndicator userNames={typingUsers} />

            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      <CreateGroupDialog
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
        onGroupCreated={() => {
          // Refresh conversation list by triggering a re-render
          setSelectedConversationId(null);
        }}
      />
    </div>
  );
};

export default Chat;
import { useState } from "react";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSocial = () => {
  const [messages] = useState([
    { id: "1", from: "John Doe", content: "When will my order be delivered?", time: "2 hours ago", status: "unread" },
    { id: "2", from: "Jane Smith", content: "I love your products!", time: "5 hours ago", status: "read" }
  ]);

  const [reviews] = useState([
    { id: "1", customer: "Alice Johnson", product: "Product A", rating: 5, comment: "Excellent quality!", date: "2024-01-15" },
    { id: "2", customer: "Bob Wilson", product: "Product B", rating: 4, comment: "Good value for money", date: "2024-01-14" }
  ]);

  const [feedback] = useState([
    { id: "1", type: "suggestion", content: "Add more payment options", from: "Anonymous", date: "2024-01-15" },
    { id: "2", type: "complaint", content: "Shipping was slow", from: "Customer #123", date: "2024-01-14" }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="social" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Social & Communication</h1>
          <p className="text-muted-foreground mt-1">Manage customer messages, reviews, and feedback</p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {messages.filter(m => m.status === "unread").length > 0 && (
                <Badge className="ml-2 bg-red-500 hover:bg-red-600">
                  {messages.filter(m => m.status === "unread").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <div className="bg-background rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Messages</h3>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{message.from}</span>
                          {message.status === "unread" && (
                            <Badge className="bg-red-500 hover:bg-red-600">New</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{message.content}</p>
                        <p className="text-sm text-muted-foreground mt-2">{message.time}</p>
                      </div>
                      <Button variant="outline" size="sm">Reply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-background rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Product Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.customer}</p>
                        <p className="text-sm text-muted-foreground">{review.product}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{review.comment}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Approve</Button>
                        <Button variant="outline" size="sm">Hide</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="bg-background rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={
                        item.type === "suggestion" 
                          ? "bg-blue-500 hover:bg-blue-600" 
                          : "bg-red-500 hover:bg-red-600"
                      }>
                        {item.type}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <p className="text-muted-foreground mb-2">{item.content}</p>
                    <p className="text-sm text-muted-foreground">From: {item.from}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminSocial;

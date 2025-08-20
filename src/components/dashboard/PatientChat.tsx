import { useState } from "react";
import { Send, Bot, User, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  type: "doctor" | "patient" | "ai-suggestion";
  content: string;
  timestamp: string;
}

const PatientChat = ({ selectedPatient }: { selectedPatient: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "patient",
      content: "Hello Doctor, I've been experiencing some chest discomfort since yesterday.",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      type: "ai-suggestion",
      content: "Consider asking about: Pain characteristics (sharp/dull), radiation, associated symptoms, triggers, and previous similar episodes.",
      timestamp: "10:31 AM"
    },
    {
      id: 3,
      type: "doctor",
      content: "I understand your concern. Can you describe the pain - is it sharp or dull? Does it radiate anywhere?",
      timestamp: "10:32 AM"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const aiSuggestions = [
    "Ask about pain scale (1-10)",
    "Inquire about family history",
    "Check for shortness of breath",
    "Ask about recent stress levels"
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      type: "doctor",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate patient response
    setTimeout(() => {
      const patientResponse: Message = {
        id: messages.length + 2,
        type: "patient",
        content: "Thank you for asking. The pain is more of a dull ache, and it sometimes spreads to my left arm.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, patientResponse]);
    }, 2000);
  };

  const useSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  if (!selectedPatient) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Patient Selected</h3>
          <p className="text-muted-foreground">
            Select a patient to start messaging
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2 text-primary" />
          Chat with {selectedPatient.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'doctor' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai-suggestion' ? (
                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Bot className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2 bg-yellow-100 text-yellow-800">
                        AI Suggestion
                      </Badge>
                      <p className="text-sm text-yellow-800">{message.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`flex items-end space-x-2 max-w-xs ${message.type === 'doctor' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.type === 'doctor' ? '/placeholder.svg' : selectedPatient.avatar} />
                    <AvatarFallback className={message.type === 'doctor' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                      {message.type === 'doctor' ? 'DR' : selectedPatient.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'doctor' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'doctor' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="border-t border-border p-4">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium">AI Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {aiSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => useSuggestion(suggestion)}
                className="text-xs border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientChat;
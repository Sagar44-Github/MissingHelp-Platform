"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bot,
  X,
  Send,
  Minimize2,
  Maximize2,
  User,
  RefreshCw,
} from "lucide-react";

// Sample predefined responses
const AI_RESPONSES = {
  greeting:
    "Hello! I'm your Missing Persons Locator assistant. How can I help you today?",
  howToReport:
    "To report a missing person, navigate to the 'Report' section from the main menu. You'll need to provide details like name, age, description, and the last seen location. Remember to also report to your local authorities.",
  howToSearch:
    "You can search for missing persons using our 'Search' feature. You can filter by name, location, age, and other criteria. You can also check the map view to see cases in specific regions.",
  aboutFacialRecognition:
    "Our facial recognition feature allows you to upload a photo to compare against our database. The technology analyzes facial features to find potential matches. Please note this is an experimental feature and results should be verified.",
  whatIsHeatmap:
    "The heatmap visualization shows geographical concentrations of missing persons cases. Areas with higher case density appear as brighter hotspots. This can help identify patterns and high-risk areas.",
  howToCommunity:
    "Our community forum allows you to connect with others, share information, and coordinate search efforts. You can create posts, comment on existing discussions, and join volunteer groups.",
  contactAuthorities:
    "While our platform helps coordinate search efforts, it's crucial to also contact local authorities. For emergencies, always call your local emergency number (like 911 in the US).",
  dataPrivacy:
    "We take privacy seriously. Personal information is protected and only shared with authorized users. You can control your privacy settings in your account profile.",
  notUnderstand:
    "I'm sorry, I don't understand that question. Could you rephrase it or try asking something about reporting missing persons, searching the database, or using our features?",
};

// Suggested questions
const SUGGESTED_QUESTIONS = [
  "How do I report a missing person?",
  "How can I search for someone?",
  "What is the facial recognition feature?",
  "How does the heatmap work?",
  "How can I use the community forum?",
  "Should I contact authorities?",
  "How is my data protected?",
];

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: AI_RESPONSES.greeting,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      const aiResponse = generateResponse(inputValue);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes("report") ||
      lowerQuery.includes("submit") ||
      lowerQuery.includes("how do i add")
    ) {
      return AI_RESPONSES.howToReport;
    } else if (
      lowerQuery.includes("search") ||
      lowerQuery.includes("find") ||
      lowerQuery.includes("look for")
    ) {
      return AI_RESPONSES.howToSearch;
    } else if (
      lowerQuery.includes("facial") ||
      lowerQuery.includes("face") ||
      lowerQuery.includes("recognition")
    ) {
      return AI_RESPONSES.aboutFacialRecognition;
    } else if (
      lowerQuery.includes("heatmap") ||
      lowerQuery.includes("map") ||
      lowerQuery.includes("visualization")
    ) {
      return AI_RESPONSES.whatIsHeatmap;
    } else if (
      lowerQuery.includes("community") ||
      lowerQuery.includes("forum") ||
      lowerQuery.includes("discuss")
    ) {
      return AI_RESPONSES.howToCommunity;
    } else if (
      lowerQuery.includes("police") ||
      lowerQuery.includes("authorities") ||
      lowerQuery.includes("emergency")
    ) {
      return AI_RESPONSES.contactAuthorities;
    } else if (
      lowerQuery.includes("privacy") ||
      lowerQuery.includes("data") ||
      lowerQuery.includes("secure")
    ) {
      return AI_RESPONSES.dataPrivacy;
    } else if (
      lowerQuery.includes("hello") ||
      lowerQuery.includes("hi") ||
      lowerQuery.includes("hey")
    ) {
      return AI_RESPONSES.greeting;
    } else {
      return AI_RESPONSES.notUnderstand;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: AI_RESPONSES.greeting,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <Card
          className={`w-72 sm:w-80 md:w-96 shadow-lg transition-all duration-200 ${
            isMinimized ? "h-14" : "h-[480px]"
          }`}
        >
          <CardHeader className="p-3 flex flex-row items-center space-y-0 gap-2 border-b">
            <div className="flex flex-1 items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-assistant-avatar.png" />
                <AvatarFallback className="bg-primary/20">AI</AvatarFallback>
              </Avatar>
              {!isMinimized && (
                <div>
                  <CardTitle className="text-sm">AI Assistant</CardTitle>
                  <CardDescription className="text-xs">
                    Ask me anything about the platform
                  </CardDescription>
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[380px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-2 max-w-[80%] ${
                            message.sender === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          {message.sender === "ai" ? (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className="bg-primary/20">
                                AI
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.content}
                            <div className="text-xs opacity-70 mt-1 text-right">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-2 max-w-[80%]">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-primary/20">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg px-3 py-2 text-sm bg-muted">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {messages.length === 1 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">
                        Suggested questions:
                      </h4>
                      <div className="space-y-2">
                        {SUGGESTED_QUESTIONS.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start text-sm p-2 h-auto"
                            onClick={() => handleSuggestedQuestion(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 pt-2 border-t flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Type your question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

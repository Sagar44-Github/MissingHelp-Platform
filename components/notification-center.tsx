"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, Check, Filter, Trash, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock notification data
const MOCK_NOTIFICATIONS = [
  {
    id: "notif1",
    type: "alert",
    title: "New Search Initiated",
    message:
      "A new search has been initiated for Jamal Nkosi in Nairobi, Kenya.",
    timestamp: "10 minutes ago",
    isRead: false,
  },
  {
    id: "notif2",
    type: "update",
    title: "Case Status Updated",
    message: "Maria Garcia's status has been updated to 'Found'.",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: "notif3",
    type: "message",
    title: "New Message from Sarah",
    message: "I think I saw John Doe near Central Park yesterday...",
    sender: {
      name: "Sarah Johnson",
      avatar: "/avatars/avatar-1.png",
    },
    timestamp: "4 hours ago",
    isRead: true,
  },
  {
    id: "notif4",
    type: "alert",
    title: "Volunteer Opportunity",
    message: "New volunteer search team forming in your area.",
    timestamp: "Yesterday",
    isRead: true,
  },
  {
    id: "notif5",
    type: "update",
    title: "New Comment on Your Post",
    message: "Carlos responded to your post about the Madrid sighting.",
    timestamp: "Yesterday",
    isRead: true,
  },
  {
    id: "notif6",
    type: "message",
    title: "Message from Search Coordinator",
    message:
      "Please confirm your availability for Saturday's search operation.",
    sender: {
      name: "David Wilson",
      avatar: "/avatars/avatar-4.png",
    },
    timestamp: "2 days ago",
    isRead: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  // Clear notifications
  const clearNotifications = () => {
    if (activeTab === "all") {
      setNotifications([]);
    } else if (activeTab === "unread") {
      setNotifications(notifications.filter((n) => n.isRead));
    } else {
      setNotifications(notifications.filter((n) => n.type !== activeTab));
    }
  };

  // Add a new notification (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to add a new notification every 30 seconds
      if (Math.random() < 0.1) {
        const types = ["alert", "update", "message"];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const newNotification = {
          id: `notif${Date.now()}`,
          type: randomType,
          title:
            randomType === "alert"
              ? "New Alert"
              : randomType === "update"
              ? "Status Update"
              : "New Message",
          message:
            randomType === "alert"
              ? "A new missing person report has been filed in your area."
              : randomType === "update"
              ? "A case you're following has been updated."
              : "You've received a new message about a case.",
          timestamp: "Just now",
          isRead: false,
          ...(randomType === "message" && {
            sender: {
              name: "System Notification",
              avatar: "/avatars/avatar-system.png",
            },
          }),
        };

        setNotifications((prev) => [newNotification, ...prev]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearNotifications}
                title="Clear notifications"
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SheetDescription>
            Stay updated with alerts, case updates, and messages
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-4 mx-6">
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="alert">Alerts</TabsTrigger>
            <TabsTrigger value="update">Updates</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="flex-1 mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${
                        !notification.isRead ? "bg-muted/20" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {notification.type === "message" &&
                        notification.sender ? (
                          <Avatar>
                            <AvatarFallback>
                              {notification.sender.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center ${
                              notification.type === "alert"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {notification.type === "alert" ? (
                              <Bell className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <Badge
                                variant="secondary"
                                className="h-2 w-2 rounded-full p-0"
                              />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-1">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "all"
                      ? "You have no notifications at this time."
                      : activeTab === "unread"
                      ? "You have no unread notifications."
                      : `You have no ${activeTab} notifications.`}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Notification Settings</h4>
            <div className="flex items-center justify-between">
              <div className="text-sm">Push Notifications</div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">Email Alerts</div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">SMS Updates</div>
              <Switch />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

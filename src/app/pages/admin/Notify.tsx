// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import useGetHook from "../../hook/useGet";
import usePostHook from "../../hook/usePost";
import { toast } from "react-toastify";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, BellRing, Trash2, CheckCheck, Clock, Inbox, Check } from "lucide-react";

interface NotificationItem {
  id: string | number;
  title?: string;
  body?: string;
  status?: string;
  created_at?: string;
}

const AdminNotify = () => {
  const { data, isLoading, refetch } = useGetHook("admin/get/all/notifications");
  const { handlePost } = usePostHook();

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setNotifications(data.data);
    }
  }, [data]);

  const formatTimeAgo = (timestamp?: string) => {
    if (!timestamp) return "";
    try {
      const apiDate = new Date(timestamp);
      return formatDistanceToNow(apiDate, { addSuffix: true });
    } catch {
      return "";
    }
  };

  const handleMarkAsRead = (id: string | number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: "Read" } : n)));
    handlePost(
      `admin/read/notification?notification_id=${id}`,
      { notification_id: id },
      "application/json",
      () => {
        refetch();
      },
    );
  };

  const handleDelete = (id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    handlePost(
      `admin/delete/notification?notification_id=${id}`,
      { notification_id: id },
      "application/json",
      () => {
        toast.success("Notification deleted successfully");
        refetch();
      },
    );
  };

  const handleMarkAllAsRead = async () => {
    const unreadList = notifications.filter((n) => (n.status || "").toLowerCase() === "unread");
    if (unreadList.length === 0) {
      toast.info("No unread notifications");
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, status: "Read" })));

    try {
      await Promise.all(
        unreadList.map((n) =>
          handlePost(
            `admin/read/notification?notification_id=${n.id}`,
            { notification_id: n.id },
            "application/json",
            () => {},
          ),
        ),
      );
      toast.success("All notifications marked as read");
      refetch();
    } catch {
      refetch();
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => (n.status || "").toLowerCase() === "unread").length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => (n.status || "").toLowerCase() === "unread");
    }
    if (activeTab === "read") {
      return notifications.filter((n) => (n.status || "").toLowerCase() !== "unread");
    }
    return notifications;
  }, [notifications, activeTab]);

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admin Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground font-semibold">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            System notices, member registrations, and administrative updates.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || isLoading}
          className="self-start sm:self-auto gap-2"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  <span>All</span>
                  <Badge variant="secondary" className="px-1.5 py-0 text-xs">
                    {notifications.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2">
                  <span>Unread</span>
                  {unreadCount > 0 && (
                    <Badge className="px-1.5 py-0 text-xs bg-primary text-primary-foreground">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading && notifications.length === 0 ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
              <Inbox className="h-12 w-12 text-muted-foreground/30 stroke-1" />
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">No notifications found</p>
                <p className="text-xs text-muted-foreground">
                  {activeTab === "unread"
                    ? "You are all caught up! There are no unread notifications."
                    : "No administrative notifications recorded yet."}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((item) => {
                const isUnread = (item.status || "").toLowerCase() === "unread";

                return (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between gap-4 p-4 sm:p-5 transition-colors ${
                      isUnread ? "bg-primary/[0.03] hover:bg-primary/[0.06]" : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                          isUnread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isUnread ? (
                          <BellRing className="h-5 w-5 animate-pulse" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`text-sm leading-snug ${
                              isUnread
                                ? "font-semibold text-foreground"
                                : "font-medium text-foreground/80"
                            }`}
                          >
                            {item.title || "Notification"}
                          </p>
                          {isUnread && <span className="h-2 w-2 rounded-full bg-primary" />}
                        </div>

                        {item.body && (
                          <p className="text-sm text-muted-foreground leading-relaxed break-words">
                            {item.body}
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/75 pt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(item.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-center sm:self-start">
                      {isUnread && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete notification</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotify;

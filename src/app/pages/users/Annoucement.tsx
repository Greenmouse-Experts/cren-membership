// @ts-nocheck
import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import useGetHook from "../../hook/useGet";
import { formatString } from "../../services/helpers";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Calendar, Search, ArrowRight, Eye, Clock, Sparkles } from "lucide-react";

interface AnnouncementItem {
  id: number | string;
  title: string;
  content: string;
  image?: string;
  created_at?: string;
}

const MembersAnnoucement = () => {
  const { data, isLoading } = useGetHook("member/announcements");
  const [selected, setSelected] = useState<AnnouncementItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const rawAnnouncements: AnnouncementItem[] = Array.isArray(data?.data) ? data.data : [];

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) return rawAnnouncements;
    const q = searchQuery.toLowerCase();
    return rawAnnouncements.filter(
      (item) => item.title?.toLowerCase().includes(q) || item.content?.toLowerCase().includes(q),
    );
  }, [rawAnnouncements, searchQuery]);

  const openViewAnnounce = (item: AnnouncementItem) => {
    setSelected(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Announcements</h1>
            {rawAnnouncements.length > 0 && (
              <Badge variant="secondary" className="font-semibold">
                {rawAnnouncements.length}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Official announcements, updates, and notices from CREN.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading && rawAnnouncements.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <Skeleton className="h-44 w-full rounded-t-lg" />
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
            <Megaphone className="h-12 w-12 text-muted-foreground/30 stroke-1" />
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">No announcements found</p>
              <p className="text-xs text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "There are no official announcements published at this time."}
              </p>
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((item) => {
            const hasImage = Boolean(item.image);

            return (
              <Card
                key={item.id}
                className="flex flex-col shadow-sm hover:shadow-md transition-shadow group overflow-hidden border-border"
              >
                {hasImage && (
                  <div className="h-44 w-full overflow-hidden bg-muted relative">
                    <img
                      src={item.image}
                      alt={item.title || "Announcement"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader className="space-y-2 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    {item.created_at && (
                      <Badge variant="outline" className="text-xs font-normal gap-1 bg-muted/40">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {dayjs(item.created_at).format("DD MMM YYYY")}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {item.title || "Announcement"}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 text-sm text-muted-foreground">
                  <p className="line-clamp-3 leading-relaxed">{item.content}</p>
                </CardContent>

                <CardFooter className="pt-2 border-t bg-muted/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openViewAnnounce(item)}
                    className="w-full justify-between text-primary hover:text-primary hover:bg-primary/10 group/btn"
                  >
                    <span className="font-medium">Read details</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="space-y-2">
            {selected?.created_at && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Published on {dayjs(selected.created_at).format("MMMM D, YYYY")}</span>
              </div>
            )}
            <DialogTitle className="text-xl font-bold leading-snug">
              {selected?.title || "Announcement Details"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {selected?.image && (
              <div className="w-full rounded-lg overflow-hidden border bg-muted">
                <img
                  src={selected.image}
                  alt={selected.title || "Announcement"}
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {selected?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersAnnoucement;

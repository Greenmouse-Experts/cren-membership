// @ts-nocheck
import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "@/lib/router-compat";
import { formatAsNgnMoney, formatString } from "../services/helpers";
import useGetHook from "../hook/useGet";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Megaphone,
  CreditCard,
  Users,
  ArrowRight,
  Calendar,
  AlertCircle,
  Receipt,
  UserCheck,
} from "lucide-react";

const Home = () => {
  const currentYear = new Date().getFullYear();
  const { data, isLoading } = useGetHook(`member/dashboard?year=${currentYear}`);
  const navigate = useNavigate();

  const announcements = data?.data?.recentFiveAnnouncement || [];
  const payments = data?.data?.recentFivePayments || [];
  const recentMembers = data?.data?.recentFiveMembers || [];

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "active" || s === "approved" || s === "success") {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
        >
          {status || "Active"}
        </Badge>
      );
    }
    if (s === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
        >
          {status || "Pending"}
        </Badge>
      );
    }
    return <Badge variant="secondary">{status || "Inactive"}</Badge>;
  };

  if (isLoading && !data) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Member Overview</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to your member portal for {currentYear}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements Card */}
        <Card className="flex flex-col shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Announcements
              </CardTitle>
              <CardDescription>Important notices and news for members</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/announce")}
              className="gap-1 text-primary hover:text-primary/80"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 space-y-3">
            {announcements.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
                <Megaphone className="h-10 w-10 text-muted-foreground/40 stroke-1" />
                <p className="text-sm font-medium">No announcements at the moment</p>
                <p className="text-xs text-muted-foreground/80">
                  New announcements will appear here when posted.
                </p>
              </div>
            ) : (
              announcements.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-3.5 rounded-lg border border-border bg-card/60 hover:bg-accent/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground leading-snug">
                      {item.title}
                    </p>
                    {item.created_at && (
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dayjs(item.created_at).format("DD MMM")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {formatString(item.content || "", 120)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Payments Alert Card */}
        <Card className="flex flex-col shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Recent Payments
              </CardTitle>
              <CardDescription>Your latest recorded dues and subscriptions</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/transact")}
              className="gap-1 text-primary hover:text-primary/80"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 space-y-3">
            {payments.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
                <Receipt className="h-10 w-10 text-muted-foreground/40 stroke-1" />
                <p className="text-sm font-medium">No payments recorded yet</p>
                <p className="text-xs text-muted-foreground/80">
                  Paid dues and subscription receipts will show up here.
                </p>
              </div>
            ) : (
              payments.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-3.5 rounded-lg border border-border bg-card/60 hover:bg-accent/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item?.due?.description || "Subscription / Due Payment"}
                    </span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {formatAsNgnMoney(item.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <Badge variant="outline" className="text-[11px] font-normal">
                      {item.channel || "Payment"}
                    </Badge>
                    {item.created_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dayjs(item.created_at).format("DD MMM YYYY")}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Members Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Members
            </CardTitle>
            <CardDescription>Recently registered members in the directory</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/members")}
            className="gap-1 text-primary hover:text-primary/80"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {recentMembers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
              <Users className="h-10 w-10 text-muted-foreground/40 stroke-1" />
              <p className="text-sm font-medium">No recent members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMembers.map((item, i) => {
                    const fullName =
                      `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Member";
                    const initials = fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <TableRow key={item.id || i}>
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 text-xs border border-border">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-foreground">{fullName}</p>
                              {item.email && (
                                <p className="text-xs text-muted-foreground">{item.email}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.occupation || "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {item.created_at ? dayjs(item.created_at).format("DD MMM YYYY") : "—"}
                        </TableCell>
                        <TableCell className="text-right">{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

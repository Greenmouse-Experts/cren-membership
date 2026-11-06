import dayjs from "dayjs";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Handshake, ReceiptText, RefreshCw, Repeat, Users } from "lucide-react";

import useGetHook from "../hook/useGet";
import { formatAsNgnMoney } from "../services/helpers";
import MembersJoined from "./charts/membersJoined";
import DuesPayment from "./charts/duesPayment";
import type { AdminDashboardData, Member } from "@/types/api";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatMoney = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return formatAsNgnMoney(amount) || "N0";
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD MMM YYYY") : "—";
};

type SubscriptionFlag = Member["isSubscribed"] | number | null;

const isSubscribed = (value: SubscriptionFlag) =>
  value === true || value === "true" || value === 1 || value === "1";

const memberName = (member: Member) =>
  member.name_of_member_organization ||
  [member.first_name, member.last_name].filter(Boolean).join(" ") ||
  member.username ||
  "—";

function SubscriptionBadge({ value }: { value: SubscriptionFlag }) {
  if (value === undefined || value === null || value === "") {
    return (
      <Badge variant="outline" className="font-normal text-muted-foreground">
        Unknown
      </Badge>
    );
  }

  return isSubscribed(value) ? (
    <Badge className="border-transparent bg-emerald-500/15 font-medium text-emerald-700 hover:bg-emerald-500/20">
      Subscribed
    </Badge>
  ) : (
    <Badge variant="secondary" className="font-normal text-muted-foreground">
      Not subscribed
    </Badge>
  );
}

const Admin = () => {
  const currentYear = new Date().getFullYear();
  const query = useGetHook<AdminDashboardData>(`admin/dashboard?year=${currentYear}`);
  const dashboard = query.data?.data;

  const stats = [
    {
      label: "Total members",
      value: dashboard?.totalPartnerMembers ?? "—",
      hint: "Registered on the portal",
      icon: Users,
      accent: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Partner members",
      value: dashboard?.totalPartner ?? "—",
      hint: "Organisations and partners",
      icon: Handshake,
      accent: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "Dues collected",
      value: formatMoney(dashboard?.totalDuesPaid),
      hint: "Across all categories",
      icon: ReceiptText,
      accent: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Subscriptions",
      value: formatMoney(dashboard?.totalSubscriptionPaid),
      hint: "Active subscription revenue",
      icon: Repeat,
      accent: "bg-amber-500/10 text-amber-600",
    },
  ];

  const recentMembers = dashboard?.latestFiveMember ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard overview</h2>
          <p className="text-sm text-muted-foreground">
            Membership growth, dues, and subscription activity for {currentYear}.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          className="self-start gap-2 sm:self-auto"
        >
          <RefreshCw className={cn("h-4 w-4", query.isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load the dashboard</AlertTitle>
          <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{query.error?.message || "Please check your connection and try again."}</span>
            <Button variant="outline" size="sm" onClick={() => query.refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                {query.isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="truncate text-2xl font-semibold tracking-tight">{stat.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  stat.accent,
                )}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Recent members</CardTitle>
            <CardDescription>The latest five members to join the portal.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/member">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 pl-6">S/N</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead className="pr-6 text-right">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="pl-6">
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="pr-6">
                        <Skeleton className="ml-auto h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : recentMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      No members have registered yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentMembers.map((member, index) => (
                    <TableRow key={member.id ?? index}>
                      <TableCell className="pl-6 text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{member.membership_id || "—"}</TableCell>
                      <TableCell className="max-w-[16rem] truncate">{memberName(member)}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {member.account_type || "—"}
                      </TableCell>
                      <TableCell>
                        <SubscriptionBadge value={member.isSubscribed} />
                      </TableCell>
                      <TableCell className="pr-6 text-right text-muted-foreground">
                        {formatDate(member.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="shadow-sm xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly dues collected</CardTitle>
            <CardDescription>Payment totals recorded this year.</CardDescription>
          </CardHeader>
          <CardContent>
            {query.isLoading ? (
              <Skeleton className="h-[260px] w-full rounded-lg" />
            ) : (
              <DuesPayment data={dashboard?.usersPayments} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly members joined</CardTitle>
            <CardDescription>New registrations per month.</CardDescription>
          </CardHeader>
          <CardContent>
            {query.isLoading ? (
              <Skeleton className="h-[260px] w-full rounded-lg" />
            ) : (
              <MembersJoined data={dashboard?.monthly_members_joined} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

// @ts-nocheck
import React, { useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import { Search, Plus, FileDown, Eye, Loader2, CheckCircle2, XCircle } from "lucide-react";

import { API_URL } from "@/app/services/env";
import useGetHook from "../../hook/useGet";
import AddFellow from "../../admin/AddFellow";
import MemberModal from "../../admin/members/memberModal";
import type { Member, ApiResponse } from "@/types/api";

// shadcn/ui components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper to reliably extract array of members from response structures
const extractMembers = (response: any): Member[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

const Members = () => {
  const {
    data,
    isLoading: loading,
    refetch,
    isError,
    error,
  } = useGetHook<Member[]>("admin/member/retrieve/all");

  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // Modals state
  const [showDetails, setShowDetails] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  // Extracted raw members from API response
  const rawMembers = useMemo(() => extractMembers(data), [data]);

  // Filtered members based on search input
  const items = useMemo(() => {
    if (!searchQuery.trim()) return rawMembers;
    const query = searchQuery.toLowerCase().trim();
    return rawMembers.filter((item) => {
      const rep = item.name_of_representative?.toLowerCase() || "";
      const org = item.name_of_member_organization?.toLowerCase() || "";
      const fullName = `${item.first_name || ""} ${item.last_name || ""}`.toLowerCase();
      const email = item.email?.toLowerCase() || "";
      const memId = item.membership_id?.toLowerCase() || "";
      const username = item.username?.toLowerCase() || "";

      return (
        rep.includes(query) ||
        org.includes(query) ||
        fullName.includes(query) ||
        email.includes(query) ||
        memId.includes(query) ||
        username.includes(query)
      );
    });
  }, [rawMembers, searchQuery]);

  const handleAddMemberClick = () => {
    setShowAddMemberPopup(true);
  };

  const handleCloseAddMemberPopup = () => {
    setShowAddMemberPopup(false);
  };

  const openActivate = (item: Member) => {
    setSelected(item);
    setIsActivateOpen(true);
  };

  const openDeactivate = (item: Member) => {
    setSelected(item);
    setIsDeactivateOpen(true);
  };

  const openDetails = (item: Member) => {
    setSelected(item);
    setShowDetails(true);
  };

  const downloadAsPDF = () => {
    const listToExport = items.length ? items : rawMembers;
    if (!listToExport.length) {
      toast.info("No member data available to download");
      return;
    }

    const doc = new jsPDF();
    doc.autoTable({
      head: [["S/N", "Member Id", "Member Name", "Email", "Date Created", "Status"]],
      body: listToExport.map((item, index) => [
        index + 1,
        item.membership_id || "N/A",
        item.name_of_representative ||
          `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
          item.name_of_member_organization ||
          "N/A",
        item.email || "N/A",
        item.created_at ? dayjs(item.created_at).format("DD-MMM-YYYY") : "N/A",
        item.status || "N/A",
      ]),
    });

    doc.save("members.pdf");
  };

  const ChangeAccountStatus = async (status: "activate" | "deactivate") => {
    if (!selected?.id) return;
    setIsBusy(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("igbo_token") : null;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };
      const res = await axios.get(
        `${API_URL}/admin/member/${status}?user_id=${selected.id}`,
        config,
      );
      toast.success(res.data?.message || `Account successfully ${status}d`);
      refetch();
      setIsActivateOpen(false);
      setIsDeactivateOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${status} account`);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="w-full p-4 lg:p-6 space-y-6">
      <Card className="border shadow-sm">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Members</CardTitle>
              <CardDescription>
                Manage registered member organizations, view status, and download records.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsPDF}
                className="gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4 text-destructive" />
                <span>Export PDF</span>
              </Button>
              <Button
                size="sm"
                onClick={handleAddMemberClick}
                className="gap-2 bg-[#015907] hover:bg-[#015907]/90 text-white cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Member</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search by name, organization, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            {rawMembers.length > 0 && (
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                Showing {items.length} of {rawMembers.length}{" "}
                {rawMembers.length === 1 ? "member" : "members"}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-t overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-16 text-center">S/N</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-6 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : items.length > 0 ? (
                  items.map((item, index) => {
                    const statusStr = item.status ? String(item.status) : "Pending";
                    const isPendingOrInactive =
                      statusStr.toLowerCase() === "pending" ||
                      statusStr.toLowerCase() === "inactive";
                    const isActive = statusStr.toLowerCase() === "active";

                    const isSubscribed =
                      item.isSubscribed === true ||
                      item.isSubscribed === "true" ||
                      item.isSubscribed === 1 ||
                      item.isSubscribed === "1";

                    const displayName =
                      item.name_of_representative ||
                      `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
                      item.username ||
                      item.name_of_member_organization ||
                      "—";

                    return (
                      <TableRow key={item.id || index} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-center text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-900 dark:text-blue-400">
                          {item.membership_id || "—"}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium text-foreground">{displayName}</p>
                            {item.name_of_member_organization &&
                              item.name_of_member_organization !== displayName && (
                                <p className="text-xs text-muted-foreground">
                                  {item.name_of_member_organization}
                                </p>
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.email || "—"}</TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                              Active
                            </Badge>
                          ) : isPendingOrInactive ? (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                              {item.status || "Pending"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">{item.status || "Unknown"}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {isSubscribed ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                              Subscribed
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">
                              Unsubscribed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {item.created_at ? dayjs(item.created_at).format("DD-MMM-YYYY") : "—"}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                              onClick={() => openDetails(item)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-blue-900 dark:text-blue-400" />
                            </Button>
                            {isPendingOrInactive ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 cursor-pointer"
                                onClick={() => openActivate(item)}
                              >
                                Activate
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                onClick={() => openDeactivate(item)}
                              >
                                Deactivate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      {isError
                        ? "Failed to load members. Please refresh or try again later."
                        : searchQuery
                          ? `No members found matching "${searchQuery}".`
                          : "No members found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Popups & Modals */}
      {showAddMemberPopup && (
        <div className="popup">
          <AddFellow onClose={handleCloseAddMemberPopup} refetch={refetch} />
        </div>
      )}

      {showDetails && <MemberModal item={selected} close={() => setShowDetails(false)} />}

      {/* Activate Confirmation Dialog */}
      <AlertDialog open={isActivateOpen} onOpenChange={setIsActivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              Activate Member Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate the account for{" "}
              <span className="font-semibold text-foreground">
                {selected?.name_of_representative ||
                  `${selected?.first_name || ""} ${selected?.last_name || ""}`.trim() ||
                  selected?.email ||
                  "this member"}
              </span>
              ? They will be granted full access to the portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>No, cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isBusy}
              className="bg-[#015907] hover:bg-[#015907]/90 text-white cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                ChangeAccountStatus("activate");
              }}
            >
              {isBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                "Yes, Activate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Deactivate Member Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate the account for{" "}
              <span className="font-semibold text-foreground">
                {selected?.name_of_representative ||
                  `${selected?.first_name || ""} ${selected?.last_name || ""}`.trim() ||
                  selected?.email ||
                  "this member"}
              </span>
              ? They will no longer be able to log in or access member privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>No, cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isBusy}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                ChangeAccountStatus("deactivate");
              }}
            >
              {isBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deactivating...
                </>
              ) : (
                "Yes, Deactivate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Members;

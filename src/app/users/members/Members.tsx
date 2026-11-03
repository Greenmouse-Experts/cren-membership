// @ts-nocheck
import React, { useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  FileDown,
  Eye,
  Pencil,
  Trash2,
  CreditCard,
  Loader2,
  AlertTriangle,
  User as UserIcon,
} from "lucide-react";

import { API_URL } from "@/app/services/env";
import useGetHook from "../../hook/useGet";
import type { Member } from "@/types/api";

// Modals
import AddMembers from "./AddMembers";
import MemberModal from "./memberModal";
import EditMember from "./EditMember";
import CardModal from "./CardModal";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  } = useGetHook<Member[]>("member/retrieve/all/member");

  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // Modals state
  const [showDetails, setShowDetails] = useState(false);
  const [showID, setShowID] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [showEditMemberPopup, setShowEditMemberPopup] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Extracted raw members from API response
  const rawMembers = useMemo(() => extractMembers(data), [data]);

  // Reactive filtered members
  const items = useMemo(() => {
    if (!searchQuery.trim()) return rawMembers;
    const q = searchQuery.toLowerCase().trim();
    return rawMembers.filter((item) => {
      const first = item.first_name?.toLowerCase() || "";
      const last = item.last_name?.toLowerCase() || "";
      const fullName = `${first} ${last}`.trim();
      const rep = item.name_of_representative?.toLowerCase() || "";
      const org = item.name_of_member_organization?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const idNumber = item.id_number?.toLowerCase() || "";
      const memId = item.membership_id?.toLowerCase() || "";

      return (
        first.includes(q) ||
        last.includes(q) ||
        fullName.includes(q) ||
        rep.includes(q) ||
        org.includes(q) ||
        email.includes(q) ||
        idNumber.includes(q) ||
        memId.includes(q)
      );
    });
  }, [rawMembers, searchQuery]);

  const handleAddMemberClick = () => {
    setShowAddMemberPopup(true);
  };

  const handleCloseAddMemberPopup = () => {
    setShowAddMemberPopup(false);
  };

  const handleEditMemberClick = (item: Member) => {
    setSelected(item);
    setShowEditMemberPopup(true);
  };

  const handleCloseEditMemberPopup = () => {
    setShowEditMemberPopup(false);
  };

  const openCard = (item: Member) => {
    setSelected(item);
    setShowID(true);
  };

  const openDetails = (item: Member) => {
    setSelected(item);
    setShowDetails(true);
  };

  const openDelete = (item: Member) => {
    setSelected(item);
    setIsDeleteOpen(true);
  };

  const downloadAsPDF = () => {
    const listToExport = items.length ? items : rawMembers;
    if (!listToExport.length) {
      toast.info("No member data available to download");
      return;
    }

    const doc = new jsPDF();
    doc.autoTable({
      head: [["S/N", "Member Id", "Member Name", "Email", "Date Created"]],
      body: listToExport.map((item, index) => [
        index + 1,
        item.id_number || item.membership_id || "N/A",
        `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
          item.name_of_representative ||
          item.name_of_member_organization ||
          "N/A",
        item.email || "N/A",
        item.created_at ? dayjs(item.created_at).format("DD-MMM-YYYY") : "N/A",
      ]),
    });

    doc.save("members.pdf");
  };

  const DeleteMember = async () => {
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
      const res = await axios.post(
        `${API_URL}/member/delete/member?member_id=${selected.id}`,
        {},
        config,
      );
      toast.success(res.data?.message || "Member deleted successfully");
      refetch();
      setIsDeleteOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete member");
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
                Browse member directory, view credentials, generate cards, and manage profiles.
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
                placeholder="Search by name, ID, or email..."
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
                  <TableHead>Avatar</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-6 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-44" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Skeleton className="h-8 w-28 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : items.length > 0 ? (
                  items.map((item, index) => {
                    const fullName =
                      `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
                      item.name_of_representative ||
                      item.username ||
                      item.name_of_member_organization ||
                      "—";

                    const initials =
                      `${item.first_name?.[0] || ""}${item.last_name?.[0] || ""}`.toUpperCase() ||
                      fullName[0]?.toUpperCase() ||
                      "M";

                    const avatarUrl = item.passport || item.avatar;
                    const memberCode = item.id_number || item.membership_id || "—";

                    return (
                      <TableRow key={item.id || index} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-center text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-900 dark:text-blue-400">
                          {memberCode}
                        </TableCell>
                        <TableCell>
                          <Avatar className="h-10 w-10 border">
                            {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
                            <AvatarFallback className="bg-muted text-xs font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium text-foreground">{fullName}</p>
                            {item.name_of_member_organization &&
                              item.name_of_member_organization !== fullName && (
                                <p className="text-xs text-muted-foreground">
                                  {item.name_of_member_organization}
                                </p>
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.email || "—"}</TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {item.created_at ? dayjs(item.created_at).format("DD-MMM-YYYY") : "—"}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 cursor-pointer"
                              onClick={() => openCard(item)}
                              title="Generate Member ID Card"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Card</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1 text-blue-900 border-blue-200 hover:bg-blue-50 hover:text-blue-900 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950 cursor-pointer"
                              onClick={() => handleEditMemberClick(item)}
                              title="Edit Member"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                              onClick={() => openDetails(item)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                              onClick={() => openDelete(item)}
                              title="Delete Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
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
          <AddMembers refetch={refetch} onClose={handleCloseAddMemberPopup} />
        </div>
      )}

      {showEditMemberPopup && (
        <div className="popup">
          <EditMember item={selected} onClose={handleCloseEditMemberPopup} refetch={refetch} />
        </div>
      )}

      {showID && <CardModal item={selected} close={() => setShowID(false)} />}
      {showDetails && <MemberModal item={selected} close={() => setShowDetails(false)} />}

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Member Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the member account for{" "}
              <span className="font-semibold text-foreground">
                {selected?.first_name || selected?.last_name
                  ? `${selected?.first_name || ""} ${selected?.last_name || ""}`.trim()
                  : selected?.name_of_representative || selected?.email || "this member"}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>No, cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isBusy}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                DeleteMember();
              }}
            >
              {isBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Members;

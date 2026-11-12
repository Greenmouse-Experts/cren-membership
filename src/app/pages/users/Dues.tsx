import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { usePaystackPayment } from "react-paystack";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";
import { CreditCard, Landmark, Calendar, RefreshCcw } from "lucide-react";

import useGetHook from "../../hook/useGet";
import usePostHook from "../../hook/usePost";
import { formatAsNgnMoney } from "../../services/helpers";
import { dueCategoryName, type DueItem } from "@/types/api";

import PageLoader from "@/components/layout/PageLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UploadReceipt from "../../users/UploadReceipt";

interface PaystackPayButtonProps {
  item: DueItem;
  onVerify: (reference: string, dueId: string | number) => void;
}

const PaystackPayButton: React.FC<PaystackPayButtonProps> = ({ item, onVerify }) => {
  const email = typeof window !== "undefined" ? localStorage.getItem("igbo_email") || "" : "";

  const amountInKobo = Math.round(Number(item.amount || 0) * 100);

  const new_key = "pk_test_fe7139f1b8c79eb8d80205804553a52a55bcf8f5";
  const old_key = "pk_test_49f890a833251838e552b28276e8e42006444ce7";
  const config = {
    reference: new Date().getTime().toString(),
    email: email || "member@example.com",
    amount: amountInKobo,
    publicKey: new_key,
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <Button
      size="sm"
      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 cursor-pointer shadow-sm"
      onClick={() => {
        initializePayment({
          onSuccess: (reference: { reference: string }) => {
            onVerify(reference.reference, item.id);
          },
          onClose: () => {
            console.log("Paystack dialog closed");
          },
        });
      }}
    >
      <RiSecurePaymentFill className="h-4 w-4" />
      Pay Online
    </Button>
  );
};

const MembersDues: React.FC = () => {
  const { data: response, refetch, query } = useGetHook<DueItem[]>("member/payments");
  const { handlePost } = usePostHook();

  const [selectedDue, setSelectedDue] = useState<DueItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const duesList = useMemo(() => {
    if (!response?.data || !Array.isArray(response.data)) return [];
    return response.data.filter((item) => !item.status || item.status === "Active");
  }, [response]);

  const openUpload = (item: DueItem) => {
    setSelectedDue(item);
    setIsUploadOpen(true);
  };

  const handleVerifyPayment = (reference: string, dueId: string | number) => {
    const payload = {
      due_id: dueId,
      ref_id: reference,
    };
    handlePost("member/payment/callback", payload, "application/json", () => {
      refetch();
      toast.success("Payment verified successfully!");
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <Card className="shadow-sm border-base-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Subscription Payments
            </CardTitle>
            <CardDescription>
              View active dues, pay securely via Paystack, or upload proof of manual transfer.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <PageLoader
            query={query}
            emptyState={{
              title: "No Subscription Dues",
              description: "You have no outstanding or active subscription payments at this time.",
            }}
          >
            {() =>
              duesList.length === 0 ? (
                <div className="min-h-[30vh] flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <CreditCard className="h-12 w-12 stroke-1 mb-3 text-muted-foreground/60" />
                  <p className="font-semibold text-lg text-foreground">No Active Dues Found</p>
                  <p className="text-sm max-w-sm mt-1">
                    There are currently no active dues or pending payments assigned to your account.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-12 text-center">S/N</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Account Details</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {duesList.map((item, index) => {
                        const bank = item.category?.bank;
                        return (
                          <TableRow key={item.id ?? index} className="hover:bg-muted/30">
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>

                            <TableCell
                              className="font-medium max-w-[200px] truncate"
                              title={item.description}
                            >
                              {item.description || "—"}
                            </TableCell>

                            <TableCell>
                              {dueCategoryName(item) ? (
                                <Badge variant="secondary" className="font-normal">
                                  {dueCategoryName(item)}
                                </Badge>
                              ) : (
                                "—"
                              )}
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                              {item.start_date || item.end_date ? (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                                  <span>
                                    {item.start_date || "—"} to {item.end_date || "—"}
                                  </span>
                                </div>
                              ) : (
                                "—"
                              )}
                            </TableCell>

                            <TableCell className="font-semibold text-foreground whitespace-nowrap">
                              {formatAsNgnMoney(item.amount)}
                            </TableCell>

                            <TableCell className="text-xs">
                              {bank?.bank_name || bank?.account_number ? (
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1 font-medium text-foreground">
                                    <Landmark className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                    <span>{bank.bank_name}</span>
                                  </div>
                                  {bank.account_name && (
                                    <p className="text-muted-foreground">{bank.account_name}</p>
                                  )}
                                  {bank.account_number && (
                                    <p className="font-mono text-muted-foreground">
                                      {bank.account_number}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>

                            <TableCell className="text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <PaystackPayButton item={item} onVerify={handleVerifyPayment} />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 cursor-pointer"
                                  onClick={() => openUpload(item)}
                                >
                                  <FiUploadCloud className="h-4 w-4" />
                                  Upload Receipt
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )
            }
          </PageLoader>
        </CardContent>
      </Card>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Payment Receipt</DialogTitle>
            <DialogDescription>
              Upload bank deposit slip or transaction screenshot for{" "}
              <span className="font-semibold text-foreground">
                {selectedDue?.description || "Subscription Due"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          {selectedDue && (
            <UploadReceipt
              id={selectedDue.id}
              refetch={refetch}
              close={() => {
                setIsUploadOpen(false);
                setSelectedDue(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersDues;

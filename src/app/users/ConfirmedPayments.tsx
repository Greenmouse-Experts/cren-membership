import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { CheckCircle2, XCircle, Calendar, CreditCard, Search, RefreshCcw } from "lucide-react";
import useGetHook from "../hook/useGet";
import { formatAsNgnMoney } from "../services/helpers";
import type { MemberPaymentTransaction } from "@/types/api";

import PageLoader from "@/components/layout/PageLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ConfirmedPayments: React.FC = () => {
  const {
    data: response,
    refetch,
    query,
  } = useGetHook<MemberPaymentTransaction[]>("member/payments/approved");
  const [searchTerm, setSearchTerm] = useState("");

  const transactions = useMemo(() => {
    if (!response?.data || !Array.isArray(response.data)) return [];
    return response.data;
  }, [response]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter(
      (item) =>
        item.ref_id?.toLowerCase().includes(term) ||
        item.due?.description?.toLowerCase().includes(term) ||
        item.channel?.toLowerCase().includes(term),
    );
  }, [transactions, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search reference or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <PageLoader
        query={query}
        emptyState={{
          title: "No Completed Payments",
          description: "You do not have any approved payment records yet.",
        }}
      >
        {() =>
          filteredTransactions.length === 0 ? (
            <div className="min-h-[30vh] flex flex-col items-center justify-center p-8 text-center text-muted-foreground rounded-lg border bg-muted/10">
              <CreditCard className="h-10 w-10 stroke-1 mb-2 text-muted-foreground/60" />
              <p className="font-semibold text-base text-foreground">
                {searchTerm ? "No matching payments found" : "No Completed Payments"}
              </p>
              <p className="text-xs max-w-sm mt-1">
                {searchTerm
                  ? "Try checking your search keyword or clearing the filter."
                  : "Approved payments will appear here once confirmed."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">S/N</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((item, index) => {
                    const isSuccess =
                      item.status?.toLowerCase() === "success" ||
                      item.status?.toLowerCase() === "approved";

                    return (
                      <TableRow key={item.id ?? item.ref_id ?? index} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-center text-muted-foreground">
                          {index + 1}
                        </TableCell>

                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                          {item.ref_id || "—"}
                        </TableCell>

                        <TableCell
                          className="font-medium max-w-[220px] truncate"
                          title={item.due?.description || ""}
                        >
                          {item.due?.description || "Subscription Payment"}
                        </TableCell>

                        <TableCell className="font-semibold text-foreground whitespace-nowrap">
                          {formatAsNgnMoney(item.amount)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span>
                              {item.created_at ? dayjs(item.created_at).format("DD/MM/YYYY") : "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground capitalize">
                          <Badge variant="outline" className="font-normal capitalize">
                            {item.channel || "Paystack"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right whitespace-nowrap">
                          {isSuccess ? (
                            <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20 font-medium gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1 font-medium">
                              <XCircle className="h-3 w-3" />
                              {item.status || "Failed"}
                            </Badge>
                          )}
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
    </div>
  );
};

export default ConfirmedPayments;

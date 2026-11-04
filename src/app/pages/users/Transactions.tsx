import React from "react";
import { CheckCircle2, Clock, Receipt } from "lucide-react";
import ConfirmedPayments from "../../users/ConfirmedPayments";
import PendingPayments from "../../users/PendingPayments";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MembersTransactions: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <Card className="shadow-sm border-base-200">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold tracking-tight">Transactions</CardTitle>
          </div>
          <CardDescription>
            Record and history of your subscription and payment dues on CREN.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="completed" className="space-y-6">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="completed" className="space-y-4 focus-visible:outline-none">
              <ConfirmedPayments />
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 focus-visible:outline-none">
              <PendingPayments />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersTransactions;

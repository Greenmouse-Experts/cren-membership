import { useState } from "react";
import { Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ReceiptModal = ({
  item,
  close,
}: {
  /** URL of the receipt image, or null when no receipt exists. */
  item: string | null;
  close: () => void;
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-[40rem] p-5">
        <DialogHeader>
          <DialogTitle className="text-[#075b2f]">Payment Receipt</DialogTitle>
          <DialogDescription>The uploaded receipt for this transaction.</DialogDescription>
        </DialogHeader>

        {item && !imageFailed ? (
          <div className="max-h-[60vh] overflow-y-auto">
            <img
              src={item}
              alt="Payment receipt"
              className="w-full object-contain"
              onError={() => setImageFailed(true)}
            />
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <a href={item} target="_blank" rel="noopener noreferrer">
                  <Download aria-hidden="true" />
                  Open full size
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="font-semibold text-[#075b2f]">No receipt found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No receipt was uploaded for this transaction.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;

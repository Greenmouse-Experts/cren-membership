import SubscriptionModal from "@/app/admin/Subscription/SubscriptionModal";
import type { SubscriptionItem } from "@/types/api";

interface EditSubModalProps {
  item: SubscriptionItem | null;
  close: () => void;
  refetch: () => void;
}

export default function EditSubModal({ item, close, refetch }: EditSubModalProps) {
  return <SubscriptionModal item={item} close={close} refetch={refetch} />;
}

import SubscriptionModal from "./SubscriptionModal";

export default function AddSubscription({
  close,
  refetch,
}: {
  close: () => void;
  refetch: () => void;
}) {
  return <SubscriptionModal close={close} refetch={refetch} />;
}

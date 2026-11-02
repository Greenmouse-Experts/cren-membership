import { createFileRoute } from "@tanstack/react-router";
import Notify from "@/app/pages/Notify";
import { useNotifyData } from "@/app/services/notify-context";

function NotifyPage() {
  const data = useNotifyData();
  return <Notify datas={data} />;
}

export const Route = createFileRoute("/dashboard/notify")({
  component: NotifyPage,
});

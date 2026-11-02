import { createFileRoute } from "@tanstack/react-router";
import Notify from "@/app/pages/admin/Notify";
import { useNotifyData } from "@/app/services/notify-context";

function NotifyPage() {
  const data = useNotifyData();
  return <Notify datas={data} />;
}

export const Route = createFileRoute("/admin/notify")({
  component: NotifyPage,
});

import dayjs from "dayjs";
import { CreditCard } from "lucide-react";

import useGetHook from "@/app/hook/useGet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse, Member } from "@/types/api";

interface CardModalProps {
  /** The member row the card is generated for. */
  item: Member;
  close: () => void;
}

const ID_CARD_BACKGROUND = "/card-bg.png";
const ID_CARD_LOGO = "/logo.png";

const initialsOf = (member?: Member | null) =>
  `${member?.first_name?.[0] ?? ""}${member?.last_name?.[0] ?? ""}`.toUpperCase() ||
  member?.name_of_member_organization?.[0]?.toUpperCase() ||
  "M";

const MemberCard = ({ member }: { member: Member }) => {
  const memberCode = member.id_number || member.membership_id || "—";
  const fullName =
    `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() ||
    member.name_of_representative ||
    member.name_of_member_organization ||
    "Member";

  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "ID NO", value: memberCode },
    { label: "EMAIL", value: member.email },
    { label: "PHONE", value: member.phone_number },
    { label: "GENDER", value: member.gender },
    { label: "MARITAL STATUS", value: member.marital_status },
    { label: "ADDRESS", value: member.address },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[22rem] flex-col overflow-hidden rounded-xl bg-[#f4f4f4] shadow-sm">
      <div className="relative w-full">
        <img src={ID_CARD_BACKGROUND} alt="" className="w-full" />
        <div className="absolute left-1/2 top-2 flex -translate-x-1/2 flex-col items-center gap-3">
          <p className="max-w-[16rem] text-center font-semibold uppercase text-white">
            {member.name_of_member_organization || fullName}
          </p>
          {member.passport ? (
            <img
              src={member.passport}
              alt={fullName}
              className="h-[7rem] w-[7rem] rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[7rem] w-[7rem] items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-[#015907]">
              {initialsOf(member)}
            </div>
          )}
        </div>
      </div>

      <div className="w-full p-5 pt-16">
        <p className="text-center text-2xl font-semibold text-[#015907]">{fullName}</p>
        {member.occupation && <p className="text-center font-medium">{member.occupation}</p>}

        <div className="mt-3 flex w-full flex-col gap-2">
          {rows.map(({ label, value }) => (
            <p key={label} className="flex gap-2 text-sm font-medium">
              <span className="shrink-0">{label}:</span>
              <span className="break-words">{value || "—"}</span>
            </p>
          ))}
        </div>

        <p className="mt-4 border-t border-t-[#222222] py-1 text-center text-sm italic">
          {member.created_at ? dayjs(member.created_at).format("DD-MMM -YYYY") : "—"}
        </p>
      </div>

      <div className="flex flex-col items-center px-5 pb-6">
        <p className="text-center text-sm font-semibold">
          This ID card remains the property of the Council for Renewable Energy in Nigeria.
        </p>
        <p className="mt-2 text-center text-sm font-semibold">
          If found please contact {member.email || "the secretariat"}
          {member.phone_number ? ` or call ${member.phone_number}` : ""}.
        </p>
        <img src={ID_CARD_LOGO} alt="CREN" className="mt-4 h-12 object-contain" />
      </div>
    </div>
  );
};

/**
 * Member ID card, backed by `GET member/view/member?member_id=`.
 * The endpoint is fetched when the modal mounts so the card always shows the
 * latest record for that member rather than the cached list row.
 */
const CardModal = ({ item, close }: CardModalProps) => {
  const query = useGetHook<Member>("member/view/member", { params: { member_id: item.id } });
  const member = query.data?.data;

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-4 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#075b2f]">Member ID Card</DialogTitle>
          <DialogDescription>
            Identification card generated from the member&apos;s profile.
          </DialogDescription>
        </DialogHeader>

        {query.isLoading ? (
          <Skeleton className="mx-auto h-[38rem] w-full max-w-[22rem] rounded-xl" />
        ) : query.isError || !member ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <CreditCard
              aria-hidden="true"
              className="mb-2 size-10 stroke-1 text-muted-foreground"
            />
            <p className="font-semibold text-[#075b2f]">Could not load this member&apos;s card</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query.error instanceof Error
                ? query.error.message
                : "The member record is unavailable right now."}
            </p>
            <Button variant="outline" onClick={() => query.refetch()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <MemberCard member={member} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;

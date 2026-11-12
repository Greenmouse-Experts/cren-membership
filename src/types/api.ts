export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface Member {
  id: number;
  membership_id: string;
  account_type?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  name_of_member_organization?: string | null;
  name_of_representative?: string | null;
  username?: string | null;
  email: string;
  phone_number?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  state?: string | null;
  place_business_employment?: string | null;
  nature_business_employment?: string | null;
  membership_professional_bodies?: string | null;
  previous_insolvency_work_experience?: string | null;
  referee_email_address?: string | null;
  email_verified_at?: string | null;
  passport?: string | null;
  password?: string;
  current_password?: string;
  address?: string | null;
  role?: string | null;
  status: "Active" | "Pending" | "Inactive" | string;
  remember_token?: string | null;
  avatar?: string | null;
  isSubscribed?: string | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BankDetails {
  id?: number | string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  bank_code?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BankAccount extends BankDetails {
  id: number | string;
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_code?: string | null;
  status?: "Active" | "Inactive" | string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DueCategory {
  id?: number | string;
  name: string;
  description?: string;
  status?: "Active" | "Inactive" | string | null;
  bank?: BankDetails;
  created_at?: string;
  updated_at?: string;
}

export interface DueItem {
  id: number | string;
  due_id?: number | string;
  description: string;
  category?: DueCategory | null;
  /** Some endpoints return the category under this alias. */
  payment_category?: DueCategory | null;
  /** `GET admin/dues` returns the category as flat fields rather than a nested object. */
  payment_category_id?: number | string | null;
  category_name?: string | null;
  start_date: string;
  end_date: string;
  amount: number | string;
  status: "Active" | "Inactive" | "Pending" | string;
  created_at?: string;
  updated_at?: string;
}

/** Category label for a due, supporting both the nested and flat API shapes. */
export const dueCategoryName = (item?: DueItem | null): string | null =>
  item?.category_name ?? item?.category?.name ?? item?.payment_category?.name ?? null;

/** Category id for a due, supporting both the nested and flat API shapes. */
export const dueCategoryId = (item?: DueItem | null): number | string | null =>
  item?.payment_category_id ?? item?.payment_category?.id ?? item?.category?.id ?? null;

export interface SubscriptionItem {
  id: number | string;
  /** Plan / membership tier name — sent as `plan_name` to create/update endpoints. */
  plan_name?: string | null;
  /** Legacy field name; `GET admin/subscription` now returns `plan_name`. */
  type?: string | null;
  amount: number | string;
  bank?: string | null;
  description?: string | null;
  status?: "Active" | "Inactive" | string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Shape returned by `GET /member/subscription/current` (the member's current subscription).
 * When `isSubscribed` is false, both `transaction` and `plan` are `null`.
 */
export interface MemberSubscription {
  /** True if the member has an active subscription. */
  isSubscribed: boolean | string | number;
  /** The transaction that activated the current subscription, if any. */
  transaction: MemberPaymentTransaction | null;
  /** The active plan, if any. */
  plan: SubscriptionItem | null;
}

/** Values posted to `POST /member/subscription/payment`. */
export interface SubscriptionPaymentPayload {
  subscription_id: number | string;
  ref_id: string;
}

/** Login (`POST /auth/login`) response contract — token lives at the top level. */
export interface LoginResponse {
  code: number;
  message: string;
  token: string;
  data: Member;
}

export interface MemberPaymentTransaction {
  id?: number | string;
  user_id?: number | string;
  due_id?: number | string | null;
  subscription_id?: number | string | null;
  ref_id: string;
  amount: number | string;
  channel?: string | null;
  status: "success" | "pending" | "failed" | "confirmed" | string;
  created_at?: string;
  updated_at?: string;
  paid_at?: string | null;
  receipt?: string | null;
  ip_address?: string | null;
  due?: {
    id?: number | string;
    description?: string;
    amount?: number | string;
    start_date?: string;
    end_date?: string;
    status?: string;
  } | null;
  user?: Member | null;
  /** Member who paid — the shape returned by `GET admin/get/subscription/transactions`. */
  payer?: Member | null;
}

export interface AdminProfile {
  id?: number | string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
  phone_number?: string | null;
  avatar?: string | null;
  address?: string | null;
  role?: string | null;
  status?: string | null;
}

export interface AdminNotification {
  id: number | string;
  title?: string | null;
  body?: string | null;
  status?: string | null;
  created_at?: string | null;
}

/** Shape returned by `GET /admin/dashboard`. */
export interface AdminDashboardData {
  totalPartnerMembers?: number;
  totalPartner?: number;
  totalDuesPaid?: number | string;
  totalSubscriptionPaid?: number | string;
  latestFiveMember?: Member[];
  usersPayments?: MonthlyPaymentPoint[];
  monthly_members_joined?: Record<string, number>;
}

export interface GalleryItem {
  id: number | string;
  title?: string | null;
  image?: string | null;
  content?: string | null;
  status?: string | number | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MonthlyPaymentPoint {
  month: string;
  total_amount: number | string;
}

export type MembersResponse = ApiResponse<Member[]>;
export type MemberResponse = ApiResponse<Member>;
export type SubscriptionPlansResponse = ApiResponse<SubscriptionItem[]>;
export type MemberSubscriptionResponse = ApiResponse<MemberSubscription>;

export interface ContactMessage {
  id: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type ContactMessagesResponse = ApiResponse<ContactMessage[]>;
export type DuesResponse = ApiResponse<DueItem[]>;
export type BanksResponse = ApiResponse<BankAccount[]>;
export type SubscriptionResponse = ApiResponse<SubscriptionItem[] | SubscriptionItem>;
export type PaymentTransactionsResponse = ApiResponse<MemberPaymentTransaction[]>;
export type GalleryResponse = ApiResponse<GalleryItem[]>;

export interface AdminEventItem {
  id: number | string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  organizer?: string | null;
  status?: string | number | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type EventsResponse = ApiResponse<AdminEventItem[]>;

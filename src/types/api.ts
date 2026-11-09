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
  start_date: string;
  end_date: string;
  amount: number | string;
  status: "Active" | "Inactive" | "Pending" | string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionItem {
  id: number | string;
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

export interface MemberPaymentTransaction {
  id?: number | string;
  user_id?: number | string;
  ref_id: string;
  amount: number | string;
  channel?: string | null;
  status: "success" | "pending" | "failed" | "confirmed" | string;
  created_at?: string;
  updated_at?: string;
  paid_at?: string | null;
  receipt?: string | null;
  due?: {
    id?: number | string;
    description?: string;
    amount?: number | string;
    start_date?: string;
    end_date?: string;
    status?: string;
  } | null;
  user?: Member | null;
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
export type DuesResponse = ApiResponse<DueItem[]>;
export type BanksResponse = ApiResponse<BankAccount[]>;
export type SubscriptionResponse = ApiResponse<SubscriptionItem[] | SubscriptionItem>;
export type PaymentTransactionsResponse = ApiResponse<MemberPaymentTransaction[]>;
export type GalleryResponse = ApiResponse<GalleryItem[]>;

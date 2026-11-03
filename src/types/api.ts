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

export type MembersResponse = ApiResponse<Member[]>;
export type MemberResponse = ApiResponse<Member>;

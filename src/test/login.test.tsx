import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Login from "@/app/pages/Login";
import { API_URL } from "@/app/services/env";

const navigate = vi.hoisted(() => vi.fn());
const storage = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}));

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
vi.mock("react-toastify", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/lib/router-compat", () => ({
  useNavigate: () => navigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.stubGlobal("localStorage", storage);

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.clear();
  });

  it("posts credentials as JSON and redirects after success", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        code: 200,
        token: "test-token",
        message: "Logged in",
        data: {
          name_of_member_organization: "Example Org",
          isSubscribed: true,
          email: "person@example.com",
        },
      },
    });
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Enter Email or Username"), {
      target: { value: "person@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/auth/login`,
        { login_details: "person@example.com", password: "password123" },
        { headers: { "Content-Type": "application/json" } },
      ),
    );
    expect(storage.setItem).toHaveBeenCalledWith("igbo_token", "test-token");
    expect(navigate).toHaveBeenCalledWith("/dashboard/");
  });

  it("shows a validation message and does not post when fields are empty", async () => {
    render(<Login />);
    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Please enter Email"));
    expect(axios.post).not.toHaveBeenCalled();
  });
});

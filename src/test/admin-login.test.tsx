import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminLogin from "@/app/pages/AdminLogin";
import { API_URL } from "@/app/services/env";

const navigate = vi.hoisted(() => vi.fn());
const storage = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}));

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
vi.mock("react-toastify", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/lib/router-compat", () => ({ useNavigate: () => navigate }));

vi.stubGlobal("localStorage", storage);

describe("AdminLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.clear();
  });

  it("posts admin credentials as JSON and redirects after success", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { code: 200, token: "admin-token", message: "Logged in" },
    });
    render(<AdminLogin />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/auth/admin/login`,
        { email: "admin@example.com", password: "password123" },
        { headers: { "Content-Type": "application/json" } },
      ),
    );
    expect(storage.setItem).toHaveBeenCalledWith("igbo_token", "admin-token");
    expect(navigate).toHaveBeenCalledWith("/admin/");
  });

  it("shows a validation message and does not post when fields are empty", async () => {
    render(<AdminLogin />);
    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Please enter Email"));
    expect(axios.post).not.toHaveBeenCalled();
  });
});

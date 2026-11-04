import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ForgotPassword from "@/app/pages/ForgotPassword";
import { API_URL } from "@/app/services/env";

const navigate = vi.hoisted(() => vi.fn());

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}));
vi.mock("@/lib/router-compat", () => ({ useNavigate: () => navigate }));

describe("ForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the reset email as JSON and navigates to password reset", async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { code: 200 } });
    render(<ForgotPassword />);
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "person@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/auth/password/email`,
        { email: "person@example.com" },
        { headers: { "Content-Type": "application/json" } },
      ),
    );
    expect(navigate).toHaveBeenCalledWith("/password-reset/");
  });
});

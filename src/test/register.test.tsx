import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Register from "@/app/pages/Register";
import { API_URL } from "@/app/services/env";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
vi.mock("react-toastify", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/lib/router-compat", () => ({ Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a> }));
vi.mock("@/app/users/RegisterSuccess", () => ({ default: () => <div>Registration complete</div> }));

const fillForm = () => {
  fireEvent.change(screen.getByLabelText(/Name of Representative/), { target: { value: "A Person" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "person@example.com" } });
  fireEvent.change(screen.getByLabelText("Username"), { target: { value: "person" } });
  fireEvent.change(screen.getByLabelText("Name of Member Organization"), { target: { value: "Example Org" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });
};

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends registration fields as JSON and resets after success", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 201 });
    render(<Register />);
    fillForm();
    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/auth/register`,
      {
        name_of_representative: "A Person",
        last_name: "",
        email: "person@example.com",
        password: "password123",
        username: "person",
        password_confirmation: "password123",
        phone_number: "",
        address: "",
        name_of_member_organization: "Example Org",
      },
      { headers: { "Content-Type": "application/json" } },
    ));
    expect(await screen.findByText("Registration complete")).toBeTruthy();
    expect((screen.getByLabelText("Username") as HTMLInputElement).value).toBe("");
  });

  it("rejects mismatched passwords without posting", async () => {
    render(<Register />);
    fillForm();
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "different" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }).closest("form")!);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Password and Confirm Password do not match."));
    expect(axios.post).not.toHaveBeenCalled();
  });
});

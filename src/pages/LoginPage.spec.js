import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "./LoginPage";

describe("Login Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<LoginPage />);
      const header = screen.queryByRole("heading", { name: "Login" });
      expect(header).toBeInTheDocument();
    });

    it("has email input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("email");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("password");
      expect(input.type).toBe("password");
    });

    it("Login Button", () => {
      render(<LoginPage />);
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeInTheDocument();
    });

    it("Login Button disabled", () => {
      render(<LoginPage />);
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    it("Login Button enabled after email and password are filled", () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText("email");
      const passwordInput = screen.getByLabelText("password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeEnabled();
    });
  });
});

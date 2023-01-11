/* eslint-disable testing-library/no-container */
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import SignUpPage from "./SignUpPage";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { USERS } from "../constants/API";
import "../locals/i18n";
import en from "../locals/en.json";
import ru from "../locals/ru.json";
import LanguageSelector from "../components/LanguageSelector";

let requestBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post(USERS, (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Sign up page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign up" });
      expect(header).toBeInTheDocument();
    });

    it("has userName input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("email");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("password");
      expect(input.type).toBe("password");
    });

    it("has password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("repeat password");
      expect(input).toBeInTheDocument();
    });

    it("has password repeat type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("repeat password");
      expect(input.type).toBe("password");
    });

    it("Sign up Button", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign up" });
      expect(button).toBeInTheDocument();
    });

    it("Sign up Button disabled", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let button, passwordInput, repeatPasswordInput, email, username;
    const setup = () => {
      render(<SignUpPage />);
      username = screen.getByLabelText("username");
      email = screen.getByLabelText("email");
      passwordInput = screen.getByLabelText("password");
      repeatPasswordInput = screen.getByLabelText("repeat password");
      userEvent.type(username, "user1");
      userEvent.type(email, "user1@gmail.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(repeatPasswordInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Sign up" });
    };

    it("enables the button when passwords are equal", () => {
      setup();
      expect(button).toBeEnabled();
    });

    it("sends username, email and password after pressing the button", async () => {
      setup();
      userEvent.click(button);
      await waitFor(() => {
        expect(requestBody).toEqual({
          username: "user1",
          email: "user1@gmail.com",
          password: "P4ssword",
        });
      });
    });

    it("possibility to submit only one time", async () => {
      counter = 0;
      setup();
      userEvent.click(button);
      userEvent.click(button);
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });

    it("displays spinner after clicking submit", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
    });

    it("displays account notification after submit", async () => {
      setup();
      const message = "Please check your e-mail to activate your account";
      expect(screen.queryByRole(message)).not.toBeInTheDocument();
      userEvent.click(button);
      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it("hides form after successful signUp request", async () => {
      setup();
      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
    });

    it.each`
      field         | message
      ${"username"} | ${"Incorrect username"}
      ${"email"}    | ${"Incorrect email"}
      ${"password"} | ${"Incorrect password"}
    `("displays $message for $field", async ({ message, field }) => {
      server.use(
        rest.post(USERS, (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: { [field]: message },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it("hides spinner and enables button after response received", async () => {
      server.use(
        rest.post(USERS, (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: { username: "Incorrect username" },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      await screen.findByText("Incorrect username");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it("displays mismatch message for password repeat input", () => {
      setup();
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(repeatPasswordInput, "AnotherPassword");
      const validationError = screen.queryByText("password mismatch");
      expect(validationError).toBeInTheDocument();
    });

    it.each`
      field         | message                 | label
      ${"username"} | ${"Incorrect username"} | ${"username"}
      ${"email"}    | ${"Incorrect email"}    | ${"email"}
      ${"password"} | ${"Incorrect password"} | ${"password"}
    `(
      "hides errors after $label field is updated",
      async ({ field, message, label }) => {
        server.use(
          rest.post(USERS, (req, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                validationErrors: { [field]: message },
              })
            );
          })
        );
        setup();
        userEvent.click(button);
        const validationError = await screen.findByText(message);
        userEvent.type(screen.getByLabelText(label), "updated");
        expect(validationError).not.toBeInTheDocument();
      }
    );
  });

  describe("Internationalization", () => {
    let russianToggle, englishToggle, passwordInput, repeatPasswordInput;
    const setUp = () => {
      render(
        <>
          <SignUpPage />
          <LanguageSelector />
        </>
      );
      russianToggle = screen.getByTitle("ru");
      englishToggle = screen.getByTitle("en");
      passwordInput = screen.getByLabelText("password");
      repeatPasswordInput = screen.getByLabelText("repeat password");
    };

    it("initially displays English text", () => {
      setUp();
      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.repeatPassword)).toBeInTheDocument();
    });

    it("displays Russian text after button click", () => {
      setUp();
      userEvent.click(russianToggle);
      expect(
        screen.getByRole("heading", { name: ru.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: ru.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(ru.username)).toBeInTheDocument();
      expect(screen.getByLabelText(ru.email)).toBeInTheDocument();
      expect(screen.getByLabelText(ru.password)).toBeInTheDocument();
      expect(screen.getByLabelText(ru.repeatPassword)).toBeInTheDocument();
    });

    it("displays English text after button click", () => {
      setUp();

      userEvent.click(englishToggle);
      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.repeatPassword)).toBeInTheDocument();
    });

    it("displays Russian password validation text after button click", () => {
      setUp();
      userEvent.click(russianToggle);
      userEvent.type(passwordInput, "P4ss");
      const validationMessageRussian = screen.queryByText(ru.passwordMismatch);
      expect(validationMessageRussian).toBeInTheDocument();
    });

    it("sends accept language header as en for outgoing request", async () => {
      setUp();
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(repeatPasswordInput, "P4ssword");
      const button = screen.getByRole("button", { name: en.signUp });
      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("en");
    });

    it("sends accept language header as ru after selecting language", async () => {
      setUp();
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(repeatPasswordInput, "P4ssword");
      const button = screen.getByRole("button", { name: en.signUp });
      userEvent.click(russianToggle);
      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("ru");
    });
  });
});

import { getByAltText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountActivationPage } from "./AccountActivationPage";
import { setupServer } from "msw/node";
import { rest } from "msw";

let counter = 0;
const server = setupServer(
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    counter += 1;
    if (req.params.token === "5678") {
      return res(ctx.status(400));
    }
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Account activation page", () => {
  const setup = (token) => {
    const match = { params: { token } };
    render(<AccountActivationPage match={match} />);
  };

  it("displays activation success message when token is valid", async () => {
    setup("1234");
    const message = await screen.findByText(/activated/);
    expect(message).toBeInTheDocument();
    expect(counter).toBe(1);
  });

  it("displays activation error message when token is invalid", async () => {
    setup("5678");
    const message = await screen.findByText(/failure/);
    expect(message).toBeInTheDocument();
  });

  it("sends activation request after token is changed", async () => {
    const match = {
      params: {
        token: "1234",
      },
    };

    const { rerender } = render(<AccountActivationPage match={match} />);
    await screen.findByText(/activated/);
    match.params.token = "5678";
    rerender(<AccountActivationPage match={match} />);
    expect(counter).toBe(2);
  });

  it("displays spinner during activation api call", async () => {
    setup("5678");
    const spinner = screen.queryByRole("status");
    expect(spinner).toBeInTheDocument();
    await screen.findByText(/failure/);
    expect(spinner).not.toBeInTheDocument();
  });
});

console.error = () => {};
console.warn = () => {};

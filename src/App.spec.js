import { getByAltText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer(
  rest.post(
    "http://localhost:8080/api/1.0/users/token/:token",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get("/api/1.0/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          {
            id: 1,
            userName: "user-in-list",
            email: "user-in-list@mail.com",
            image: null,
          },
        ],
        page: 0,
        size: 0,
        totalPages: 0,
      })
    );
  }),
  rest.get("http://localhost:8080/api/1.0/users/:id", (req, res, ctx) => {
    const id = Number.parseInt(req.params.id);
    return res(
      ctx.json({
        id: id,
        username: "user" + id,
        email: "user" + id + "@mail.com",
        image: null,
      })
    );
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Routing", () => {
  const setUp = (path) => {
    window.history.pushState({}, "", path);
    render(<App />);
  };

  it.each`
    path               | pageTestId
    ${"/"}             | ${"home-page"}
    ${"/signup"}       | ${"sign-up"}
    ${"/login"}        | ${"login-page"}
    ${"/user/1"}       | ${"user-page"}
    ${"/user/2"}       | ${"user-page"}
    ${"/activate/123"} | ${"activation-page"}
    ${"/activate/345"} | ${"activation-page"}
  `("displays $pageTestId page at $path", ({ path, pageTestId }) => {
    setUp(path);
    const signUpPage = screen.queryByTestId(pageTestId);
    expect(signUpPage).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"sign-up"}
    ${"/signup"} | ${"login-page"}
    ${"/login"}  | ${"home-page"}
  `("does not displays $pageTestId page at $path", ({ path, pageTestId }) => {
    setUp(path);
    const signUpPage = screen.queryByTestId(pageTestId);
    expect(signUpPage).not.toBeInTheDocument();
  });

  it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
  `("has link to homepage on NavBar", ({ targetPage }) => {
    setUp("/");
    const link = screen.getByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialLink  | pageName     | testId
    ${"/"}       | ${"Home"}    | ${"home-page"}
    ${"/signup"} | ${"Sign Up"} | ${"sign-up"}
    ${"/login"}  | ${"Login"}   | ${"login-page"}
  `(
    "displays sign up page after clicking sign up link",
    ({ initialLink, pageName, testId }) => {
      setUp(initialLink);
      const link = screen.getByRole("link", { name: pageName });
      userEvent.click(link);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    }
  );

  it("displays home page when click to the logo", () => {
    setUp("/login");
    const logo = screen.getByAltText("Hoaxify");
    userEvent.click(logo);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("navigates to user page when clicking the username on user list", async () => {
    setUp("/");
    const user = await screen.findByTestId("user-item");
    userEvent.click(user);
    const page = await screen.findByTestId("user-page");
    expect(page).toBeInTheDocument();
  });
});

console.error = () => {};
console.warn = () => {};

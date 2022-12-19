import { getByAltText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Routing", () => {
  const setUp = (path) => {
    window.history.pushState({}, "", path);
    render(<App />);
  };

  it.each`
    path         | pageTestId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"sign-up"}
    ${"/login"}  | ${"login-page"}
    ${"/user/1"} | ${"user-page"}
    ${"/user/2"} | ${"user-page"}
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
});

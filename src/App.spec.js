import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Routing", () => {
  it.each`
    path         | pageTestId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"sign-up"}
    ${"/login"}  | ${"login-page"}
  `("displays $pageTestId page at $path", ({ path, pageTestId }) => {
    window.history.pushState({}, "", path);
    render(<App />);
    const signUpPage = screen.queryByTestId(pageTestId);
    expect(signUpPage).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"sign-up"}
    ${"/signup"} | ${"home-page"}
  `("does not displays $pageTestId page at $path", ({ path, pageTestId }) => {
    window.history.pushState({}, "", path);
    render(<App />);
    const signUpPage = screen.queryByTestId(pageTestId);
    expect(signUpPage).not.toBeInTheDocument();
  });
});

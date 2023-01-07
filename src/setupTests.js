// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import i18n from "./locals/i18n";
import { act } from "react-dom/test-utils";

afterEach(() => {
  act(() => {
    i18n.changeLanguage("en");
  });
});

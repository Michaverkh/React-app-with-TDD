import { getByAltText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import UserList from "./UserList";
import LanguageSelector from "../components/LanguageSelector";
import { BrowserRouter } from "react-router-dom";
import en from "../locals/en.json";
import ru from "../locals/ru.json";

const users = [
  { id: 1, username: "user1", email: "user1@mail.com", image: null },
  { id: 2, username: "user2", email: "user2@mail.com", image: null },
  { id: 3, username: "user3", email: "user3@mail.com", image: null },
  { id: 4, username: "user4", email: "user4@mail.com", image: null },
  { id: 5, username: "user5", email: "user5@mail.com", image: null },
  { id: 6, username: "user6", email: "user6@mail.com", image: null },
  { id: 7, username: "user7", email: "user7@mail.com", image: null },
];

const getPage = (page, size) => {
  let start = page * size;
  let end = start + size;
  let totalPages = Math.ceil(users.length / size);

  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

const server = setupServer(
  rest.get("/api/1.0/users", (req, res, ctx) => {
    let size = Number.parseInt(req.url.searchParams.get("size"));
    let page = Number.parseInt(req.url.searchParams.get("page"));
    if (!page) {
      page = 0;
    }
    if (!size) {
      size = 0;
    }
    return res(ctx.status(200), ctx.json(getPage(page, size)));
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

const setup = () => {
  render(
    <BrowserRouter>
      <UserList />
      <LanguageSelector />
    </BrowserRouter>
  );
};

describe("User List", () => {
  describe("Interactions", () => {
    it("displays three users in list", async () => {
      setup();
      const users = await screen.findAllByText(/user/);
      expect(users.length).toBe(3);
    });

    it("displays next page link", async () => {
      setup();
      await screen.findByText("user1");
      expect(screen.getByText("next >")).toBeInTheDocument();
    });

    it("displays next page after clicking next", async () => {
      setup();
      await screen.findByText("user1");
      const nextPageLink = screen.queryByText("next >");
      userEvent.click(nextPageLink);
      const firstUserOnPage = await screen.findByText("user4");
      expect(firstUserOnPage).toBeInTheDocument();
    });

    it("hides next link on last page", async () => {
      setup();
      await screen.findByText("user1");
      userEvent.click(screen.queryByText("next >"));
      await screen.findByText("user4");
      userEvent.click(screen.queryByText("next >"));
      await screen.findByText("user7");
      expect(screen.queryByText("next >")).not.toBeInTheDocument();
    });

    it("does not display previous link on first page", async () => {
      setup();
      await screen.findByText("user1");
      const previousPageLink = screen.queryByText("< previous");
      expect(previousPageLink).not.toBeInTheDocument();
    });

    it("displays previous link on second page", async () => {
      setup();
      await screen.findByText("user1");
      userEvent.click(screen.queryByText("next >"));
      await screen.findByText("user4");
      const previousPageLink = screen.queryByText("< previous");
      expect(previousPageLink).toBeInTheDocument();
    });

    it("displays spinner during the api call is in progress", async () => {
      setup();
      const spinner = screen.getByRole("status");
      await screen.findByText("user1");
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe("Internationalization", () => {
    beforeEach(() => {
      server.use(
        rest.get("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getPage(1, 3)));
        })
      );
    });

    it("initially displays header and nav in english", async () => {
      setup();
      await screen.findByText("user1");
      userEvent.click(screen.queryByText("next >"));
      await screen.findByText("user4");
      expect(screen.getByText(en.users)).toBeInTheDocument();
      expect(screen.getByText(en.nextPage)).toBeInTheDocument();
      expect(screen.getByText(en.previousPage)).toBeInTheDocument();
    });

    it("displays header and nav in Russian after clicking toggle", async () => {
      setup();
      await screen.findByText("user1");
      userEvent.click(screen.queryByText("next >"));
      await screen.findByText("user4");
      userEvent.click(screen.getByTitle("ru"));
      expect(screen.getByText(ru.users)).toBeInTheDocument();
      expect(screen.getByText(ru.nextPage)).toBeInTheDocument();
      expect(screen.getByText(ru.previousPage)).toBeInTheDocument();
    });
  });
});

console.error = () => {};
console.warn = () => {};

import { getByAltText, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import UserPage from "./UserPage";

const server = setupServer();

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("User Page", () => {
  beforeEach(() => {
    server.use(
      rest.get("http://localhost:8080/api/1.0/users/:id", (req, res, ctx) => {
        // if (req.params.id === "1") {
        //   return res(
        //     ctx.json({
        //       id: 1,
        //       username: "user1",
        //       email: "user1@mail.com",
        //       image: null,
        //     })
        //   );
        // } else {
        //   return res(
        //     ctx.status(404),
        //     ctx.json({
        //       message: "User not found",
        //     })
        //   );
        // }
        return res(
          ctx.json({
            id: 1,
            username: "user1",
            email: "user1@mail.com",
            image: null,
          })
        );
      })
    );
  });

  it("displays user name on page when user is found", async () => {
    const match = { params: { id: 1 } };
    render(<UserPage match={match} />);
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });
  });

  it("displays spinner while the api call is in progress", async () => {
    const match = { params: { id: 1 } };
    render(<UserPage match={match} />);
    const spinner = screen.getByRole("status");
    await screen.findByText("user1");
    expect(spinner).not.toBeInTheDocument();
  });

  //   it("displays error message received from backend when user not found", async () => {
  //     const match = { params: { id: 100 } };
  //     render(<UserPage match={match} />);
  //     await waitFor(() => {
  //       expect(screen.getByText("User not found")).toBeInTheDocument();
  //     });
  //   });
});

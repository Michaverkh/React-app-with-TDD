import React from "react";
import UserList from "../components/UserList";

export const HomePage = () => {
  return (
    <div className="container" data-testid="home-page">
      <UserList />
    </div>
  );
};

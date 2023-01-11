import React from "react";
import { Link } from "react-router-dom";
import defaultProfileIcon from "../assets/37153188-profile.png";

export default function UserListItem({ user }) {
  return (
    <Link
      className="list-group-item list-group-item-action"
      to={`/user/${user.id}`}
      style={{ cursor: "pointer" }}
      data-testid="user-item"
    >
      <img
        src={defaultProfileIcon}
        alt="profile"
        width="30"
        className="rounded-circle shadow-sm mr-8"
      />
      {user.username}
    </Link>
  );
}

import React, { Component } from "react";
import { loadUsers } from "../api/apiCalls";

export default class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
  };

  componentDidMount() {
    loadUsers().then((res) => {
      this.setState({ page: res.data });
    });
  }
  render() {
    return (
      <div className="card">
        <header className="card-header text-center">
          <h3>Users</h3>
        </header>
        <ul className="list-group list-group-flush">
          {this.state.page.content.map((user) => {
            return (
              <span
                className="list-group-item list-group-item-action"
                key={user.id}
              >
                {user.username}
              </span>
            );
          })}
        </ul>
      </div>
    );
  }
}

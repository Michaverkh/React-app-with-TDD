import React, { Component } from "react";
import { Link } from "react-router-dom";
import { loadUsers } from "../api/apiCalls";
import UserListItem from "./UserListItem";

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

  loadPage = async (pageIndex) => {
    try {
      await loadUsers(pageIndex).then((res) => {
        this.setState({ page: res.data });
      });
    } catch (error) {
      console.log("users failure", error);
    }
  };

  render() {
    const { totalPages, page, content } = this.state.page;

    return (
      <div className="card">
        <header className="card-header text-center">
          <h3>Users</h3>
        </header>
        <ul className="list-group list-group-flush">
          {content.map((user) => {
            return <UserListItem user={user} />;
          })}
        </ul>
        <div className="card-footer">
          {page !== 0 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadPage(page - 1)}
            >
              {"< previous"}
            </button>
          )}
          {totalPages > page + 1 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadPage(page + 1)}
            >
              {"next >"}
            </button>
          )}
        </div>
      </div>
    );
  }
}

/*
<Link
className="list-group-item list-group-item-action"
key={user.id}
to={`/user/${user.id}`}
style={{ cursor: "pointer" }}
>
{user.username}
</Link> 
*/

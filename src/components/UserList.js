import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { loadUsers } from "../api/apiCalls";
import Spinner from "./Spinner";
import UserListItem from "./UserListItem";

class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
    pendingApiCall: false,
  };

  componentDidMount() {
    loadUsers().then((res) => {
      this.setState({ page: res.data });
    });
  }

  loadPage = async (pageIndex) => {
    this.setState({ pendingApiCall: true });
    try {
      await loadUsers(pageIndex).then((res) => {
        this.setState({ page: res.data });
      });
    } catch (error) {
      console.log("users failure", error);
    }
    this.setState({ pendingApiCall: false });
  };

  render() {
    const { totalPages, page, content } = this.state.page;
    const { pendingApiCall } = this.state;
    const { t } = this.props;

    return (
      <div className="card">
        <header className="card-header text-center">
          <h3>{t("users")}</h3>
        </header>
        <ul className="list-group list-group-flush">
          {content.map((user) => {
            return <UserListItem user={user} key={user.id} />;
          })}
        </ul>
        <div className="card-footer">
          {page !== 0 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadPage(page - 1)}
            >
              {t("previousPage")}
            </button>
          )}
          {totalPages > page + 1 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadPage(page + 1)}
            >
              {t("nextPage")}
            </button>
          )}
          {pendingApiCall && <Spinner size="big" />}
        </div>
      </div>
    );
  }
}

export default withTranslation()(UserList);

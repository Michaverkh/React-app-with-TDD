import React, { useEffect, useState } from "react";
import { activate } from "../api/apiCalls";

export const AccountActivationPage = (props) => {
  const [result, setResult] = useState();

  useEffect(() => {
    setResult();
    activate(props.match.params.token)
      .then(() => {
        setResult("success");
      })
      .catch(() => {
        setResult("failure");
      });
  }, [props.match.params.token]);

  let content = <span className="spinner-border" role="status"></span>;
  if (result === "success") {
    content = (
      <div className="alert alert-success mt-3">Account is activated</div>
    );
  } else if (result === "failure") {
    content = <div className="alert alert-danger mt-3">Account failure</div>;
  }

  return (
    <div className="container" data-testid="activation-page">
      {content}
    </div>
  );
};

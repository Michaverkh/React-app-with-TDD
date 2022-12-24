import React, { useEffect, useState } from "react";
import { activate } from "../api/apiCalls";

export const AccountActivationPage = ({ match }) => {
  const [result, setResult] = useState();

  useEffect(() => {
    activate(match.params.token)
      .then(() => {
        setResult("success");
      })
      .catch(() => {
        setResult("failure");
      });
  }, []);

  return (
    <div className="container" data-testid="activation-page">
      {result === "success" && (
        <div className="alert alert-success mt-3">Account is activated</div>
      )}
      {result === "failure" && (
        <div className="alert alert-danger mt-3">Account failure</div>
      )}
    </div>
  );
};

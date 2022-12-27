import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { activate } from "../api/apiCalls";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

export const AccountActivationPage = (props) => {
  const [result, setResult] = useState();
  const params = useParams();

  useEffect(() => {
    async function activateRequest() {
      try {
        setResult();
        await activate(params.token);
        setResult("success");
      } catch (error) {
        setResult("failure");
      }
    }
    activateRequest();
  }, [params.token]);

  let content = <Spinner size="big" />;
  if (result === "success") {
    content = <Alert type={"success"}>Account is activated</Alert>;
  } else if (result === "failure") {
    content = <Alert type={"danger"}>Account failure</Alert>;
  }

  return (
    <div className="container" data-testid="activation-page">
      {content}
    </div>
  );
};

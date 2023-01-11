import React, { useEffect, useState } from "react";
import Input from "../components/input";

export const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  let disabled = !(email && password);

  return (
    <div
      className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
      data-testid="login-page"
    >
      <form className="card mt-5">
        <div className="card-header">
          <h1>Login</h1>
        </div>
        <div className="card-body">
          <Input
            id={"email"}
            label={"email"}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id={"password"}
            label={"password"}
            onChange={(e) => setPassword(e.target.value)}
            type={"password"}
          />
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

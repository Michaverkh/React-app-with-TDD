import React, { useEffect, useState } from "react";

export const LoginPage = () => {
  // example of showing how Component did unmount works in the functional component

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setCounter((prevState) => (prevState += 1));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container" data-testid="login-page">
      Login Page
      <span>{counter}</span>
    </div>
  );
};

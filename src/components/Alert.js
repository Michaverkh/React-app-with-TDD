import React from "react";

export default function Alert({ type, children, center }) {
  let classForAlert = `alert alert-${type}`;
  if (center) {
    classForAlert += " text-center";
  }
  return <div className={classForAlert}>{children}</div>;
}

Alert.defaultProps = {
  type: "success",
};

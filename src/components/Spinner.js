import React from "react";

export default function Spinner({ size }) {
  let spanClass = "spinner border";
  if (size !== "big") {
    spanClass += " spinner border-sm";
  }
  return <span className={spanClass} role="status"></span>;
}

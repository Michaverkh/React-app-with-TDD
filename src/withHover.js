import { Component } from "react";

const withHover = (WrappedComponent) => {
  return class extends Component {
    render() {
      return <WrappedComponent />;
    }
  };
};

export default withHover;

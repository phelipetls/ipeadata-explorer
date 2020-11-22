import React from "react";

import { NoData } from "./common/NoData";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <NoData text="Um erro inesperado ocorreu" style={{ height: "100%" }} />
      );
    }

    return this.props.children;
  }
}

import * as React from "react";

import { NoData } from "components";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {
    hasError: false,
  };

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

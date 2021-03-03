import { EmptyState } from "components";
import * as React from "react";

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
        <EmptyState
          text="Um erro inesperado ocorreu"
          style={{ height: "100%" }}
        />
      );
    }

    return this.props.children;
  }
}

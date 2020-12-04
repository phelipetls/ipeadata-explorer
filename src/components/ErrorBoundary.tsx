import * as React from "react";

import { NoData } from "./common/NoData";

interface ErrorBoundaryProps {
  children: React.Component[];
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
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

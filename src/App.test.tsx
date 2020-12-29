import * as React from "react";
import { render } from "test-utils";
import { App } from "./App";

it("should render app without throwing errors", () => {
  render(<App />);
});

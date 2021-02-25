import "@testing-library/jest-dom/extend-expect";
import { server, queryClient } from "./test-utils";

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);

afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});

afterAll(() => server.close());

import "@testing-library/jest-dom/extend-expect";
import { queryCache } from "./test-utils/index.ts";
import { server } from "./test-utils/server";

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);

afterEach(() => {
  server.resetHandlers();
  queryCache.clear();
});

afterAll(() => server.close());

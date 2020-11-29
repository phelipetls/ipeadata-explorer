import "@testing-library/jest-dom/extend-expect";
import { server } from "./test-utils/server.js";

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

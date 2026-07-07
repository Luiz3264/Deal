import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import App from "../src/app.tsx";

/*
beforeEach(() => {
  render(<App />);
});
afterEach(() => cleanup());
*/
const user = userEvent.setup();

describe("Header", () => {
  render(<App />);
  const input = screen.getByPlaceholderText("Barcode here");

  it("Add item", async () => {
    await user.type(input, "123");
    await user.click(screen.getByText("ok"));
    const element = await screen.findByText("2.00 - apple");
    expect(element).toBeInTheDocument();
  });
  it("Remove item", async () => {
    const element = await screen.findByText("2.00 - apple");
    await user.click(screen.getByText("cancel"));
    expect(screen.queryByText("2.00 - apple")).toBeNull();
  });
  it("Clear all", async () => {
    await user.type(input, "123");
    await user.click(screen.getByText("ok"));
    const element = await screen.findByText("2.00 - apple");
    await user.click(screen.getByText("clear"));
    expect(screen.queryByText("2.00 - apple")).toBeNull();
  });
});
cleanup();

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import Cfg from "../src/cfg.tsx";

afterEach(() => {
  cleanup();
  window.localStorage.removeItem("deal-data");
});

describe("Config", () => {
  it("Password OK", async () => {
    const user = userEvent.setup();
    render(<Cfg />);

    await user.type(screen.getByPlaceholderText("Password"), "1234");
    await user.click(screen.getByRole("button", { name: "ok" }));

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("apple")).toBeInTheDocument();
    expect(screen.getByText("2.00")).toBeInTheDocument();
  });
});

// @ts-ignore
import React from "react";
import { render } from "@testing-library/react";
import SpreeLogo from "../components/SpreeLogo";

test("renders SpreeLogo SVG", () => {
  const { container } = render(<SpreeLogo size={48} />);
  expect(container.querySelector("svg")).toBeInTheDocument();
  expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Spree Logo");
});
import { countNights } from "./Date.js";

test("countNights returns 5 nights between 2026-06-10 and 2026-06-15", () => {
  expect(countNights("2026-06-10", "2026-06-15")).toBe(5);
});

test("countNights returns 0 if a date is missing", () => {
  expect(countNights("", "2026-06-15")).toBe(0);
});
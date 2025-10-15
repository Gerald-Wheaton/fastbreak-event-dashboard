import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("text-base", "font-bold");
    expect(result).toBe("text-base font-bold");
  });

  it("should handle conflicting Tailwind classes", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("should filter out falsy values", () => {
    const result = cn("text-base", false, null, undefined, "font-bold");
    expect(result).toBe("text-base font-bold");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

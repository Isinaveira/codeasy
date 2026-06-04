import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "./useToast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test("starts with null toast", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toBeNull();
  });

  test("showToast sets the message", () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast("Código importado"));
    expect(result.current.toast).toBe("Código importado");
  });

  test("dismissToast clears the message", () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast("test"));
    act(() => result.current.dismissToast());
    expect(result.current.toast).toBeNull();
  });

  test("auto-dismisses after default duration", () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast("Auto dismiss"));
    expect(result.current.toast).toBe("Auto dismiss");

    act(() => vi.advanceTimersByTime(3500));
    expect(result.current.toast).toBeNull();
  });
});

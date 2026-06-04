import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImportDiffModal from "./ImportDiffModal";

describe("ImportDiffModal", () => {
  const onAccept = vi.fn();
  const onClose = vi.fn();

  test("renders current code and suggested code", () => {
    render(
      <ImportDiffModal
        currentCode="<div>Old</div>"
        suggestedCode="<div>New</div>"
        language="html"
        onAccept={onAccept}
        onClose={onClose}
      />
    );

    expect(screen.getByText(/Actual/i)).toBeInTheDocument();
    expect(screen.getByText(/Sugerido/i)).toBeInTheDocument();
  });

  test("shows Ctrl+Z notice", () => {
    render(
      <ImportDiffModal
        currentCode="old"
        suggestedCode="new"
        language="html"
        onAccept={onAccept}
        onClose={onClose}
      />
    );

    expect(screen.getByText(/Ctrl\+Z/i)).toBeInTheDocument();
  });

  test("calls onAccept when Accept changes button is clicked", () => {
    render(
      <ImportDiffModal
        currentCode="old"
        suggestedCode="new"
        language="html"
        onAccept={onAccept}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /aceptar/i }));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when close button is clicked", () => {
    render(
      <ImportDiffModal
        currentCode="old"
        suggestedCode="new"
        language="html"
        onAccept={onAccept}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

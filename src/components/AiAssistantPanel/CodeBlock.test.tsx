import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeBlock from "./CodeBlock";

describe("CodeBlock", () => {
  const onImport = vi.fn();

  test("renders code content", () => {
    render(<CodeBlock language="html" code="<div>Hello</div>" onImport={onImport} />);
    expect(screen.getByText("<div>Hello</div>")).toBeInTheDocument();
  });

  test("shows Import button for html", () => {
    render(<CodeBlock language="html" code="<div>" onImport={onImport} />);
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
  });

  test("shows Import button for css and js", () => {
    const { unmount } = render(<CodeBlock language="css" code="body {}" onImport={onImport} />);
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
    unmount();

    render(<CodeBlock language="js" code="console.log('hi')" onImport={onImport} />);
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
  });

  test("does not show Import button for unsupported language", () => {
    render(<CodeBlock language="python" code="print('hi')" onImport={onImport} />);
    expect(screen.queryByRole("button", { name: /import/i })).not.toBeInTheDocument();
  });

  test("calls onImport when Import button is clicked", () => {
    render(<CodeBlock language="html" code="<div>" onImport={onImport} />);
    fireEvent.click(screen.getByRole("button", { name: /import/i }));
    expect(onImport).toHaveBeenCalledTimes(1);
  });
});

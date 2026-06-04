import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeBlock from "./CodeBlock";
import ImportDiffModal from "./ImportDiffModal";
import { parseCodeBlocks } from "../../utils/parseCodeBlocks";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("parseCodeBlocks", () => {
  test("parses code blocks from assistant markdown", () => {
    const md = 'Texto\n```html\n<h1>Title</h1>\n```\n\n```css\nbody {}\n```';
    const blocks = parseCodeBlocks(md);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].language).toBe("html");
    expect(blocks[0].code).toBe("<h1>Title</h1>");
    expect(blocks[1].language).toBe("css");
  });
});

describe("CodeBlock + ImportDiffModal integration", () => {
  test("clicking import opens modal, accepting calls handler", () => {
    const onAccept = vi.fn();

    render(
      <ImportDiffModal
        currentCode="<div>Old</div>"
        suggestedCode="<div>New</div>"
        language="html"
        onAccept={onAccept}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/actual/i)).toBeInTheDocument();
    expect(screen.getByText(/sugerido/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /aceptar cambios/i }));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  test("modal shows Ctrl+Z notice", () => {
    render(
      <ImportDiffModal
        currentCode="old"
        suggestedCode="new"
        language="js"
        onAccept={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText(/ctrl\+z/i)).toBeInTheDocument();
  });

  test("CodeBlock import button calls handler", () => {
    const onImport = vi.fn();
    render(<CodeBlock language="html" code="<div>" onImport={onImport} />);

    fireEvent.click(screen.getByRole("button", { name: /import/i }));
    expect(onImport).toHaveBeenCalledTimes(1);
  });

  test("CodeBlock hides import button for unsupported language", () => {
    render(<CodeBlock language="python" code="print" onImport={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /import/i })).not.toBeInTheDocument();
  });
});

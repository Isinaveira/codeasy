import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import ConsolePane from "./ConsolePane";

describe("Componente: ConsolePane (Consola de Logs)", () => {

  test("Debería renderizarse por defecto con clases normales de fila", () => {
    const { container } = render(<ConsolePane />);
    
    // Verificamos que el div principal de la consola esté presente
    const consoleDiv = container.firstChild as HTMLElement;
    expect(consoleDiv).toBeInTheDocument();
    
    // Verificamos que no tenga la clase h-full de sidebar
    expect(consoleDiv.className).toContain("border-t");
    expect(consoleDiv.className).not.toContain("h-full w-full");
  });

  test("Debería renderizarse a pantalla completa cuando isFullHeight es true", () => {
    const { container } = render(<ConsolePane isFullHeight={true} />);
    
    const consoleDiv = container.firstChild as HTMLElement;
    expect(consoleDiv).toBeInTheDocument();
    
    // Debería tener la clase h-full w-full
    expect(consoleDiv.className).toContain("h-full w-full");
    expect(consoleDiv.className).toContain("rounded-lg");
    expect(consoleDiv.className).not.toContain("border-t border-line/70");
  });

});

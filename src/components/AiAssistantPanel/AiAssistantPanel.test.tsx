import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../App"; 

const mockCapabilities = vi.fn();
const mockCreateSession = vi.fn();

// Limpiamos los mocks antes de cada test para que no se mezclen las pruebas
beforeEach(() => {
  vi.restoreAllMocks();
  
  // Actualizamos el Mock para reflejar la Prompt API oficial de Google Chrome
  (window as any).ai = {
    assistant: {
      capabilities: mockCapabilities,
      create: mockCreateSession,
    }
  };
});

describe("Gemini Assistant - Etapas 1 y 2", () => {

  test("Etapa 1: El botón de IA existe en el TopBar pero el panel está cerrado por defecto", () => {
    render(<App />);

    const aiButton = screen.getByRole("button", { name: /abrir asistente de ia/i });
    expect(aiButton).toBeInTheDocument();

    const aiPanel = screen.queryByTestId("ai-panel");
    expect(aiPanel).not.toBeInTheDocument();
  });


  test("Etapa 2: Al pulsar el botón, el panel se abre y muestra el estado de carga", async () => {
    (window as any).ai = {
      languageModel: {
        capabilities: vi.fn().mockResolvedValue({ available: "readily" }),
        create: vi.fn().mockImplementation(() => new Promise(() => {})) 
      }
    };

    render(<App />);

    const aiButton = screen.getByRole("button", { name: /abrir asistente de ia/i });
    fireEvent.click(aiButton);

    const aiPanel = screen.getByTestId("ai-panel");
    expect(aiPanel).toBeInTheDocument();

    const loadingText = screen.getByText(/Verificando entorno local/i);
    expect(loadingText).toBeInTheDocument();
  });

});
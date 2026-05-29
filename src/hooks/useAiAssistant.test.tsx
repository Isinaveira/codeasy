import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAiAssistant } from "./useAiAssistant";
import { useCodeStore } from "../store/useCodeStore";

describe("useAiAssistant Hook", () => {
  const mockPrompt = vi.fn();
  const mockDestroy = vi.fn();
  const mockCreate = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockPrompt.mockReset();
    mockDestroy.mockReset();
    mockCreate.mockReset();

    // Mock Chrome Built-in AI API
    (window as any).ai = {
      languageModel: {
        capabilities: vi.fn().mockResolvedValue({ available: "readily" }),
        create: mockCreate.mockResolvedValue({
          prompt: mockPrompt,
          destroy: mockDestroy,
        }),
      },
    };

    // Reset code store to defaults
    act(() => {
      useCodeStore.setState({
        isAiOpen: false,
        devMode: "web",
        html: "<h1>Web HTML</h1>",
        css: "h1 { color: red; }",
        js: "console.log('Web JS');",
      });
    });
  });

  test("debería inicializar con los mensajes por defecto de desarrollo web", () => {
    const { result } = renderHook(() => useAiAssistant());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toContain("desarrollo web");
  });

  test("debería inicializar con los mensajes de algoritmos cuando devMode es 'algorithms'", () => {
    act(() => {
      useCodeStore.setState({ devMode: "algorithms" });
    });

    const { result } = renderHook(() => useAiAssistant());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toContain("algoritmos");
  });

  test("debería enviar sólo el JavaScript en modo algoritmos y conservar el HTML/CSS en modo web", async () => {
    act(() => {
      useCodeStore.setState({ isAiOpen: true, devMode: "web" });
    });

    const { result } = renderHook(() => useAiAssistant());

    // Esperar a que la sesión esté lista
    await vi.waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    // Enviar mensaje en modo web
    mockPrompt.mockResolvedValue("Respuesta web");
    act(() => {
      result.current.setInputValue("Hola");
    });
    
    await act(async () => {
      await result.current.handleSendMessage({ preventDefault: () => {} } as any);
    });

    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("[CONTEXTO DEL CÓDIGO ACTUAL EN EL EDITOR DE CODEASY (MODO DESARROLLO WEB)]"));
    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("HTML:\n<h1>Web HTML</h1>"));
    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("CSS:\nh1 { color: red; }"));
    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("JAVASCRIPT:\nconsole.log('Web JS');"));

    // Cambiar a modo algoritmos
    act(() => {
      useCodeStore.setState({ devMode: "algorithms" });
    });

    // Esperar a que la sesión se actualice
    await vi.waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toContain("algoritmos"); // Mensaje de bienvenida de algoritmos

    // Enviar mensaje en modo algoritmos
    mockPrompt.mockReset();
    mockPrompt.mockResolvedValue("Respuesta algoritmos");
    act(() => {
      result.current.setInputValue("Hola de nuevo");
    });
    
    await act(async () => {
      await result.current.handleSendMessage({ preventDefault: () => {} } as any);
    });

    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("[CONTEXTO DEL CÓDIGO ACTUAL EN EL EDITOR DE CODEASY (MODO ALGORITMOS)]"));
    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("JAVASCRIPT:\nconsole.log('Web JS');"));
    expect(mockPrompt).not.toHaveBeenCalledWith(expect.stringContaining("HTML:"));
    expect(mockPrompt).not.toHaveBeenCalledWith(expect.stringContaining("CSS:"));

    // Volver a modo web para comprobar que el historial original se mantiene intacto
    act(() => {
      useCodeStore.setState({ devMode: "web" });
    });

    expect(result.current.messages).toHaveLength(3); // Bienvenida + Pregunta + Respuesta
    expect(result.current.messages[1].text).toBe("Hola");
    expect(result.current.messages[2].text).toBe("Respuesta web");
  });
});

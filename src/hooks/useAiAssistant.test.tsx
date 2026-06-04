import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAiAssistant } from "./useAiAssistant";
import { useCodeStore } from "../store/useCodeStore";
import { useChatStore } from "../store/useChatStore";

describe("useAiAssistant Hook", () => {
  const mockPrompt = vi.fn();
  const mockCreate = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockPrompt.mockReset();
    mockCreate.mockReset();

    (window as any).ai = {
      languageModel: {
        capabilities: vi.fn().mockResolvedValue({ available: "readily" }),
        create: mockCreate.mockResolvedValue({
          prompt: mockPrompt,
          destroy: vi.fn(),
        }),
      },
    };

    act(() => {
      useCodeStore.setState({
        isAiOpen: true,
        devMode: "web",
        html: "<h1>Web HTML</h1>",
        css: "h1 { color: red; }",
        js: "console.log('Web JS');",
      });
      useChatStore.setState({ conversations: [], activeId: null });
    });
  });

  test("debería iniciar sin mensajes si no hay conversacion", () => {
    const { result } = renderHook(() => useAiAssistant());
    expect(result.current.messages).toHaveLength(0);
  });

  test("debería inyectar contexto de HTML, CSS y JS en modo web", async () => {
    const { result } = renderHook(() => useAiAssistant());

    await vi.waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    mockPrompt.mockResolvedValue("Respuesta web");
    act(() => {
      result.current.setInputValue("Hola");
    });
    
    await act(async () => {
      await result.current.handleSendMessage({ preventDefault: () => {} } as any);
    });

    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("[CONTEXTO HTML]"));
    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("<h1>Web HTML</h1>"));
    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("[CONTEXTO CSS]"));
  });

  test("debería inyectar sólo JS en modo algoritmos", async () => {
    act(() => {
      useCodeStore.setState({ devMode: "algorithms" });
    });

    const { result } = renderHook(() => useAiAssistant());

    await vi.waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    mockPrompt.mockResolvedValue("Respuesta algoritmos");
    act(() => {
      result.current.setInputValue("Hola algos");
    });
    
    await act(async () => {
      await result.current.handleSendMessage({ preventDefault: () => {} } as any);
    });

    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("[CONTEXTO JS]"));
    expect(mockPrompt).toHaveBeenCalledWith(expect.stringContaining("console.log('Web JS');"));
    expect(mockPrompt).not.toHaveBeenCalledWith(expect.stringContaining("HTML:"));
  });
});

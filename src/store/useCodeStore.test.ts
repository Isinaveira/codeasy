import { describe, test, expect, beforeEach } from "vitest";
import { useCodeStore } from "./useCodeStore";

describe("useCodeStore - Persistencia e Aislamiento de Código", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset store state manually
    useCodeStore.setState({
      html: '<h1>Hola desde Codeasy </h1>',
      css: 'h1 { color: #38bdf8; font-family: sans-serif; text-align: center; margin-top: 2rem; }',
      webJs: 'console.log("¡Editor Listo y conectado!")',
      algoJs: '// Escribe tu algoritmo en JavaScript aquí\nconsole.log("¡Listo para resolver algoritmos!");',
      js: 'console.log("¡Editor Listo y conectado!")',
      devMode: 'web'
    });
  });

  test("debería guardar HTML en localStorage cuando se llama a setHtml", () => {
    useCodeStore.getState().setHtml("<p>Hola mundo</p>");
    expect(useCodeStore.getState().html).toBe("<p>Hola mundo</p>");
    expect(localStorage.getItem("codeasy_html")).toBe("<p>Hola mundo</p>");
  });

  test("debería guardar CSS en localStorage cuando se llama a setCss", () => {
    useCodeStore.getState().setCss("body { background: black; }");
    expect(useCodeStore.getState().css).toBe("body { background: black; }");
    expect(localStorage.getItem("codeasy_css")).toBe("body { background: black; }");
  });

  test("debería guardar en webJs cuando estamos en modo web y se llama a setJs", () => {
    useCodeStore.getState().setDevMode("web");
    useCodeStore.getState().setJs("console.log('JS Web');");

    expect(useCodeStore.getState().js).toBe("console.log('JS Web');");
    expect(useCodeStore.getState().webJs).toBe("console.log('JS Web');");
    expect(localStorage.getItem("codeasy_web_js")).toBe("console.log('JS Web');");
    
    // El código de algoritmos no debería verse afectado
    expect(useCodeStore.getState().algoJs).toContain("algoritmos");
  });

  test("debería guardar en algoJs cuando estamos en modo algoritmos y se llama a setJs", () => {
    useCodeStore.getState().setDevMode("algorithms");
    useCodeStore.getState().setJs("function solve() {}");

    expect(useCodeStore.getState().js).toBe("function solve() {}");
    expect(useCodeStore.getState().algoJs).toBe("function solve() {}");
    expect(localStorage.getItem("codeasy_algo_js")).toBe("function solve() {}");
    
    // El código web no debería verse afectado
    expect(useCodeStore.getState().webJs).toContain("Editor Listo");
  });

  test("debería cambiar el código activo (js) de forma aislada al cambiar el devMode", () => {
    // 1. Modificar JS en modo web
    useCodeStore.getState().setDevMode("web");
    useCodeStore.getState().setJs("console.log('web code');");

    // 2. Modificar JS en modo algoritmos
    useCodeStore.getState().setDevMode("algorithms");
    useCodeStore.getState().setJs("console.log('algo code');");

    // Comprobar aislamiento
    expect(useCodeStore.getState().js).toBe("console.log('algo code');");
    
    // Volver a modo web
    useCodeStore.getState().setDevMode("web");
    expect(useCodeStore.getState().js).toBe("console.log('web code');");
  });
});

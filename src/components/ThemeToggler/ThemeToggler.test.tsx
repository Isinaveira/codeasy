import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggler from "./ThemeToggler";

describe("Componente: ThemeToggler (Píldora del Tema)", () => {

  test("Debería mostrar la bola a la izquierda en modo claro y a la derecha en modo oscuro", () => {
    
    const mockSetDarkMode = vi.fn();

    render(<ThemeToggler darkMode={false} setDarkMode={mockSetDarkMode} />);

    const botonPildora = screen.getByRole("button");
    
    expect(botonPildora).toBeInTheDocument();

    fireEvent.click(botonPildora);

    expect(mockSetDarkMode).toHaveBeenCalledTimes(1);
  });

});
# Codeasy - Online Code Editor

Codeasy es un editor de código en línea ligero e interactivo, inspirado en herramientas como CodePen o JSFiddle. Permite a los desarrolladores escribir código HTML, CSS y JavaScript y ver el resultado en tiempo real.

## 🚀 Características (MVP)

*   **Edición Multi-Lenguaje:** Paneles dedicados para HTML, CSS y JavaScript.
*   **Previsualización en Tiempo Real:** El código se inyecta de forma segura en un `iframe` para una renderización instantánea.
*   **Consola Integrada:** Captura y muestra los `console.log` ejecutados por el código del usuario.
*   **Estado Persistente en Sesión:** Desarrollado con Zustand para un manejo eficiente del estado de los editores.

## 🛠 Tecnologías Utilizadas

*   [React](https://reactjs.org/) (v19)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/) - Empaquetador y entorno de desarrollo ultra rápido.
*   [Zustand](https://zustand-demo.pmnd.rs/) - Manejo de estado global.
*   [Tailwind CSS](https://tailwindcss.com/) - Utilidades CSS para el diseño y maquetación.

## 📦 Instalación y Ejecución Local

1.  Clona o descarga el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre `http://localhost:5173` (o el puerto indicado en tu terminal) en tu navegador.

## 🌿 Flujo de Trabajo y Ramas (Branching Strategy)

Este proyecto sigue una estrategia de ramas basada en características (Feature Branching).

*   **`main`**: Es la rama principal. Contiene el código estable y funcional. Nunca se debe desarrollar directamente aquí.
*   **Ramas de características (`feature/*`)**: Para cada nueva funcionalidad o corrección, se debe crear una rama a partir de `main`.

### ¿Cómo trabajar en una nueva feature?

1.  Asegúrate de estar en `main` y actualizado:
    ```bash
    git checkout main
    ```
2.  Crea una rama para tu nueva característica (por ejemplo, para cambiar a CodeMirror):
    ```bash
    git checkout -b feature/codemirror-editor
    ```
3.  Desarrolla, haz tus commits y cuando esté listo, intégralo a `main` (a través de un Pull Request o merge).

---
*Desarrollado con ❤️ para agilizar el prototipado web.*

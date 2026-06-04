# Codeasy - The Offline Local AI Code Sandbox

Codeasy es un entorno de desarrollo interactivo (IDE) ultraligero que se ejecuta en el navegador y está diseñado para el prototipado ágil y la resolución de algoritmos. 

A diferencia de los editores basados en la nube, Codeasy utiliza la **Prompt API de Google Chrome** para ejecutar modelos de IA (Gemini Nano) localmente en el hardware del dispositivo (GPU/NPU). Este enfoque asegura privacidad al procesar el código sin conexión a internet y sin latencia de red.

![Codeasy Preview](public/codeasy_hero.png)

---

## ✨ Asistente de IA Local (Chrome Built-in AI)

Codeasy integra un asistente contextual alimentado por la IA integrada en el navegador:

*   **Procesamiento Offline:** El análisis del código se realiza íntegramente en el dispositivo local, ideal para trabajar en entornos sin conexión o con código sensible.
*   **Inyección de Contexto Dinámico:** La IA adapta su lectura según el entorno de trabajo. En modo Web, el modelo recibe y analiza HTML, CSS y JS; en modo Algoritmos, el análisis se restringe estrictamente a la lógica en JavaScript.
*   **Historial Persistente y Títulos Automáticos:** Las conversaciones se almacenan localmente mediante `Zustand persist`, permitiendo retomar sesiones tras recargar la página. La IA genera de manera asíncrona un título descriptivo basado en el primer mensaje de cada sesión.
*   **System Prompts Adaptativos:** Las instrucciones del modelo cambian automáticamente para especializar sus respuestas en diseño de interfaces o ingeniería algorítmica, dependiendo del modo activo.

---

## 🌟 Otras Características Clave

### 1. Modos de Desarrollo Independientes
El editor se adapta a tu tarea actual, aislando el código y la interfaz:
*   **Modo Desarrollo Web:** Editores de `HTML`, `CSS` y `JavaScript` en vivo. El resultado se renderiza instantáneamente en un `iframe` seguro. Ofrece Layouts ajustables (Cuadrícula, Pestañas, Sidebar).
*   **Modo Algoritmos:** Interfaz minimalista enfocada al 100% en JavaScript. Oculta HTML y CSS, priorizando una **Consola Integrada** en tiempo real capaz de interceptar logs y errores no controlados.

### 2. Exportación y Aislamiento de Código
*   **Aislamiento Constante:** El código de tus algoritmos no se mezcla con el de tus vistas web. Todo se guarda automáticamente en `localStorage`.
*   **Exportar como `.zip`:** Descarga tu entorno Web enlazado de forma estándar (`index.html`, `style.css`, `script.js`).
*   **HTML Único Compilado:** Genera con un solo clic tu proyecto completo inyectado en un único archivo HTML para probarlo donde quieras.

### 3. Herramientas Profesionales
*   **Motor Monaco Editor:** La misma base que VS Code, ofreciendo IntelliSense y atajos nativos.
*   **Emmet Integrado:** Para maquetación ultra veloz.
*   **Driver.js:** Sistema de tutoriales interactivos integrados.

---

## 🛠 Tecnologías Utilizadas (Stack)

*   **Core / UI:** React 19, TypeScript, Vite.
*   **Estilado:** Tailwind CSS v4, Lucide React (Iconografía).
*   **Estado Global:** Zustand v5 (Arquitectura de Stores e hidratación de datos persistentes).
*   **Editores de Código:** `@monaco-editor/react`, `emmet-monaco-es`.
*   **IA & Utilidades:** Chrome Built-in AI (Prompt API experimental), JSZip, Marked.
*   **Control de Calidad / Testing:** Vitest, React Testing Library, estricto desarrollo bajo metodología **TDD**.

---

## ⚙️ Habilitar la IA Local (Prompt API)

Dado que la Prompt API es una tecnología experimental de vanguardia, requiere habilitación manual en tu navegador:

1.  Asegúrate de usar una versión moderna de Google Chrome (Dev o Canary recomendadas).
2.  Navega a `chrome://flags`.
3.  Activa las siguientes banderas:
    *   `#optimization-guide-on-device-model` -> Selecciona **Enabled BypassPrefRequirement**.
    *   `#prompt-api-for-gemini-nano` -> Selecciona **Enabled**.
4.  Reinicia el navegador.
5.  Navega a `chrome://components` y verifica que el componente **Optimization Guide On Device Model** esté descargado.
6.  *Referencia*: Documentación oficial de Google sobre los [Requisitos de Hardware](https://developer.chrome.com/docs/ai/prompt-api?hl=es-419#hardware-requirements).

---

## 📦 Instalación y Ejecución Local

1.  Clona o descarga este repositorio.
2.  Instala todas las dependencias del proyecto:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo local:
    ```bash
    npm run dev
    ```
4.  Para ejecutar las pruebas automatizadas (estricto TDD):
    ```bash
    npm run test
    ```

---

## 🚀 Próximos Desarrollos (Roadmap)

1. **Sistema Completo de Ficheros:** Capacidad para crear, renombrar y eliminar múltiples archivos y pestañas dentro del editor.
2. **Visualizador de Algoritmos:** Interfaz gráfica interactiva para seguir la ejecución paso a paso (step-by-step) del estado de las variables en tus algoritmos lógicos.
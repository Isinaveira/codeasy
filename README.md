# Codeasy - The Offline Local AI Code Sandbox

Codeasy no es solo otro editor de código online. Es un **entorno de desarrollo interactivo (IDE) ultraligero potenciado por Inteligencia Artificial Local**.

Mientras que la mayoría de los editores con IA dependen de servidores en la nube, latencia de red y suscripciones de pago, Codeasy utiliza la **Prompt API de Google Chrome** para ejecutar modelos de IA (Gemini Nano) **directamente en el hardware de tu dispositivo (GPU/NPU)**. Esto garantiza cero latencia de red, privacidad absoluta (tu código nunca viaja a internet) y funcionamiento 100% offline.

![Codeasy Preview](public/codeasy_hero.png)

---

## ✨ El Diferenciador Principal: Asistente de IA Local 

Codeasy está construido alrededor del motor **Chrome Built-in AI**. No es un simple chat; es un asistente contextual profundo:

*   **Privacidad Total y Offline:** Tu código nunca abandona tu dispositivo. Ideal para trabajar con algoritmos confidenciales o en entornos sin conexión.
*   **Inyección de Contexto Inteligente:** La IA entiende exactamente en qué entorno estás. Si estás en modo Web, lee tu HTML, CSS y JS en tiempo real. Si estás resolviendo un problema de lógica, se enfoca únicamente en el JavaScript.
*   **Historial de Conversaciones Persistente:** No pierdas tus hilos de pensamiento. Codeasy guarda tus chats usando `Zustand persist`, permitiéndote cambiar de modo de desarrollo, recargar la página y retomar conversaciones anteriores. Además, la IA autogenera títulos descriptivos para tus chats en segundo plano.
*   **System Prompts Adaptativos:** El comportamiento de Gemini muta dependiendo de lo que estés haciendo. Se vuelve un experto en diseño web cuando tocas HTML/CSS, y un riguroso ingeniero de software cuando pasas al modo de algoritmos.

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
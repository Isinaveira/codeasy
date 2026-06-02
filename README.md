# Codeasy - Online Code Editor & Local AI Sandbox

Codeasy es un entorno de desarrollo interactivo (IDE) en el navegador ligero y con inteligencia artificial local integrada, diseñado para prototipado ágil y resolución de algoritmos.

![Codeasy Preview](public/codeasy_hero.png)

## 🌟 Características Clave

### 1. Modos de Desarrollo Especializados (Web & Algoritmos)
Codeasy se adapta a tu flujo de trabajo dividiéndose en dos entornos completamente independientes:
*   **Modo Desarrollo Web:** Escribe `HTML`, `CSS` y `JavaScript` y observa los resultados renderizarse de forma instantánea en un `iframe` seguro. Ofrece tres modos de visualización avanzados:
    *   **Cuadrícula:** Vista equilibrada clásica.
    *   **Pestañas:** Maximiza el espacio para concentrarte en un archivo a la vez.
    *   **Sidebar (Apilado):** Los editores se apilan verticalmente para pantallas anchas.
*   **Modo Algoritmos:** Diseñado especialmente para desafíos de código y pruebas de lógica. Desactiva los paneles HTML y CSS para ofrecerte un lienzo JavaScript limpio con una **Consola Integrada** en tiempo real a pantalla completa, capaz de interceptar logs y errores no controlados.

### 2. Asistente de IA Local (Gemini Nano & Prompt API)
Integración nativa con la **Prompt API de Google Chrome** (`window.ai`), lo que permite un chatbot inteligente ultrarrápido y offline, que procesa tu código con total privacidad local en tu GPU/NPU:
*   **Aislamiento de Código:** En modo web, Gemini Nano recibe tus paneles de HTML, CSS y JS. En modo algoritmos, el contexto se restringe únicamente al código JavaScript, evitando fugas de contexto innecesarias.
*   **Historiales de Chat Separados:** Si estás chateando en desarrollo web y cambias a algoritmos, tu conversación se guardará de forma independiente y verás un historial e inicio adaptado a tu tarea actual. Al volver, recuperarás tu conversación intacta.
*   **System Prompts Dinámicos:** La persona e instrucciones de Gemini se reconfiguran dinámicamente al cambiar de modo para especializarse en estructuración web o en resolución lógica de algoritmos.

### 3. Persistencia Automática e Aislamiento de Código
*   Todo el código escrito se guarda automáticamente en el almacenamiento local del navegador (`localStorage`).
*   Los estados de código de JavaScript están totalmente aislados: tu script de la página web y tu algoritmo lógico no se mezclan ni se sobrescriben al alternar de modo.
*   Al iniciar, Codeasy recuerda el último modo activo y restaura tu código de forma automática.

### 4. Sistema de Exportación y Descarga de archivos
*   **Guardar Explícito:** Un botón visual en la barra superior con retroalimentación inmediata mediante un **Toast animado de éxito** que confirma la persistencia local.
*   **Exportar como ZIP (.zip):** Descarga el proyecto web completo empaquetado en un archivo comprimido. Contiene una estructura de archivos limpia y enlazada de forma estándar:
    *   `index.html`: Vincula las hojas de estilo y scripts automáticamente.
    *   `style.css`: Estilos del editor aislados.
    *   `script.js`: Lógica web aislada.
*   **HTML Único Completo:** Genera un único archivo HTML compilado e inyectado con estilos y scripts para compartir proyectos rápidamente o probarlos offline con 1 clic.
*   Descargas individuales de cualquier archivo del editor con un menú desplegable inteligente.

### 5. Interfaz Premium e Identidad Visual
*   **Monaco Editor:** Integración de los editores profesionales de Microsoft VS Code con resaltado de sintaxis, autocompletado y atajos avanzados.
*   **Branding & Iconografía:** Selector de tema claro y oscuro impecable, logotipos vectoriales de marca y favicon de alto contraste optimizado (`favicon.avif`) para visualización ideal en las pestañas del navegador.

---

## 🛠 Tecnologías Utilizadas

*   **Core:** React 19, TypeScript, Vite.
*   **Editores:** Monaco Editor (`@monaco-editor/react`).
*   **Estilos:** Tailwind CSS, Vanilla CSS (Glassmorphism y Micro-animaciones).
*   **Estado Global:** Zustand 5 (Mecanismo de almacenamiento persistente aislado).
*   **Herramientas & ZIP:** JSZip (compresión en navegador), Lucide React.
*   **Motor IA:** Google Chrome built-in AI (Prompt API).
*   **Pruebas:** Vitest, React Testing Library.

---

## ⚙️ Configuración del Motor de IA (Gemini Nano)

Para habilitar la IA local en tu navegador Google Chrome, sigue estos pasos:

1.  Asegúrate de estar en una versión moderna de Google Chrome (estable o Canary).
2.  Abre `chrome://flags` en tu navegador.
3.  Busca y activa (**Enable**) las siguientes flags:
    *   `#optimization-guide-on-device-model` -> Selecciónalo como **Enabled BypassPrefRequirement**.
    *   `#prompt-api-for-gemini-nano` -> Selecciónalo como **Enabled**.
4.  Reinicia el navegador.
5.  Abre `chrome://components` y verifica que **On Device Model** esté completamente descargado y actualizado (si no aparece, abre la barra lateral de IA de la aplicación para que empiece a descargarse de forma transparente).

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
4.  Para ejecutar las pruebas automatizadas (unitarias y de hooks):
    ```bash
    npm run test
    ```
5.  Para compilar el paquete optimizado para producción:
    ```bash
    npm run build
    ```
6. Tener en cuenta los requisitos necesarios para la utilización de la IA en el navegador de forma local. Pueden consultarse en la siguiente url:
   [Prompt_API](https://developer.chrome.com/docs/ai/prompt-api?hl=es-419#hardware-requirements)
   
---

## Siguientes desarrollos:

1. Sistema de gestión de ficheros, de tal forma que podamos crear más de un fichero a la vez y editarlo.
2. Para el modo algoritmos, se implementará la funcionalidad de visualizar el algoritmo implementado, de tal forma que te ayude a entener el funcionamiento de lo que estás programando de manera gráfica.

import { driver } from "driver.js";
import { useCodeStore } from "../store/useCodeStore";

export function useTour() {
  const { devMode } = useCodeStore();

  const startTour = () => {
    const webSteps = [
      {
        element: "#codeasy-logo",
        popover: {
          title: "🚀 ¡Bienvenido a Codeasy!",
          description: "Tu entorno premium de desarrollo ultra-rápido para prototipar ideas web y dominar la algoritmia. Vamos a dar una vuelta por las herramientas principales.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#dev-mode-selector",
        popover: {
          title: "💻 Selector de Área de Trabajo",
          description: "Intercambia al instante entre el <strong>Modo Web</strong> (HTML/CSS/JS) y el <strong>Modo Algoritmos</strong> (JS lógico y consola reactiva). Cada modo guarda su propio espacio de trabajo separado.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#layout-mode-selector",
        popover: {
          title: "📐 Personalización del Diseño",
          description: "Ajusta la interfaz a tu gusto. Selecciona <strong>Cuadrícula</strong> para ver los paneles en grilla, <strong>Sidebar</strong> para una vista apilada en columnas verticales o <strong>Pestañas</strong> ideal para pantallas reducidas.",
          side: "bottom" as const,
          align: "center" as const,
        },
      },
      {
        element: "#editor-pane-html",
        popover: {
          title: "🌐 Lienzo HTML5",
          description: "Escribe tu marcado semántico con toda la potencia de Mónaco. Además, incluye la potente extensión <strong>Emmet</strong> para expandir abreviaciones HTML al instante con la tecla Tab.",
          side: "right" as const,
          align: "start" as const,
        },
      },
      {
        element: "#editor-pane-css",
        popover: {
          title: "🎨 Hojas de Estilo CSS",
          description: "Aplica diseño, colores y animaciones premium en tiempo real. Cuenta con autocompletado inteligente y refresco automático instantáneo sin esperas.",
          side: "right" as const,
          align: "center" as const,
        },
      },
      {
        element: "#editor-pane-javascript",
        popover: {
          title: "⚡ Interactividad con JS",
          description: "Dale dinamismo a tus vistas Web. Todo el código aquí se inyecta en el navegador y los errores o logs se comunican en directo a la consola del IDE.",
          side: "right" as const,
          align: "end" as const,
        },
      },
      {
        element: "#preview-pane-container",
        popover: {
          title: "👀 Vista Previa Interactiva",
          description: "Observa tus prototipos en vivo tal y como los vería el usuario. Incluye una consola integrada al pie para supervisar la ejecución sin abrir las herramientas del navegador.",
          side: "left" as const,
          align: "center" as const,
        },
      },
      {
        element: "#ai-assistant-toggle",
        popover: {
          title: "🧠 Asistente de IA (Gemini)",
          description: "Tu copiloto inteligente integrado. Haz clic para abrir el chat inteligente y pídele que optimice tu código, encuentre errores o te explique patrones complejos con una estética impecable.",
          side: "bottom" as const,
          align: "end" as const,
        },
      },
      {
        element: "#save-export-container",
        popover: {
          title: "💾 Guardar y Exportar",
          description: "Mantén tus proyectos seguros. Guarda tu código localmente en el almacenamiento del navegador de forma explícita, descarga un archivo comprimido <strong>.zip</strong> completo, o genera un archivo HTML combinado listo para producción.",
          side: "bottom" as const,
          align: "end" as const,
        },
      },
      {
        element: "#theme-toggle-container",
        popover: {
          title: "🌓 Modo Claro / Oscuro",
          description: "Elige la visualización idónea. Disfruta de un Modo Oscuro Marino premium, o cambia a un Modo Claro nítido y de alto contraste con animaciones perfectamente centradas.",
          side: "bottom" as const,
          align: "end" as const,
        },
      },
    ];

    const algoSteps = [
      {
        element: "#codeasy-logo",
        popover: {
          title: "🚀 Modo Algoritmos",
          description: "¡Bienvenido al laboratorio de algoritmia! Diseñado especialmente para programar lógica pura, resolver desafíos y probar estructuras de datos sin distracciones visuales.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#dev-mode-selector",
        popover: {
          title: "🔄 Volver al Modo Web",
          description: "Si necesitas crear un sitio web o probar interfaces y maquetados completos, puedes volver al Modo Desarrollo Web en cualquier momento desde este selector.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#layout-mode-selector",
        popover: {
          title: "📐 Ajuste de Lienzo",
          description: "Modifica la estructura de la consola. Puedes apilar el editor y la consola verticalmente (Fila) o ponerlos frente a frente en paneles paralelos (Columnas/Sidebar).",
          side: "bottom" as const,
          align: "center" as const,
        },
      },
      {
        element: "#editor-pane-javascript",
        popover: {
          title: "⚡ Editor Monaco JS",
          description: "Escribe tus algoritmos JavaScript en un lienzo despejado con tipado completo, coloreado de sintaxis premium y validación en vivo para alertar de posibles errores tipográficos.",
          side: "right" as const,
          align: "center" as const,
        },
      },
      {
        element: "#console-pane-container",
        popover: {
          title: "📟 Consola de Logs Reactiva",
          description: "Visualiza los resultados en vivo de tus <code>console.log()</code>, advertencias y errores en tiempo de ejecución. Cuenta con marcas de tiempo completas, limpieza de registros y visualización flexible.",
          side: "left" as const,
          align: "center" as const,
        },
      },
      {
        element: "#ai-assistant-toggle",
        popover: {
          title: "🧠 Tutor de Lógica IA",
          description: "Consulta tus dudas de algoritmia, pídele al asistente explicaciones detalladas del coste temporal <code>O(N)</code> o pídele ayuda para optimizar tu código mediante glassmorphism interactivo.",
          side: "bottom" as const,
          align: "end" as const,
        },
      },
      {
        element: "#save-export-container",
        popover: {
          title: "💾 Respaldar Algoritmo",
          description: "Guarda tu código JS de forma persistente en tu navegador o descárgalo directamente como un script <strong>.js</strong> ejecutable e independiente.",
          side: "bottom" as const,
          align: "end" as const,
        },
      },
    ];

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Entendido!",
      popoverClass: "driverjs-theme",
      steps: devMode === "web" ? webSteps : algoSteps,
    });

    driverObj.drive();
  };

  return { startTour };
}

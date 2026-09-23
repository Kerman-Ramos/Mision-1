# Lights Out

Implementación interactiva del clásico juego de lógica **Lights Out** desarrollada con JavaScript vanilla (ES6+), HTML5 semántico y CSS3, sin librerías externas ni dependencias.

---

## Uso de IA

* **Herramienta utilizada:** Gemini.
* **Qué delegué:**
  * Diagnóstico del ciclo de vida de eventos en los controles deslizantes (`<input type="range">`), separando el refresco de texto (`input`) de la reconstrucción del tablero (`change`) para optimizar el rendimiento y evitar repintados excesivos.
  * Refactorización algorítmica para evaluar el estado del tablero mediante métodos de array (`every`) en sustitución de bucles anidados.
  * Planteamiento de alternativas CSS (`margin-inline`, pseudoelementos del Shadow DOM para sliders nativos).
* **Prompts reales relevantes:**
  1. `"como funciona: margin-inline: 1rem; valorFilas.textContent = sliderFilas.value; valorColumnas.textContent = sliderColumnas.value;"` — Solicitud de desglose conceptual sobre propiedades lógicas modernas de CSS y la actualización reactiva del DOM a través de `.textContent` frente a `.value` en elementos `<output>`.
* **Cómo verifiqué lo generado:**
  * **Inspección en DevTools:** Verificación manual de la pestaña *Console* al inicializar y mover los controles para asegurar una ejecución libre de excepciones `ReferenceError` y `TypeError`.
  * **Pruebas de estrés y fluidez:** Comprobación del desplazamiento de los sliders validando que la cifra numérica cambie en tiempo real sin congelar la interfaz ni recrear la matriz en cada píxel recorrido.
  * **Comprobación de victoria:** Verificación del método `estanApagadasTodasLasLuces` resolviendo tableros pequeños ($2 \times 2$) para confirmar que detecta el apagado total y deshabilita los botones correctamente.
* **Qué hice a mano:**
  * Estructura HTML original (`index.html`) con semántica de formulario para controles (`label`, `output`, `input`, `select`).
  * Algoritmo de adyacencia matricial (`cambiarEstado` e inversión de casillas vecinas arriba, abajo, izquierda y derecha).
  * Paleta de color y arquitectura base de CSS con variables en `:root` y clases de cambio de tema (`theme-light`).
  * Listener de atajo de teclado para alternar modo claro/oscuro pulsando la tecla 'T'.

---

## Autopsia

### 1. Generación de tableros mediante simulación de pulsaciones aleatorias
* **Decisión:** El tablero se inicializa con todas las luces apagadas y se "desordena" aplicando una serie de pulsaciones aleatorias simuladas según la dificultad (`hacerMovimientosAleatorios`), repitiendo si el resultado queda vacío.
* **Alternativa descartada:** Asignar un estado booleano aleatorio (`Math.random() > 0.5`) a cada casilla de forma individual.
* **Justificación:** En *Lights Out*, no todas las configuraciones posibles de luces tienen solución matemática (dependen del espacio vectorial sobre $\mathbb{F}_2$). Asignar estados aleatorios celda por celda generaría partidas matemáticamente imposibles de resolver. Simular clics válidos a partir del tablero resuelto garantiza por construcción que el juego siempre tiene, al menos, una solución.

### 2. Uso de `dataset` para coordenadas frente a codificación en `id`
* **Decisión:** Almacenar la posición de cada celda usando atributos de datos HTML5 (`data-fila` y `data-col`) y acceder a ellos mediante `e.target.dataset`.
* **Alternativa descartada:** Asignar identificadores numéricos continuos (`id="luz1"`) o compuestos por índices (`id="01"`, `id="12"`).
* **Justificación:** Parsear cadenas desde el `id` con accesos por posición (`id[0]`, `id[1]`) es sumamente frágil; falla en cuanto la matriz supera 9 filas o columnas (por ejemplo, fila 10 columna 2 se rompería). Los `data-attributes` desacoplan la identificación técnica del elemento de su presentación, manteniendo el código escalable y legible.

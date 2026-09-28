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

### 1. Desordenar el tablero simulando clics válidos frente a estados puramente aleatorios
* **Decisión:** El tablero comienza con todas las luces apagadas y se "desordena" aplicando una secuencia de pulsaciones aleatorias (`hacerMovimientosAleatorios`) escaladas según la dificultad, repitiendo el proceso si el azar lo deja resuelto desde el inicio.
* **Alternativa descartada:** Asignar a cada casilla un valor booleano aleatorio independiente (`Math.random() > 0.5`) durante la creación.
* **Justificación:** Desde el punto de vista del álgebra lineal sobre el cuerpo finito $\mathbb{F}_2$, no cualquier configuración de luces en *Lights Out* tiene solución; existe un subespacio vectorial de estados inalcanzables. Asignar estados aleatorios celda por celda puede generar partidas matemáticamente imposibles de ganar. Simular jugadas válidas desde el estado base garantiza por construcción que la partida siempre tiene, al menos, una secuencia de resolución.

### 2. Guardar coordenadas mediante `dataset` frente a parseo de IDs
* **Decisión:** Asignar a cada botón HTML sus coordenadas matriciales mediante atributos de datos (`data-fila` y `data-col`) y recuperarlas en el listener delegado mediante `e.target.dataset`.
* **Alternativa descartada:** Parsear un único identificador compuesto en formato *string* (ej. `id="01"`, `id="12"`) leyendo los caracteres por posición (`id[0]`, `id[1]`).
* **Justificación:** Extraer índices de un string es sumamente frágil y rompe la lógica en el momento en que una matriz supera 9 columnas (una celda en fila 1, columna 12 generaría colisiones y errores de índice). Los *data-attributes* permiten almacenar datos numéricos nativos desacoplando el identificador en el DOM de la representación lógica de la celda.

### 3. Delegación de eventos en el contenedor padre
* **Decisión:** Implementar un único `addEventListener` en `#contenedor_luces` interceptando los clics con `closest(".luces")`.
* **Alternativa descartada:** Iterar y agregar un listener independiente a cada uno de los 40 botones (en su tamaño máximo) dentro del bucle de creación.
* **Justificación:** Agregar eventos en bucle incrementa el consumo de memoria y propicia fugas (*memory leaks*) si los nodos se eliminan del DOM sin desvincular los eventos. La delegación aprovecha el *event bubbling* (burbujeo), requiriendo un único punto de escucha constante sin importar cuántas veces se destruya y regenere la matriz en HTML.

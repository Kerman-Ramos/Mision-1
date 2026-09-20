# Lights Out

Implementación interactiva del clásico juego de lógica **Lights Out** desarrollada con JavaScript vanilla (ES6+), HTML5 y CSS3, sin librerías externas.

---

* **Prompts reales relevantes:**
  1. `"modo oscuro en ingles"` — Consulta rápida de terminología técnica para definir la nomenclatura semántica de clases CSS (`theme-light`) y estructurar los tokens de diseño mediante variables en `:root`.
  2. `"haz un ejemplo con el resultado que tendria"` — Solicitud de un caso práctico para visualizar el impacto en el DOM de `textContent` al actualizar el marcador de movimientos frente a `innerHTML`, junto con la inyección por lotes de botones mediante `DocumentFragment` sin provocar repintados (*reflows*) innecesarios.
---

## Autopsia

### 1. Generación de tableros mediante simulación de pulsaciones aleatorias
* **Decisión:** El tablero se inicializa con todas las luces apagadas y se "desordena" aplicando una serie de pulsaciones aleatorias simuladas según la dificultad (`hacerMovimientosAleatorios`).
* **Alternativa descartada:** Asignar un estado booleano aleatorio (`Math.random() > 0.5`) a cada casilla de forma individual.
* **Justificación:** En *Lights Out*, no todas las configuraciones posibles de luces tienen solución matemática (dependen del espacio vectorial sobre $\mathbb{F}_2$). Asignar estados aleatorios celda por celda generaría partidas matemáticamente imposibles de resolver. Simular clics válidos a partir del tablero resuelto garantiza por construcción que el juego siempre tiene, al menos, una solución.

### 2. Uso de `dataset` para coordenadas frente a codificación en `id`
* **Decisión:** Almacenar la posición de cada celda usando atributos de datos HTML5 (`data-fila` y `data-col`) y acceder a ellos mediante `e.target.dataset`.
* **Alternativa descartada:** Asignar identificadores numéricos continuos (`id="luz1"`) o compuestos por índices (`id="01"`, `id="12"`).
* **Justificación:** Parsear cadenas desde el `id` con accesos por posición (`id[0]`, `id[1]`) es sumamente frágil; falla en cuanto la matriz supera 9 filas o columnas (por ejemplo, fila 10 columna 2 se rompería). Los `data-attributes` desacoplan la identificación técnica del elemento de su presentación, manteniendo el código escalable y legible.

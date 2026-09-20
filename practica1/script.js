const FILAS_MIN = 2;
const FILAS_MAX = 5;
const COLUMNAS_MIN = 2;
const COLUMNAS_MAX = 8;

let movimientos = 0;
let filas = 0, columnas = 0;
const luces = [];
const lucesBotones = [];

const btnIniciar = document.querySelector("#iniciar");
const btnReiniciar = document.querySelector("#reiniciar");
const selectDificultad = document.querySelector("#dificultad");
const textoMovimientos = document.querySelector("#movimientos");
const contenedorLuces = document.querySelector("#contenedor_luces");

btnIniciar.addEventListener("click", iniciarJuego);
btnReiniciar.addEventListener("click", reiniciarJuego);
selectDificultad.addEventListener("change", iniciarJuego);

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "t") {
    document.body.classList.toggle("theme-light");
  }
});

iniciar();

function iniciar() {
  while (
    filas < FILAS_MIN || filas > FILAS_MAX || 
    columnas < COLUMNAS_MIN || columnas > COLUMNAS_MAX || 
    isNaN(filas) || isNaN(columnas)
  ) {
    filas = parseInt(prompt(`Ingrese la cantidad de filas (entre ${FILAS_MIN} y ${FILAS_MAX})`), 10);
    columnas = parseInt(prompt(`Ingrese la cantidad de columnas (entre ${COLUMNAS_MIN} y ${COLUMNAS_MAX})`), 10);
  }

  iniciarJuego();
}

function reiniciarJuego() {
  document.location.reload();
}

function iniciarJuego() {
  btnIniciar.disabled = true;
  crearTabla();
  resetearMovimientos();
  do {
    hacerMovimientosAleatorios();
  } while (estanApagadasTodasLasLuces());
}

function crearTabla() {
  contenedorLuces.textContent = "";
  luces.length = 0;
  lucesBotones.length = 0;

  const fragmento = document.createDocumentFragment();

  for (let i = 0; i < filas; i++) {
    const filaDiv = document.createElement("div");
    filaDiv.id = `fila_${i}`;
    filaDiv.classList.add("tablero");

    luces[i] = [];
    lucesBotones[i] = [];
    for (let j = 0; j < columnas; j++) {
      const boton = document.createElement("button");
      boton.classList.add("luces");

      boton.dataset.fila = i;
      boton.dataset.col = j;
      boton.addEventListener("click", hacerMovimiento);

      filaDiv.appendChild(boton);

      luces[i][j] = false;
      lucesBotones[i][j] = boton;
    }

    fragmento.appendChild(filaDiv);
  }

  contenedorLuces.appendChild(fragmento);
}

function hacerMovimientosAleatorios() {
  const dificultad = selectDificultad.value;
  
  let movimientosIniciales = filas;

  if (dificultad === "medio" || dificultad === "dificil") {
    movimientosIniciales *= columnas;
    if (dificultad === "dificil") {
      movimientosIniciales *= 2;
    }
  }

  let ultimaFila = -1;
  let ultimaCol = -1;
  for (let i = 0; i < movimientosIniciales; i++) {
    let rFila, rCol;
    do {
      rFila = Math.floor(Math.random() * filas);
      rCol = Math.floor(Math.random() * columnas);
    } while (rFila === ultimaFila && rCol === ultimaCol && (filas > 1 || columnas > 1));

    ultimaFila = rFila;
    ultimaCol = rCol;
    seleccionarLuces(rFila, rCol);
  }
}

function seleccionarLuces(fila, columna) {
  cambiarEstado(fila, columna);
  cambiarEstado(fila - 1, columna); // Luz de arriba
  cambiarEstado(fila + 1, columna); // Luz de abajo
  cambiarEstado(fila, columna - 1); // Luz de la izquierda
  cambiarEstado(fila, columna + 1); // Luz de la derecha
}

function cambiarEstado(fila, columna) {
  if (fila >= 0 && fila < filas && columna >= 0 && columna < columnas) {
    luces[fila][columna] = !luces[fila][columna];
    lucesBotones[fila][columna].classList.toggle("on", luces[fila][columna]);
  }
}

function hacerMovimiento(e) {
  movimientos++;
  textoMovimientos.textContent = `Movimientos: ${movimientos}`;

  const fila = parseInt(e.target.dataset.fila, 10);
  const col = parseInt(e.target.dataset.col, 10);

  seleccionarLuces(fila, col);
  comprobarVictoria();
}

function resetearMovimientos() {
  movimientos = 0;
  textoMovimientos.textContent = `Movimientos: ${movimientos}`;
}

function estanApagadasTodasLasLuces() {
  let victoria = true;
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      if (luces[i][j]) {
        victoria = false;
        break;
      }
    }
    if (!victoria) {
      break;
    }
  }
  return victoria;
}

function comprobarVictoria() {
  if (estanApagadasTodasLasLuces()) {
    btnIniciar.disabled = false;
    for (let i = 0; i < filas; i++) {
      for (let j = 0; j < columnas; j++) {
        lucesBotones[i][j].disabled = true;
      }
    }
    setTimeout(() => {
      alert(`¡Felicidades! Has ganado el juego en ${movimientos} movimientos.`);
    }, 100);
  }
}
const FILAS_MIN = 2;
const FILAS_MAX = 5;
const COLUMNAS_MIN = 2;
const COLUMNAS_MAX = 8;

let movimientos = 0;
let filas = 0, columnas = 0;
const luces = [];
const lucesBotones = [];

const btnReiniciar = document.querySelector("#reiniciar");
const selectDificultad = document.querySelector("#dificultad");
const textoMovimientos = document.querySelector("#movimientos");
const contenedorLuces = document.querySelector("#contenedor_luces");
const sliderFilas = document.querySelector("#filas");
const sliderColumnas = document.querySelector("#columnas");
const valorFilas = document.querySelector("#valor-filas");
const valorColumnas = document.querySelector("#valor-columnas");

btnReiniciar.addEventListener("click", iniciarJuego);
selectDificultad.addEventListener("change", iniciarJuego);
sliderFilas.addEventListener("change", iniciarJuego);
sliderColumnas.addEventListener("change", iniciarJuego);
sliderFilas.addEventListener("input", actualizarValoresDimensiones);
sliderColumnas.addEventListener("input", actualizarValoresDimensiones);
contenedorLuces.addEventListener("click", (event) => {
	const button = event.target.closest(".luces");
	if (isNaN(button))
		hacerMovimiento(button);
});

document.addEventListener("keydown", (event) => {
	if (event.key.toLowerCase() === "t") {
		document.body.classList.toggle("theme-light");
	}
});

actualizarValoresDimensiones();
iniciarJuego();

function iniciarJuego() {
	leerDimensiones();
	crearTabla();
	resetearMovimientos();
	do {
		hacerMovimientosAleatorios();
	} while (estanApagadasTodasLasLuces());
}

function leerDimensiones() {
	filas = parseInt(sliderFilas.value, 10);
	columnas = parseInt(sliderColumnas.value, 10);
}

function actualizarValoresDimensiones() {
	valorFilas.textContent = sliderFilas.value;
	valorColumnas.textContent = sliderColumnas.value;
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
	const movimientosIniciales = dificultad === "facil" ? filas : dificultad === "medio" ? filas * columnas : filas * columnas * 2;

	let ultimaFila = -1;
	let ultimaCol = -1;
	
	for (let i = 0; i < movimientosIniciales; i++) {
		let rFila = 0, rCol = 0;
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

function hacerMovimiento(event) {
	movimientos++;
	textoMovimientos.textContent = `Movimientos: ${movimientos}`;

	const fila = parseInt(event.dataset.fila, 10);
	const col = parseInt(event.dataset.col, 10);

	seleccionarLuces(fila, col);
	comprobarVictoria();
}

function resetearMovimientos() {
	movimientos = 0;
	textoMovimientos.textContent = `Movimientos: ${movimientos}`;
}

function estanApagadasTodasLasLuces() {
	return luces.every(fila => fila.every(luz => !luz));
}

function comprobarVictoria() {
	if (estanApagadasTodasLasLuces()) {
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
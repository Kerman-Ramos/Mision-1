const FILAS_MIN = 2;
const FILAS_MAX = 5;
const COLUMNAS_MIN = 2;
const COLUMNAS_MAX = 8;
const multiplicadorDificultad = 2;

const CONFIG_DIFICULTAD = {
    "facil": () => estadoJuego.filas,
    "medio": () => estadoJuego.filas * estadoJuego.columnas,
    "dificil": () => estadoJuego.filas * estadoJuego.columnas * multiplicadorDificultad
};

const estadoJuego = {
    movimientos: 0,
    filas: 0,
    columnas: 0,
    movimientosIniciales: 0,
    tablero: [],
};

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
    if (button) hacerMovimiento(button);
});

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "t") {
        document.body.classList.toggle("theme-light");
    }
});

actualizarValoresDimensiones();
iniciarJuego();

function iniciarJuego() {
    document.getElementById("mensaje-victoria").classList.remove("visible");

    const dimensionesCambiadas = leerDimensiones();

    if (dimensionesCambiadas || estadoJuego.tablero.length === 0) {
        crearTabla();
    } else {
        apagarTodasLasLuces();
    }
    
    establecerMovimientosIniciales();
    resetearMovimientos();
    
    // Salvaguarda: Evita bloqueos del navegador en matrices diminutas
    let intentos = 0;
    do {
        hacerMovimientosAleatorios();
        intentos++;
    } while (estanApagadasTodasLasLuces() && intentos < 50);
}

function apagarTodasLasLuces() {
    for (let i = 0; i < estadoJuego.filas; i++) {
        for (let j = 0; j < estadoJuego.columnas; j++) {
            estadoJuego.tablero[i][j] = false;
            
            const boton = contenedorLuces.querySelector(`[data-fila="${i}"][data-col="${j}"]`);
            if (boton) {
                boton.classList.remove("on");
                boton.setAttribute("aria-pressed", "false");
                boton.disabled = false; 
            }
        }
    }
}

function establecerMovimientosIniciales() {
    const dificultad = selectDificultad.value;
    estadoJuego.movimientosIniciales = CONFIG_DIFICULTAD[dificultad]();
}

function leerDimensiones() {
    let filas = estadoJuego.filas, columnas = estadoJuego.columnas;
    estadoJuego.filas = parseInt(sliderFilas.value, 10);
    estadoJuego.columnas = parseInt(sliderColumnas.value, 10);

    return (filas !== estadoJuego.filas || columnas !== estadoJuego.columnas);
}

function actualizarValoresDimensiones() {
    valorFilas.textContent = sliderFilas.value;
    valorColumnas.textContent = sliderColumnas.value;
}

function crearTabla() {
    contenedorLuces.textContent = "";
    estadoJuego.tablero.length = 0;

    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < estadoJuego.filas; i++) {
        const filaDiv = document.createElement("div");
        filaDiv.id = `fila_${i}`;
        filaDiv.classList.add("tablero");

        estadoJuego.tablero[i] = [];
        for (let j = 0; j < estadoJuego.columnas; j++) {
            const boton = document.createElement("button");
            boton.classList.add("luces");
            boton.dataset.fila = i;
            boton.dataset.col = j;
            boton.setAttribute("aria-label", `Luz fila ${i + 1}, columna ${j + 1}`);
            boton.setAttribute("aria-pressed", "false");

            filaDiv.appendChild(boton);

            // Se almacena estrictamente el estado booleano
            estadoJuego.tablero[i][j] = false;
        }
        fragmento.appendChild(filaDiv);
    }
    contenedorLuces.appendChild(fragmento);
}

function hacerMovimientosAleatorios() {
    let ultimaFila = -1;
    let ultimaCol = -1;
    
    for (let i = 0; i < estadoJuego.movimientosIniciales; i++) {
        let rFila = 0, rCol = 0;
        do {
            rFila = Math.floor(Math.random() * estadoJuego.filas);
            rCol = Math.floor(Math.random() * estadoJuego.columnas);
        } while (rFila === ultimaFila && rCol === ultimaCol && (estadoJuego.filas > 1 || estadoJuego.columnas > 1));

        ultimaFila = rFila;
        ultimaCol = rCol;
        
        seleccionarLuces(rFila, rCol);
    }
}

function seleccionarLuces(fila, columna) {
    cambiarEstado(fila, columna);
    cambiarEstado(fila - 1, columna);
    cambiarEstado(fila + 1, columna);
    cambiarEstado(fila, columna - 1);
    cambiarEstado(fila, columna + 1);
}

function cambiarEstado(fila, columna) {
    if (estaDentroDelTablero(fila, columna)) {
        // 1. Modificación del estado lógico
        estadoJuego.tablero[fila][columna] = !estadoJuego.tablero[fila][columna];
        const estaEncendida = estadoJuego.tablero[fila][columna];
        
        // 2. Sincronización con la vista (DOM)
        const boton = contenedorLuces.querySelector(`[data-fila="${fila}"][data-col="${columna}"]`);
        if (boton) {
            boton.classList.toggle("on", estaEncendida);
            boton.setAttribute("aria-pressed", estaEncendida);
        }
    }
}

function estaDentroDelTablero(fila, columna) {
    return fila >= 0 && fila < estadoJuego.filas && columna >= 0 && columna < estadoJuego.columnas;
}

function hacerMovimiento(boton) {
    estadoJuego.movimientos++;
    textoMovimientos.textContent = `Movimientos: ${estadoJuego.movimientos}`;

    const fila = parseInt(boton.dataset.fila, 10);
    const col = parseInt(boton.dataset.col, 10);

    seleccionarLuces(fila, col);
    comprobarVictoria();
}

function resetearMovimientos() {
    estadoJuego.movimientos = 0;
    textoMovimientos.textContent = `Movimientos: ${estadoJuego.movimientos}`;
}

function estanApagadasTodasLasLuces() {
    return estadoJuego.tablero.every(fila => fila.every(estadoBooleano => !estadoBooleano));
}

function comprobarVictoria() {
    if (estanApagadasTodasLasLuces()) {
        const todosLosBotones = contenedorLuces.querySelectorAll(".luces");
        todosLosBotones.forEach(btn => btn.disabled = true);

        setTimeout(() => {
            document.getElementById("movimientos-finales").textContent = estadoJuego.movimientos;
            document.getElementById("mensaje-victoria").classList.add("visible");
        }, 100);
    }
}
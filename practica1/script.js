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

// Selección de nodos
const btnReiniciar = document.querySelector("#reiniciar");
const selectDificultad = document.querySelector("#dificultad");
const textoMovimientos = document.querySelector("#movimientos");
const contenedorLuces = document.querySelector("#contenedor_luces");
const sliderFilas = document.querySelector("#filas");
const sliderColumnas = document.querySelector("#columnas");
const valorFilas = document.querySelector("#valor-filas");
const valorColumnas = document.querySelector("#valor-columnas");
const modalVictoria = document.querySelector("#mensaje-victoria");
const textoMovimientosFinales = document.querySelector("#movimientos-finales");

function iniciarListeners() {
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
}

iniciarListeners();
actualizarValoresDimensiones();
iniciarJuego();

function iniciarJuego() {
    modalVictoria?.classList.remove("visible");

    const dimensionesCambiadas = leerDimensiones();

    if (dimensionesCambiadas || estadoJuego.tablero.length === 0) {
        crearTabla();
    } else {
        apagarTodasLasLuces();
    }
    
    establecerMovimientosIniciales();
    resetearMovimientos();
    
    let intentos = 0;
    do {
        hacerMovimientosAleatorios();
        intentos++;
    } while (estanApagadasTodasLasLuces() && intentos < 50);
}

function apagarTodasLasLuces() {
    estadoJuego.tablero.forEach(fila => {
        fila.forEach(celda => {
            celda.estado = false;
            celda.boton.classList.remove("on");
            celda.boton.setAttribute("aria-pressed", "false");
            celda.boton.disabled = false;
        });
    });
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

            estadoJuego.tablero[i][j] = {
                estado: false,
                boton: boton
            };
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
        const celda = estadoJuego.tablero[fila][columna];
        celda.estado = !celda.estado;
        
        celda.boton.classList.toggle("on", celda.estado);
        celda.boton.setAttribute("aria-pressed", celda.estado);
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
    return estadoJuego.tablero.every(fila => fila.every(celda => !celda.estado));
}

function comprobarVictoria() {
    if (estanApagadasTodasLasLuces()) {
        estadoJuego.tablero.forEach(fila => fila.forEach(celda => celda.boton.disabled = true));

        setTimeout(() => {
            textoMovimientosFinales.textContent = estadoJuego.movimientos;
            modalVictoria.classList.add("visible");
        }, 100);
    }
}
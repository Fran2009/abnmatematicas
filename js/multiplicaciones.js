// js/multiplicaciones.js

// Estado global de la práctica
let modoConfigActual = "rango"; // "rango" o "personalizado"
let operacionesPersonalizadas = []; // Lista de { a: number, b: number } para modo personalizado
let ejerciciosPool = [];
let indiceActual = 0;
let aciertos = 0;
let errores = 0;
let totalEjercicios = 0;
let cronometroInterval = null;
let tiempoSegundos = 0;
let haFalladoFilaActual = false;

function formatearTiempo(segundos) {
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Pestañas de modo
  const tabModoRango = document.getElementById("tabModoRango");
  const tabModoPersonalizado = document.getElementById("tabModoPersonalizado");

  if (tabModoRango) {
    tabModoRango.addEventListener("click", () => cambiarModoConfig("rango"));
  }
  if (tabModoPersonalizado) {
    tabModoPersonalizado.addEventListener("click", () => cambiarModoConfig("personalizado"));
  }

  // Botones de modo rango
  const btnComenzar = document.getElementById("btnComenzar");
  const btnReiniciar = document.getElementById("btnReiniciar");
  const btnReiniciarFinal = document.getElementById("btnReiniciarFinal");

  if (btnComenzar) {
    btnComenzar.addEventListener("click", iniciarPractica);
  }

  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", reiniciarPractica);
  }

  if (btnReiniciarFinal) {
    btnReiniciarFinal.addEventListener("click", reiniciarPractica);
  }

  // Botones y controles de modo personalizado
  const btnAnadirGrupo = document.getElementById("btnAnadirGrupo");
  const btnAnadirUno = document.getElementById("btnAnadirUno");
  const btnVaciarCustom = document.getElementById("btnVaciarCustom");
  const btnComenzarCustom = document.getElementById("btnComenzarCustom");
  const btnReiniciarCustom = document.getElementById("btnReiniciarCustom");
  const customGrupoInput = document.getElementById("customGrupoInput");
  const customFactorA = document.getElementById("customFactorA");
  const customFactorB = document.getElementById("customFactorB");

  if (btnAnadirGrupo) {
    btnAnadirGrupo.addEventListener("click", anadirOperacionesGrupo);
  }

  if (btnAnadirUno) {
    btnAnadirUno.addEventListener("click", anadirOperacionIndividual);
  }

  if (btnVaciarCustom) {
    btnVaciarCustom.addEventListener("click", vaciarOperacionesCustom);
  }

  if (btnComenzarCustom) {
    btnComenzarCustom.addEventListener("click", iniciarPracticaCustom);
  }

  if (btnReiniciarCustom) {
    btnReiniciarCustom.addEventListener("click", reiniciarPractica);
  }

  // Tecla Enter en el input de grupo para añadir directamente
  if (customGrupoInput) {
    customGrupoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        anadirOperacionesGrupo();
      }
    });
  }

  // Tecla Enter en factores individuales
  if (customFactorA) {
    customFactorA.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        customFactorB?.focus();
      }
    });
  }

  if (customFactorB) {
    customFactorB.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        anadirOperacionIndividual();
      }
    });
  }

  // Escuchar cambios en la configuración de rango para actualizar el resumen de combinaciones en vivo
  const inputsConfig = [
    document.getElementById("tablaDesde"),
    document.getElementById("tablaHasta"),
    document.getElementById("multiplicarHasta"),
    document.getElementById("tipoCantidad"),
    document.getElementById("cantidadPersonalizada")
  ];

  inputsConfig.forEach((inp) => {
    if (inp) {
      inp.addEventListener("input", calcularInfoCombinaciones);
      inp.addEventListener("change", calcularInfoCombinaciones);
    }
  });

  // Permitir pulsar Enter en los inputs del modo rango para comenzar
  const configInputsRango = document.querySelectorAll("#seccionModoRango input");
  configInputsRango.forEach((inp) => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        iniciarPractica();
      }
    });
  });

  calcularInfoCombinaciones();
  renderChipsCustom();
});

/**
 * Calcula y muestra en vivo cuántas combinaciones únicas existen o si habrá repeticiones
 */
function calcularInfoCombinaciones() {
  const inputDesde = document.getElementById("tablaDesde");
  const inputHasta = document.getElementById("tablaHasta");
  const inputMultHasta = document.getElementById("multiplicarHasta");
  const selectTipo = document.getElementById("tipoCantidad");
  const inputCustom = document.getElementById("cantidadPersonalizada");
  const infoEl = document.getElementById("infoCombinaciones");

  if (!inputDesde || !inputHasta || !inputMultHasta || !selectTipo || !infoEl) return;

  let d = parseInt(inputDesde.value, 10);
  let h = parseInt(inputHasta.value, 10);
  let m = parseInt(inputMultHasta.value, 10);

  if (isNaN(d) || d < 1) d = 1;
  if (isNaN(h) || h < 1) h = 12;
  if (isNaN(m) || m < 1) m = 12;

  const minD = Math.min(d, h);
  const maxH = Math.max(d, h);
  const totalUnicas = Math.max(1, (maxH - minD + 1) * Math.max(1, m));

  const modo = selectTipo.value;
  if (modo === "custom") {
    if (inputCustom) inputCustom.style.display = "inline-block";
  } else {
    if (inputCustom) inputCustom.style.display = "none";
  }

  if (modo === "todas") {
    infoEl.innerHTML = `<i class="fa-solid fa-shuffle"></i> <strong>${totalUnicas} combinaciones únicas</strong> en orden aleatorio (sin repetir)`;
  } else {
    let cant = (modo === "custom") ? (parseInt(inputCustom?.value, 10) || 10) : parseInt(modo, 10);
    if (cant <= totalUnicas) {
      infoEl.innerHTML = `<i class="fa-solid fa-dice"></i> <strong>${cant} preguntas aleatorias</strong> de ${totalUnicas} posibles (sin repetir)`;
    } else {
      infoEl.innerHTML = `<i class="fa-solid fa-repeat"></i> <strong>${cant} preguntas</strong> (con repetición al superar las ${totalUnicas} combinaciones posibles)`;
    }
  }
}

/**
 * Inicia la práctica de multiplicaciones según el modo de cantidad configurado
 */
function iniciarPractica() {
  modoConfigActual = "rango";
  const inputDesde = document.getElementById("tablaDesde");
  const inputHasta = document.getElementById("tablaHasta");
  const inputMultHasta = document.getElementById("multiplicarHasta");
  const selectTipo = document.getElementById("tipoCantidad");
  const inputCustom = document.getElementById("cantidadPersonalizada");

  let desde = parseInt(inputDesde.value, 10);
  let hasta = parseInt(inputHasta.value, 10);
  let multHasta = parseInt(inputMultHasta.value, 10);

  // Validaciones
  if (isNaN(desde) || desde < 1) desde = 1;
  if (isNaN(hasta) || hasta < 1) hasta = 12;
  if (isNaN(multHasta) || multHasta < 1) multHasta = 12;

  // Si 'desde' es mayor que 'hasta', los intercambiamos
  if (desde > hasta) {
    const temp = desde;
    desde = hasta;
    hasta = temp;
    inputDesde.value = desde;
    inputHasta.value = hasta;
  }

  // Generar todas las combinaciones únicas base
  const todasCombinaciones = [];
  for (let tabla = desde; tabla <= hasta; tabla++) {
    for (let mult = 1; mult <= multHasta; mult++) {
      todasCombinaciones.push({
        a: tabla,
        b: mult,
        resultado: tabla * mult
      });
    }
  }

  const modo = selectTipo ? selectTipo.value : "todas";
  ejerciciosPool = [];

  if (modo === "todas") {
    // Modo: TODAS las combinaciones en orden aleatorio (sin repetición)
    ejerciciosPool = [...todasCombinaciones];
    for (let i = ejerciciosPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ejerciciosPool[i], ejerciciosPool[j]] = [ejerciciosPool[j], ejerciciosPool[i]];
    }
  } else {
    // Modo: cantidad determinada
    let N = (modo === "custom") ? parseInt(inputCustom?.value, 10) : parseInt(modo, 10);
    if (isNaN(N) || N < 1) N = 10;
    if (N > 500) N = 500;

    if (N <= todasCombinaciones.length) {
      // Si la cantidad es menor o igual al total de combinaciones: aleatorias y NUNCA se repiten
      const copia = [...todasCombinaciones];
      for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
      }
      ejerciciosPool = copia.slice(0, N);
    } else {
      // Si la cantidad es mayor al total de combinaciones disponibles:
      // Se repiten completando rondas barajadas sin consecutivas iguales
      while (ejerciciosPool.length < N) {
        const ronda = [...todasCombinaciones];
        for (let i = ronda.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [ronda[i], ronda[j]] = [ronda[j], ronda[i]];
        }
        if (
          ejerciciosPool.length > 0 &&
          ronda.length > 1 &&
          ronda[0].a === ejerciciosPool[ejerciciosPool.length - 1].a &&
          ronda[0].b === ejerciciosPool[ejerciciosPool.length - 1].b
        ) {
          [ronda[0], ronda[1]] = [ronda[1], ronda[0]];
        }
        for (const item of ronda) {
          ejerciciosPool.push({ ...item });
          if (ejerciciosPool.length === N) break;
        }
      }
    }
  }

  // Inicializar estado
  indiceActual = 0;
  aciertos = 0;
  errores = 0;
  haFalladoFilaActual = false;
  totalEjercicios = ejerciciosPool.length;

  // Iniciar cronómetro y estadísticas
  if (cronometroInterval) clearInterval(cronometroInterval);
  tiempoSegundos = 0;
  const statsSection = document.getElementById("statsSection");
  if (statsSection) statsSection.style.display = "flex";
  
  const cronoEl = document.getElementById("cronometroTiempo");
  if (cronoEl) cronoEl.textContent = "00:00";
  const aciertosEl = document.getElementById("contadorAciertos");
  if (aciertosEl) aciertosEl.textContent = "0";
  const erroresEl = document.getElementById("contadorErrores");
  if (erroresEl) erroresEl.textContent = "0";

  cronometroInterval = setInterval(() => {
    tiempoSegundos++;
    const crono = document.getElementById("cronometroTiempo");
    if (crono) crono.textContent = formatearTiempo(tiempoSegundos);
  }, 1000);

  // Limpiar contenedores
  const container = document.getElementById("ejerciciosContainer");
  container.innerHTML = "";

  const mensajeFinal = document.getElementById("mensajeFinal");
  mensajeFinal.style.display = "none";

  // Mostrar área de práctica y barra de progreso
  document.getElementById("zonaPractica").style.display = "block";
  document.getElementById("progressSection").style.display = "block";

  actualizarProgreso();

  // Generar primera fila
  generarFila(indiceActual);
}

/**
 * Genera y añade una fila con un ejercicio debajo del anterior
 */
function generarFila(index) {
  const container = document.getElementById("ejerciciosContainer");
  const ejercicio = ejerciciosPool[index];
  if (!ejercicio) return;

  // Desmarcar activa de las filas anteriores
  const filasAnteriores = container.querySelectorAll(".fila-ejercicio");
  filasAnteriores.forEach(f => f.classList.remove("activa"));

  haFalladoFilaActual = false;

  // Crear fila
  const fila = document.createElement("div");
  fila.className = "fila-ejercicio activa";
  fila.id = `fila_${index}`;

  fila.innerHTML = `
    <span class="badge-num">${index + 1}</span>
    <span class="operacion">${ejercicio.a} × ${ejercicio.b} =</span>
    <input 
      type="number" 
      inputmode="numeric" 
      class="input-resultado" 
      id="input_${index}" 
      autocomplete="off" 
      aria-label="Resultado de ${ejercicio.a} por ${ejercicio.b}"
    />
    <span class="icono-feedback" id="icon_${index}"></span>
  `;

  container.appendChild(fila);

  const inputEl = document.getElementById(`input_${index}`);
  const iconEl = document.getElementById(`icon_${index}`);

  // Evento input para validación inmediata
  inputEl.addEventListener("input", () => {
    validarRespuesta(inputEl, iconEl, ejercicio, index);
  });

  // Evento keydown para pulsar Enter
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validarForzado(inputEl, iconEl, ejercicio);
    }
  });

  // Evento blur para marcar error si abandona la casilla con valor incorrecto
  inputEl.addEventListener("blur", () => {
    if (inputEl.value.trim() !== "" && !inputEl.disabled) {
      validarForzado(inputEl, iconEl, ejercicio);
    }
  });

  // Enfocar automáticamente el nuevo input y hacer scroll si es necesario
  setTimeout(() => {
    inputEl.focus();
    fila.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 50);
}

/**
 * Valida la respuesta introducida por el usuario mientras escribe
 */
function validarRespuesta(inputEl, iconEl, ejercicio, index) {
  const valorStr = inputEl.value.trim();

  // Si está vacío, resetear estados
  if (valorStr === "") {
    marcarEstado(inputEl, null);
    iconEl.innerHTML = "";
    return;
  }

  const valorNum = parseInt(valorStr, 10);
  const resultadoEsperado = ejercicio.resultado;

  // Si el resultado es correcto
  if (valorNum === resultadoEsperado) {
    marcarEstado(inputEl, true);
    iconEl.innerHTML = `<i class="fa-solid fa-check"></i>`;
    inputEl.disabled = true;

    aciertos++;
    haFalladoFilaActual = false;
    const aciertosEl = document.getElementById("contadorAciertos");
    if (aciertosEl) aciertosEl.textContent = aciertos;

    actualizarProgreso();

    // Comprobar si quedan más ejercicios en el pool
    if (indiceActual + 1 < totalEjercicios) {
      indiceActual++;
      generarFila(indiceActual);
    } else {
      // Todas las combinaciones completadas
      mostrarMensajeFinal();
    }
    return;
  }

  // Si no es correcto, determinar si aún no ha completado las cifras que requiere la casilla
  const esperadoStr = resultadoEsperado.toString();
  const faltanCifras = valorStr.length < esperadoStr.length;

  if (faltanCifras) {
    // Aún está escribiendo (ej: ha puesto 1 cifra y la solución es de 2 cifras), mantenemos neutro
    marcarEstado(inputEl, null);
    iconEl.innerHTML = "";
  } else {
    // Ya ha alcanzado la cantidad de cifras requerida y el resultado es incorrecto
    marcarEstado(inputEl, false);
    iconEl.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    if (!haFalladoFilaActual) {
      errores++;
      haFalladoFilaActual = true;
      const erroresEl = document.getElementById("contadorErrores");
      if (erroresEl) erroresEl.textContent = errores;
    }
  }
}

/**
 * Fuerza la comprobación (al pulsar Enter o perder foco)
 */
function validarForzado(inputEl, iconEl, ejercicio) {
  const valorStr = inputEl.value.trim();
  if (valorStr === "" || inputEl.disabled) return;

  const valorNum = parseInt(valorStr, 10);
  if (valorNum === ejercicio.resultado) {
    marcarEstado(inputEl, true);
    iconEl.innerHTML = `<i class="fa-solid fa-check"></i>`;
  } else {
    marcarEstado(inputEl, false);
    iconEl.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    if (!haFalladoFilaActual) {
      errores++;
      haFalladoFilaActual = true;
      const erroresEl = document.getElementById("contadorErrores");
      if (erroresEl) erroresEl.textContent = errores;
    }
  }
}

/**
 * Aplica clases de estilo correcto/incorrecto/neutro al input
 */
function marcarEstado(element, estado) {
  if (estado === true) {
    element.classList.add("correcto");
    element.classList.remove("incorrecto");
  } else if (estado === false) {
    element.classList.add("incorrecto");
    element.classList.remove("correcto");
  } else {
    element.classList.remove("correcto");
    element.classList.remove("incorrecto");
  }
}

/**
 * Actualiza la información y barra de progreso
 */
function actualizarProgreso() {
  const txtProgreso = document.getElementById("progresoTexto");
  const barFill = document.getElementById("progressBarFill");

  if (txtProgreso) {
    txtProgreso.textContent = `Aciertos: ${aciertos} de ${totalEjercicios}`;
  }

  if (barFill && totalEjercicios > 0) {
    const porcentaje = Math.round((aciertos / totalEjercicios) * 100);
    barFill.style.width = `${porcentaje}%`;
  }
}

/**
 * Muestra el mensaje de enhorabuena y lanza la animación de confeti
 */
function mostrarMensajeFinal() {
  if (cronometroInterval) {
    clearInterval(cronometroInterval);
    cronometroInterval = null;
  }
  const mensajeFinal = document.getElementById("mensajeFinal");
  mensajeFinal.style.display = "block";
  const pDesc = mensajeFinal.querySelector("p");
  if (pDesc) {
    pDesc.innerHTML = `Has completado las <strong>${totalEjercicios}</strong> multiplicaciones en <strong>${formatearTiempo(tiempoSegundos)}</strong> con <strong>${aciertos}</strong> aciertos y <strong>${errores}</strong> ${errores === 1 ? "error" : "errores"}.`;
  }
  mensajeFinal.scrollIntoView({ behavior: "smooth", block: "center" });

  lanzarConfeti();
}

/**
 * Reinicia la sesión de práctica según el modo activo
 */
function reiniciarPractica() {
  if (modoConfigActual === "personalizado") {
    iniciarPracticaCustom();
  } else {
    iniciarPractica();
  }
}

/**
 * Cambia entre el modo por rango de tablas y multiplicaciones personalizadas
 */
function cambiarModoConfig(nuevoModo) {
  modoConfigActual = nuevoModo;

  const tabRango = document.getElementById("tabModoRango");
  const tabCustom = document.getElementById("tabModoPersonalizado");
  const secRango = document.getElementById("seccionModoRango");
  const secCustom = document.getElementById("seccionModoPersonalizado");

  if (nuevoModo === "personalizado") {
    tabRango?.classList.remove("active");
    tabCustom?.classList.add("active");
    if (secRango) secRango.style.display = "none";
    if (secCustom) secCustom.style.display = "block";

    const inputGrupo = document.getElementById("customGrupoInput");
    if (inputGrupo && operacionesPersonalizadas.length === 0) {
      setTimeout(() => inputGrupo.focus(), 60);
    }
  } else {
    tabCustom?.classList.remove("active");
    tabRango?.classList.add("active");
    if (secCustom) secCustom.style.display = "none";
    if (secRango) secRango.style.display = "block";
  }
}

/**
 * Añade una multiplicación individual { a, b } desde los dos inputs numéricos
 */
function anadirOperacionIndividual() {
  const inputA = document.getElementById("customFactorA");
  const inputB = document.getElementById("customFactorB");
  if (!inputA || !inputB) return;

  const aVal = inputA.value.trim();
  const bVal = inputB.value.trim();

  if (aVal === "" || bVal === "") {
    mostrarAlertaCustom("Introduce ambos factores de la multiplicación (por ejemplo: 2 y 4).");
    if (aVal === "") inputA.focus();
    else inputB.focus();
    return;
  }

  const a = parseInt(aVal, 10);
  const b = parseInt(bVal, 10);

  if (isNaN(a) || isNaN(b) || a < 0 || b < 0) {
    mostrarAlertaCustom("Por favor, introduce números enteros positivos válidos.");
    return;
  }

  ocultarAlertaCustom();
  operacionesPersonalizadas.push({ a, b });
  inputA.value = "";
  inputB.value = "";
  renderChipsCustom();
  inputA.focus();
}

/**
 * Añade un lote o grupo de multiplicaciones a partir de un texto libre (ej: "2x4, 10x1 y 3x6")
 */
function anadirOperacionesGrupo() {
  const inputGrupo = document.getElementById("customGrupoInput");
  if (!inputGrupo) return;

  const texto = inputGrupo.value.trim();
  if (!texto) {
    mostrarAlertaCustom("Escribe las operaciones que quieras añadir (por ejemplo: 2x4, 10x1, 3x6).");
    inputGrupo.focus();
    return;
  }

  // Detecta multiplicaciones con conectores: x, X, *, ×, · o la palabra "por"
  const regex = /(\d+)\s*(?:[*xX×·]|por)\s*(\d+)/gi;
  let match;
  let totalAnadidas = 0;

  while ((match = regex.exec(texto)) !== null) {
    const a = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    if (!isNaN(a) && !isNaN(b)) {
      operacionesPersonalizadas.push({ a, b });
      totalAnadidas++;
    }
  }

  if (totalAnadidas === 0) {
    mostrarAlertaCustom("No se detectaron multiplicaciones válidas. Utiliza el formato número x número (por ejemplo: 2x4, 10x1, 3x6).");
    inputGrupo.focus();
    return;
  }

  ocultarAlertaCustom();
  inputGrupo.value = "";
  renderChipsCustom();
}

/**
 * Elimina una multiplicación de la lista personalizada por su índice
 */
function eliminarOperacionCustom(index) {
  if (index >= 0 && index < operacionesPersonalizadas.length) {
    operacionesPersonalizadas.splice(index, 1);
    renderChipsCustom();
  }
}

/**
 * Vacía completamente la lista de multiplicaciones personalizadas
 */
function vaciarOperacionesCustom() {
  operacionesPersonalizadas = [];
  ocultarAlertaCustom();
  renderChipsCustom();
}

/**
 * Muestra visualmente las multiplicaciones añadidas en forma de etiquetas / chips interactivos
 */
function renderChipsCustom() {
  const container = document.getElementById("listaOperacionesCustom");
  const badgeCount = document.getElementById("badgeCustomCount");
  const btnVaciar = document.getElementById("btnVaciarCustom");

  if (!container) return;

  const total = operacionesPersonalizadas.length;

  if (badgeCount) {
    badgeCount.innerHTML = `<i class="fa-solid fa-list-check"></i> <strong>${total}</strong> ${total === 1 ? "multiplicación añadida" : "multiplicaciones añadidas"}`;
  }

  if (btnVaciar) {
    btnVaciar.style.display = total > 0 ? "inline-flex" : "none";
  }

  if (total === 0) {
    container.innerHTML = `
      <div class="custom-chips-empty">
        <i class="fa-regular fa-clipboard"></i>
        <span>No has añadido operaciones todavía. Introduce algunas arriba para comenzar el reto.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  operacionesPersonalizadas.forEach((op, idx) => {
    const chip = document.createElement("span");
    chip.className = "op-chip";
    chip.innerHTML = `
      <span class="op-chip-text">${op.a} × ${op.b}</span>
      <button type="button" class="op-chip-del" title="Eliminar ${op.a} × ${op.b}" aria-label="Eliminar ${op.a} por ${op.b}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    chip.querySelector(".op-chip-del").addEventListener("click", () => {
      eliminarOperacionCustom(idx);
    });

    container.appendChild(chip);
  });
}

/**
 * Inicia la práctica con las operaciones personalizadas añadidas
 */
function iniciarPracticaCustom() {
  modoConfigActual = "personalizado";

  if (operacionesPersonalizadas.length === 0) {
    mostrarAlertaCustom("Por favor, añade al menos una multiplicación antes de comenzar (ej: 2x4, 10x1, 3x6).");
    const inputGrupo = document.getElementById("customGrupoInput");
    if (inputGrupo) inputGrupo.focus();
    return;
  }

  ocultarAlertaCustom();

  // Construir pool a partir de la lista
  ejerciciosPool = operacionesPersonalizadas.map((op) => ({
    a: op.a,
    b: op.b,
    resultado: op.a * op.b
  }));

  // Barajar si está activada la opción de orden aleatorio
  const checkAleatorio = document.getElementById("checkOrdenAleatorioCustom");
  if (checkAleatorio && checkAleatorio.checked) {
    for (let i = ejerciciosPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ejerciciosPool[i], ejerciciosPool[j]] = [ejerciciosPool[j], ejerciciosPool[i]];
    }
  }

  // Inicializar estado de estadísticas y ronda
  indiceActual = 0;
  aciertos = 0;
  errores = 0;
  haFalladoFilaActual = false;
  totalEjercicios = ejerciciosPool.length;

  // Iniciar cronómetro y estadísticas
  if (cronometroInterval) clearInterval(cronometroInterval);
  tiempoSegundos = 0;
  const statsSection = document.getElementById("statsSection");
  if (statsSection) statsSection.style.display = "flex";

  const cronoEl = document.getElementById("cronometroTiempo");
  if (cronoEl) cronoEl.textContent = "00:00";
  const aciertosEl = document.getElementById("contadorAciertos");
  if (aciertosEl) aciertosEl.textContent = "0";
  const erroresEl = document.getElementById("contadorErrores");
  if (erroresEl) erroresEl.textContent = "0";

  cronometroInterval = setInterval(() => {
    tiempoSegundos++;
    const crono = document.getElementById("cronometroTiempo");
    if (crono) crono.textContent = formatearTiempo(tiempoSegundos);
  }, 1000);

  // Limpiar contenedor de filas
  const container = document.getElementById("ejerciciosContainer");
  container.innerHTML = "";

  const mensajeFinal = document.getElementById("mensajeFinal");
  mensajeFinal.style.display = "none";

  // Mostrar área de juego y progreso
  document.getElementById("zonaPractica").style.display = "block";
  document.getElementById("progressSection").style.display = "block";

  actualizarProgreso();

  // Generar primera fila
  generarFila(indiceActual);
}

/**
 * Muestra mensaje de aviso o error en el panel de multiplicaciones personalizadas
 */
function mostrarAlertaCustom(msg) {
  const alerta = document.getElementById("alertaCustom");
  if (!alerta) return;
  alerta.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${msg}</span>`;
  alerta.style.display = "flex";
}

/**
 * Oculta el mensaje de aviso
 */
function ocultarAlertaCustom() {
  const alerta = document.getElementById("alertaCustom");
  if (alerta) alerta.style.display = "none";
}

// Exponer funciones globales necesarias
window.cambiarModoConfig = cambiarModoConfig;
window.eliminarOperacionCustom = eliminarOperacionCustom;

/**
 * Animación de confeti ligera con Canvas HTML5 sin librerías externas
 */
function lanzarConfeti() {
  let canvas = document.getElementById("confettiCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "confettiCanvas";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colores = ["#673ab7", "#e91e63", "#4caf50", "#ffeb3b", "#00bcd4", "#ff9800", "#9c27b0"];
  const particulas = [];
  const cantidad = 90;

  for (let i = 0; i < cantidad; i++) {
    particulas.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      color: colores[Math.floor(Math.random() * colores.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 6 - 3
    });
  }

  let frames = 0;
  const maxFrames = 200; // ~3.5 segundos de confeti

  function animar() {
    ctx.clearRect(0, 0, width, height);

    particulas.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    frames++;
    if (frames < maxFrames) {
      requestAnimationFrame(animar);
    } else {
      ctx.clearRect(0, 0, width, height);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  requestAnimationFrame(animar);
}


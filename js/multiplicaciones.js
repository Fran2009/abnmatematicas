// js/multiplicaciones.js

// Estado global de la práctica
let ejerciciosPool = [];
let indiceActual = 0;
let aciertos = 0;
let totalEjercicios = 0;

document.addEventListener("DOMContentLoaded", () => {
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

  // Permitir pulsar Enter en los inputs de configuración para comenzar
  const configInputs = document.querySelectorAll(".config-panel input");
  configInputs.forEach((inp) => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        iniciarPractica();
      }
    });
  });
});

/**
 * Inicia la práctica de multiplicaciones generando todas las combinaciones sin repetición
 */
function iniciarPractica() {
  const inputDesde = document.getElementById("tablaDesde");
  const inputHasta = document.getElementById("tablaHasta");
  const inputMultHasta = document.getElementById("multiplicarHasta");

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

  // Generar todas las combinaciones únicas
  ejerciciosPool = [];
  for (let tabla = desde; tabla <= hasta; tabla++) {
    for (let mult = 1; mult <= multHasta; mult++) {
      ejerciciosPool.push({
        a: tabla,
        b: mult,
        resultado: tabla * mult
      });
    }
  }

  // Barajar con algoritmo Fisher-Yates para garantizar aleatoriedad sin repetición
  for (let i = ejerciciosPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ejerciciosPool[i], ejerciciosPool[j]] = [ejerciciosPool[j], ejerciciosPool[i]];
  }

  // Inicializar estado
  indiceActual = 0;
  aciertos = 0;
  totalEjercicios = ejerciciosPool.length;

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

  // Si no es correcto, determinar si puede ser prefijo de un número mayor
  const esperadoStr = resultadoEsperado.toString();
  const esPrefijo = esperadoStr.startsWith(valorStr) && valorStr.length < esperadoStr.length;

  if (esPrefijo) {
    // Aún está escribiendo (ej: escribe '3' y la respuesta es '36'), mantenemos neutro
    marcarEstado(inputEl, null);
    iconEl.innerHTML = "";
  } else {
    // Si ya no puede ser correcto (longitud igual o mayor, o no coincide el prefijo)
    marcarEstado(inputEl, false);
    iconEl.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
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
  const mensajeFinal = document.getElementById("mensajeFinal");
  mensajeFinal.style.display = "block";
  mensajeFinal.scrollIntoView({ behavior: "smooth", block: "center" });

  lanzarConfeti();
}

/**
 * Reinicia la sesión de práctica
 */
function reiniciarPractica() {
  iniciarPractica();
}

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


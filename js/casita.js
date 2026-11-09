// casita.js

let numeroTejado = null;  // Número generado en el tejado
let columnsNeeded = [];   // Array de columnas a usar (por ejemplo, ["C", "D", "U"] para nivel 2)
let nextRowIndex = 1;     // Para generar filas dinámicamente

// Cronómetro y estadísticas de la Casita
let cronometroCasitaInterval = null;
let tiempoSegundosCasita = 0;
let aciertosCasita = 0;
let erroresCasita = 0;
let filasConFalloCifras = new Set();
let filasConFalloSuma = new Set();

function formatearTiempoCasita(segundos) {
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Función que genera el número y construye la casita
function generarNumero() {
  const nivel = parseInt(document.getElementById('nivel').value, 10);

  // Definir el rango según el nivel
  let min, max;
  switch (nivel) {
    case 1:
      min = 10; max = 99;
      break;
    case 2:
      min = 100; max = 999;
      break;
    case 3:
      min = 1000; max = 9999;
      break;
    case 4:
      min = 10000; max = 99999;
      break;
    case 5:
      min = 100000; max = 999999;
      break;
    default:
      min = 10; max = 99;
  }

  // Generar número aleatorio
  numeroTejado = Math.floor(Math.random() * (max - min + 1)) + min;

  // Construir la tabla (tejado, encabezados y la primera fila de inputs)
  construirTablaCasita(nivel, numeroTejado);

  // Mostrar la casita
  document.getElementById('casitaContainer').style.display = 'block';
}

// Construye la tabla de la casita (tejado y primera fila)
function construirTablaCasita(nivel, numero) {
  // Reiniciar tiempo y estadísticas de la casita
  if (cronometroCasitaInterval) clearInterval(cronometroCasitaInterval);
  tiempoSegundosCasita = 0;
  aciertosCasita = 0;
  erroresCasita = 0;
  filasConFalloCifras.clear();
  filasConFalloSuma.clear();

  const finalEl = document.getElementById("casitaMensajeFinal");
  if (finalEl) finalEl.style.display = "none";

  const statsSec = document.getElementById("statsSectionCasita");
  if (statsSec) statsSec.style.display = "flex";

  const cronoEl = document.getElementById("cronometroTiempoCasita");
  if (cronoEl) cronoEl.textContent = "00:00";
  const aciertosEl = document.getElementById("contadorAciertosCasita");
  if (aciertosEl) aciertosEl.textContent = "0";
  const erroresEl = document.getElementById("contadorErroresCasita");
  if (erroresEl) erroresEl.textContent = "0";

  cronometroCasitaInterval = setInterval(() => {
    tiempoSegundosCasita++;
    const crono = document.getElementById("cronometroTiempoCasita");
    if (crono) crono.textContent = formatearTiempoCasita(tiempoSegundosCasita);
  }, 1000);

  const casitaHead = document.getElementById('casitaHead');
  const casitaBody = document.getElementById('casitaBody');
  casitaHead.innerHTML = '';
  casitaBody.innerHTML = '';
  nextRowIndex = 1;

  // Todas las columnas disponibles, de izquierda a derecha
  const allColumns = [
    { key: 'CM', label: 'CM' },
    { key: 'DM', label: 'DM' },
    { key: 'UM', label: 'UM' },
    { key: 'C',  label: 'C'  },
    { key: 'D',  label: 'D'  },
    { key: 'U',  label: 'U'  }
  ];

  // Seleccionar columnas según el nivel:
  // Nivel 1: usar las últimas 2 (D, U)
  // Nivel 2: las últimas 3 (C, D, U)
  // Nivel 3: las últimas 4 (UM, C, D, U)
  // Nivel 4: las últimas 5 (DM, UM, C, D, U)
  // Nivel 5: todas (CM, DM, UM, C, D, U)
  switch (nivel) {
    case 1:
      columnsNeeded = allColumns.slice(-2);
      break;
    case 2:
      columnsNeeded = allColumns.slice(-3);
      break;
    case 3:
      columnsNeeded = allColumns.slice(-4);
      break;
    case 4:
      columnsNeeded = allColumns.slice(-5);
      break;
    case 5:
      columnsNeeded = allColumns.slice(-6);
      break;
    default:
      columnsNeeded = allColumns.slice(-2);
  }

  // 1) Fila del tejado (primera fila del thead)
  const roofRow = document.createElement('tr');
  const roofCell = document.createElement('th');
  roofCell.classList.add('roof-cell');
  // El tejado ocupa solo las columnas de cifras
  roofCell.colSpan = columnsNeeded.length;
  const roofDiv = document.createElement('div');
  roofDiv.classList.add('roof');
  const roofText = document.createElement('div');
  roofText.classList.add('roof-text');
  roofText.textContent = numero; // Número generado centrado
  roofDiv.appendChild(roofText);
  roofCell.appendChild(roofDiv);
  roofRow.appendChild(roofCell);

  // Celda vacía para la columna "Suma"
  const emptySumCell = document.createElement('th');
  roofRow.appendChild(emptySumCell);
  casitaHead.appendChild(roofRow);

  const roofCellWidth = roofCell.clientWidth;
  const newRoofHeight = Math.max(40, roofCellWidth * 0.2);
  // Establecemos la variable CSS --roof-height en el roofDiv:
  roofDiv.style.setProperty('--roof-height', newRoofHeight + "px");
  // También actualizamos la altura (por si el navegador no utiliza la variable)
  roofDiv.style.height = newRoofHeight + "px";

  // 2) Fila de encabezado: títulos de las columnas de cifras y "Suma"
  const headerRow = document.createElement('tr');
  columnsNeeded.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col.label;
    headerRow.appendChild(th);
  });
  const thSuma = document.createElement('th');
  thSuma.textContent = 'Suma';
  headerRow.appendChild(thSuma);
  casitaHead.appendChild(headerRow);

  // 3) Crear la primera fila de inputs
  addRow();
}

// Agrega una nueva fila para introducir la descomposición
// Ahora, la nueva fila se generará cuando se valide correctamente la columna U (es decir, cuando la descomposición sea correcta)
function addRow() {
  const casitaBody = document.getElementById('casitaBody');
  const rowIndex = nextRowIndex;
  const tr = document.createElement('tr');
  tr.id = 'fila_' + rowIndex;

  // Crear las celdas para cada columna de cifras
  columnsNeeded.forEach(() => {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'tel';
    // Cada input de cifras se valida al escribir (sin forzar error prematuro)
    input.addEventListener('input', () => validarFila(rowIndex, false));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        validarFila(rowIndex, true);
      }
    });
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '' && !input.disabled) {
        validarFila(rowIndex, true);
      }
    });
    td.appendChild(input);
    tr.appendChild(td);
  });

  // Crear la celda para "Suma" (este campo se validará pero no dispara nueva fila)
  const tdSuma = document.createElement('td');
  const inputSuma = document.createElement('input');
  inputSuma.type = 'tel';
  // Ajuste dinámico del ancho conforme se escribe, con un mínimo de 10ch
  inputSuma.style.width = "80px";
  inputSuma.addEventListener('input', function() {
    resizeInput(this);
    // Validar solo el contenido de "Suma" sin generar nueva fila
    validarSuma(rowIndex, false);
  });
  inputSuma.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      validarSuma(rowIndex, true);
    }
  });
  inputSuma.addEventListener('blur', function() {
    if (this.value.trim() !== '' && !this.disabled) {
      validarSuma(rowIndex, true);
    }
  });
  tdSuma.appendChild(inputSuma);
  tr.appendChild(tdSuma);

  casitaBody.appendChild(tr);
  nextRowIndex++;
}

// Función que ajusta el ancho del input en la columna "Suma" según su contenido,
// pero con un ancho mínimo establecido
function resizeInput(input) {
  const minCh = 10; // Ancho mínimo en unidades "ch"
  const newWidth = Math.max(input.value.length + 1, minCh);
  input.style.width = newWidth + "ch";
}

// Valida la fila con índice rowIndex en cuanto a la descomposición (columnas de cifras)
// Si es correcta, deshabilita las columnas de cifras y genera la nueva fila.
// Si aún no se han escrito todas las cifras necesarias (ej: escribe 1 de 17), se mantiene neutro.
function validarFila(rowIndex, forzar = false) {
  const fila = document.getElementById('fila_' + rowIndex);
  if (!fila) return;
  
  const inputs = fila.getElementsByTagName('input');
  const nDigits = columnsNeeded.length; // Número de inputs de cifras
  const digitInputs = Array.from(inputs).slice(0, nDigits);

  // Si falta algún valor en las columnas de cifras, no validamos
  if (digitInputs.some(inp => inp.value.trim() === '')) {
    digitInputs.forEach(inp => marcarEstado(inp, null));
    return;
  }

  // Calcular el valor ponderado
  let computedValue = 0;
  const totalDigits = digitInputs.length;
  for (let i = 0; i < totalDigits; i++) {
    const val = parseInt(digitInputs[i].value, 10);
    const multiplier = Math.pow(10, totalDigits - 1 - i);
    computedValue += val * multiplier;
  }

  // La descomposición es correcta si computedValue coincide con numeroTejado
  const decompositionCorrect = (computedValue === numeroTejado);

  if (decompositionCorrect) {
    digitInputs.forEach(inp => marcarEstado(inp, true));
    aciertosCasita++;
    const aciertosEl = document.getElementById("contadorAciertosCasita");
    if (aciertosEl) aciertosEl.textContent = aciertosCasita;
    filasConFalloCifras.delete(rowIndex);

    // Verificar si todas las columnas son 0 menos U (columna U es la última)
    const allZeroExceptU = digitInputs.slice(0, nDigits - 1).every(inp => parseInt(inp.value, 10) === 0);
    
    // Si la descomposición es correcta y todas las columnas son 0 (excepto U), no generamos nueva fila: ¡Casita completada!
    if (allZeroExceptU) {
      // Deshabilitar solo los inputs de cifras (no el de "Suma")
      for (let i = 0; i < totalDigits; i++) {
        digitInputs[i].disabled = true;
      }
      mostrarExitoCasita();
    } else {
      // Si la descomposición es correcta pero no todas las columnas son 0, generar nueva fila
      for (let i = 0; i < totalDigits; i++) {
        digitInputs[i].disabled = true;
      }
      addRow();
    }
    return;
  }

  // Si NO es correcto y NO se ha forzado comprobación, comprobar si alguna casilla aún no ha completado las cifras requeridas
  if (!forzar) {
    let algunaCasillaIncompleta = false;
    for (let k = 0; k < totalDigits; k++) {
      let sumOtros = 0;
      for (let j = 0; j < totalDigits; j++) {
        if (j !== k) {
          const valJ = parseInt(digitInputs[j].value, 10);
          const multJ = Math.pow(10, totalDigits - 1 - j);
          sumOtros += (isNaN(valJ) ? 0 : valJ) * multJ;
        }
      }
      const multK = Math.pow(10, totalDigits - 1 - k);
      const valRestante = numeroTejado - sumOtros;
      if (valRestante >= 0 && valRestante % multK === 0) {
        const neededVal = valRestante / multK;
        const cifrasNecesarias = String(neededVal).length;
        const cifrasActuales = digitInputs[k].value.trim().length;
        if (cifrasActuales < cifrasNecesarias) {
          algunaCasillaIncompleta = true;
          break;
        }
      }
    }

    if (algunaCasillaIncompleta) {
      // Todavía está tecleando las cifras que necesita: mantener estado neutro (sin rojo ni fallo)
      digitInputs.forEach(inp => marcarEstado(inp, null));
      return;
    }
  }

  // Ha completado la cantidad de cifras requerida o ha pulsado Enter / perdido foco, y es incorrecto
  digitInputs.forEach(inp => marcarEstado(inp, false));
  if (!filasConFalloCifras.has(rowIndex)) {
    erroresCasita++;
    filasConFalloCifras.add(rowIndex);
    const erroresEl = document.getElementById("contadorErroresCasita");
    if (erroresEl) erroresEl.textContent = erroresCasita;
  }
}

// Valida el contenido del input "Suma" en la fila (sin generar nueva fila)
function validarSuma(rowIndex, forzar = false) {
  const fila = document.getElementById('fila_' + rowIndex);
  if (!fila) return;
  const inputs = fila.getElementsByTagName('input');
  const nDigits = columnsNeeded.length;
  const digitInputs = Array.from(inputs).slice(0, nDigits);
  const sumaInput = inputs[nDigits];

  // Si falta algún valor en las columnas de cifras o en suma, no validamos
  if (digitInputs.some(inp => inp.value.trim() === '') || sumaInput.value.trim() === '') {
    marcarEstado(sumaInput, null);
    return;
  }

  // Construir la cadena esperada a partir de los valores de cifras
  let expectedParts = [];
  const totalDigits = digitInputs.length;
  for (let i = 0; i < totalDigits; i++) {
    const val = parseInt(digitInputs[i].value, 10);
    const multiplier = Math.pow(10, totalDigits - 1 - i);
    expectedParts.push(val * multiplier);
  }
  const expectedSumaString = expectedParts.join("+");
  const sumaVal = sumaInput.value.trim();

  // Validar que el contenido del input suma coincida con la cadena esperada
  const sumaCorrect = (sumaVal === expectedSumaString);

  if (sumaCorrect) {
    marcarEstado(sumaInput, true);
    aciertosCasita++;
    const aciertosEl = document.getElementById("contadorAciertosCasita");
    if (aciertosEl) aciertosEl.textContent = aciertosCasita;
    filasConFalloSuma.delete(rowIndex);
    actualizarResumenFinalCasitaSiVisible();
    return;
  }

  // Si aún no ha escrito todos los caracteres que requiere la suma y no se fuerza
  if (!forzar && sumaVal.length < expectedSumaString.length) {
    marcarEstado(sumaInput, null);
    return;
  }

  // Si ha alcanzado la longitud o se fuerza comprobación y es incorrecto
  marcarEstado(sumaInput, false);
  if (!filasConFalloSuma.has(rowIndex)) {
    erroresCasita++;
    filasConFalloSuma.add(rowIndex);
    const erroresEl = document.getElementById("contadorErroresCasita");
    if (erroresEl) erroresEl.textContent = erroresCasita;
    actualizarResumenFinalCasitaSiVisible();
  }
}

// Muestra el mensaje final de enhorabuena, detiene el cronómetro y lanza confeti
function mostrarExitoCasita() {
  if (cronometroCasitaInterval) {
    clearInterval(cronometroCasitaInterval);
    cronometroCasitaInterval = null;
  }

  const finalEl = document.getElementById("casitaMensajeFinal");
  const resumenEl = document.getElementById("casitaResumenFinal");

  if (resumenEl) {
    resumenEl.innerHTML = `¡Fantástico! Has completado todas las descomposiciones posibles del número <strong>${numeroTejado}</strong>.`;
  }

  actualizarResumenFinalCasitaSiVisible();

  if (finalEl) {
    finalEl.style.display = "block";
    finalEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  lanzarConfetiCasita();
}

// Mantiene sincronizado el resumen de estadísticas si el mensaje final ya está visible
function actualizarResumenFinalCasitaSiVisible() {
  const finalEl = document.getElementById("casitaMensajeFinal");
  const statsEl = document.getElementById("casitaStatsResumen");
  if (!finalEl || finalEl.style.display === "none" || !statsEl) return;

  statsEl.innerHTML = `
    <span><i class="fa-solid fa-stopwatch" style="color:#673ab7;"></i> Tiempo: <strong>${formatearTiempoCasita(tiempoSegundosCasita)}</strong></span>
    <span><i class="fa-solid fa-circle-check" style="color:#2e7d32;"></i> Aciertos: <strong>${aciertosCasita}</strong></span>
    <span><i class="fa-solid fa-circle-xmark" style="color:#c62828;"></i> Errores: <strong>${erroresCasita}</strong></span>
  `;
}

// Animación festiva de confeti en la Casita
function lanzarConfetiCasita() {
  let canvas = document.getElementById("confettiCanvasCasita");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "confettiCanvasCasita";
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colores = ["#673ab7", "#ab47bc", "#4caf50", "#ff7043", "#ffb300", "#29b6f6"];
  const particulas = Array.from({ length: 80 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: Math.random() * 9 + 5,
    color: colores[Math.floor(Math.random() * colores.length)],
    speedY: Math.random() * 3.2 + 2.2,
    speedX: Math.random() * 2 - 1,
    rotation: Math.random() * 360,
    rotationSpeed: Math.random() * 6 - 3
  }));

  let frames = 0;
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
    if (frames < 170) {
      requestAnimationFrame(animar);
    } else if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }
  requestAnimationFrame(animar);
}

// Deshabilita todos los inputs de las columnas de cifras en la fila (no la columna "Suma")
function disableRow(rowIndex) {
  const fila = document.getElementById('fila_' + rowIndex);
  if (!fila) return;
  const inputs = fila.getElementsByTagName('input');
  const nDigits = columnsNeeded.length;
  for (let i = 0; i < nDigits; i++) {
    inputs[i].disabled = true;
  }
  // Nota: No deshabilitamos el input "Suma", para permitir seguir editándolo y validándolo.
}

// Marca el estado de un input: verde (correcto), rojo (incorrecto) o sin marcar (null)
function marcarEstado(element, estado) {
  if (estado === true) {
    element.classList.add('correcto');
    element.classList.remove('incorrecto');
  } else if (estado === false) {
    element.classList.add('incorrecto');
    element.classList.remove('correcto');
  } else {
    element.classList.remove('correcto');
    element.classList.remove('incorrecto');
  }
}

// --- FUNCIONES PARA NÚMERO PERSONALIZADO ---
function mostrarInputPersonalizado() {
  const container = document.getElementById('customInputContainer');
  if (container.style.display === 'none' || container.style.display === '') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
}

function generarNumeroPersonalizado() {
  const inputEl = document.getElementById('numeroPersonalizado');
  const numStr = inputEl.value;
  const num = parseInt(numStr, 10);
  
  if (isNaN(num) || num < 10) {
    alert("Por favor, introduce un número válido mayor o igual a 10.");
    return;
  }
  
  numeroTejado = num;
  
  // Determinar el nivel según la longitud del número
  let nivelCalculado = 1;
  const len = numStr.length;
  if (len === 2) nivelCalculado = 1;
  else if (len === 3) nivelCalculado = 2;
  else if (len === 4) nivelCalculado = 3;
  else if (len === 5) nivelCalculado = 4;
  else if (len >= 6) nivelCalculado = 5;
  
  construirTablaCasita(nivelCalculado, numeroTejado);
  document.getElementById('casitaContainer').style.display = 'block';
  
  // Ocultar el input personalizado después de generar
  document.getElementById('customInputContainer').style.display = 'none';
}

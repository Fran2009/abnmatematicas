// casita.js

let numeroTejado = null;  // Número generado en el tejado
let columnsNeeded = [];   // Array de columnas a usar (por ejemplo, ["C", "D", "U"] para nivel 2)
let nextRowIndex = 1;     // Para generar filas dinámicamente

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
    // Cada input de cifras se valida al cambiar
    input.addEventListener('input', () => validarFila(rowIndex));
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
    validarSuma(rowIndex);
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
// La validación de la columna "Suma" se realiza de forma separada (ver función validarSuma)
// Valida la fila con índice rowIndex en cuanto a la descomposición (columnas de cifras)
// Si es correcta, deshabilita las columnas de cifras y genera la nueva fila.
// La validación de la columna "Suma" se realiza de forma separada (ver función validarSuma)
function validarFila(rowIndex) {
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

  // Marcar cada input de cifras según el estado
  digitInputs.forEach(inp => {
    marcarEstado(inp, decompositionCorrect);
  });

  // Verificar si todas las columnas son 0 menos U (columna U es la última)
  const allZeroExceptU = digitInputs.slice(0, nDigits - 1).every(inp => parseInt(inp.value, 10) === 0);
  
  // Si la descomposición es correcta y todas las columnas son 0 (excepto U), no generamos nueva fila
  if (decompositionCorrect && allZeroExceptU) {
    // Deshabilitar solo los inputs de cifras (no el de "Suma")
    for (let i = 0; i < totalDigits; i++) {
      digitInputs[i].disabled = true;
    }
  } else if (decompositionCorrect) {
    // Si la descomposición es correcta pero no todas las columnas son 0, generar nueva fila
    for (let i = 0; i < totalDigits; i++) {
      digitInputs[i].disabled = true;
    }
    // Generar nueva fila
    addRow();
  }
}


// Valida el contenido del input "Suma" en la fila (sin generar nueva fila)
function validarSuma(rowIndex) {
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

  // Validar que el contenido del input suma coincida con la cadena esperada
  const sumaCorrect = (sumaInput.value.trim() === expectedSumaString);
  marcarEstado(sumaInput, sumaCorrect);
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

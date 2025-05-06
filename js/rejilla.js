// rejilla.js

// Variables globales para almacenar los números y los resultados intermedios
let bigNumber, smallNumber;
let currentOperation;
// Tcalc y Rcalc almacenan el total y el resto validados de la fila anterior.
let Tcalc = [];
let Rcalc = [];
// nextRowIndex nos indica el índice de la siguiente fila a crear.
let nextRowIndex = 1;

// Inicia el ejercicio: genera la operación y crea la tabla
function iniciarEjercicio() {
  const nivel = document.getElementById('nivel').value;
  currentOperation = document.getElementById('operacion').value;
  
  let maxNumber;
  switch(nivel) {
    case "1": maxNumber = 50; break;
    case "2": maxNumber = 100; break;
    case "3": maxNumber = 500; break;
    case "4": maxNumber = 1000; break;
    default: maxNumber = 20;
  }
  
  // Generar dos números aleatorios en el rango [0, maxNumber]
  let n1 = Math.floor(Math.random() * (maxNumber + 1));
  let n2 = Math.floor(Math.random() * (maxNumber + 1));
  // Forzar que el mayor sea el número principal (bigNumber)
  if (n2 > n1) { [n1, n2] = [n2, n1]; }
  bigNumber = n1;
  smallNumber = n2;
  
  // Inicializar los valores previos
  Tcalc = [bigNumber];
  Rcalc = [smallNumber];
  nextRowIndex = 1;
  
  // Construir la estructura de la tabla con encabezado personalizado:
  // La columna central muestra el número mayor y la derecha el número menor.
  let html = `
    <p><strong>Ejercicio:</strong> ${bigNumber} ${currentOperation === 'suma' ? '+' : '-'} ${smallNumber}</p>
    <table id="abnTable">
      <thead>
        <tr>
          <th>Cantidad a descomponer</th>
          <th id="thBigNumber">${bigNumber}</th>
          <th id="thSmallNumber">${smallNumber}</th>
        </tr>
      </thead>
      <tbody id="tablaBody">
      </tbody>
    </table>
    <p id="mensajeFinal"></p>
  `;
  document.getElementById('ejercicio').innerHTML = html;
  
  // Agregar la primera fila
  agregarFila();
}

// Agrega una nueva fila a la tabla
function agregarFila() {
  const tbody = document.getElementById('tablaBody');
  const rowIndex = nextRowIndex;
  const tr = document.createElement('tr');
  tr.setAttribute('id', 'fila_' + rowIndex);
  
  // Columna 1: Cantidad a descomponer (con símbolo)
  let td1 = document.createElement('td');
  // Agregar el símbolo antes del input
  let spanSimbolo = document.createElement('span');
  spanSimbolo.className = 'operacionSimbolo';
  spanSimbolo.textContent = currentOperation === 'suma' ? '+' : '-';
  td1.appendChild(spanSimbolo);
  
  let inputPartial = document.createElement('input');
  inputPartial.type = 'tel';
  inputPartial.id = 'partial_' + rowIndex;
  inputPartial.style.width = "80px";
  inputPartial.oninput = function() { validarFila(rowIndex); };
  td1.appendChild(inputPartial);
  
  // Columna 2: Número mayor (resultado acumulado)
  let td2 = document.createElement('td');
  let inputTotal = document.createElement('input');
  inputTotal.type = 'tel';
  inputTotal.id = 'total_' + rowIndex;
  inputTotal.style.width = "80px";
  inputTotal.oninput = function() { validarFila(rowIndex); };
  td2.appendChild(inputTotal);
  
  // Columna 3: Número menor (resto)
  let td3 = document.createElement('td');
  let inputRemainder = document.createElement('input');
  inputRemainder.type = 'tel';
  inputRemainder.id = 'remainder_' + rowIndex;
  inputRemainder.style.width = "80px";
  inputRemainder.oninput = function() { validarFila(rowIndex); };
  td3.appendChild(inputRemainder);
  
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  
  tbody.appendChild(tr);
  nextRowIndex++;
}

// Función para deshabilitar los inputs de una fila ya validada
function disableRow(rowIndex) {
  const row = document.getElementById('fila_' + rowIndex);
  if (row) {
    const inputs = row.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }
}

// Valida la fila con índice rowIndex
function validarFila(rowIndex) {
  const partialInput = document.getElementById('partial_' + rowIndex);
  const totalInput = document.getElementById('total_' + rowIndex);
  const remainderInput = document.getElementById('remainder_' + rowIndex);
  
  const partialVal = parseInt(partialInput.value, 10);
  const totalVal = parseInt(totalInput.value, 10);
  const remainderVal = parseInt(remainderInput.value, 10);
  
  // Valores previos de la fila anterior (o iniciales para la fila 1)
  const prevTotal = Tcalc[rowIndex - 1];
  const prevRemainder = Rcalc[rowIndex - 1];
  
  // Si algún campo está vacío, no se valida
  if (isNaN(partialVal) || isNaN(totalVal) || isNaN(remainderVal)) {
    marcarEstado(partialInput, null);
    marcarEstado(totalInput, null);
    marcarEstado(remainderInput, null);
    return;
  }
  
  // La cantidad a descomponer no debe superar el resto previo
  if (partialVal > prevRemainder) {
    marcarEstado(partialInput, false);
    return;
  }
  
  let expectedTotal, expectedRemainder;
  if (currentOperation === 'suma') {
    expectedTotal = prevTotal + partialVal;
    expectedRemainder = prevRemainder - partialVal;
  } else {
    expectedTotal = prevTotal - partialVal;
    expectedRemainder = prevRemainder - partialVal;
  }
  
  const totalCorrect = (totalVal === expectedTotal);
  const remainderCorrect = (remainderVal === expectedRemainder);
  
  // Se marca el estado de cada campo
  marcarEstado(partialInput, true);
  marcarEstado(totalInput, totalCorrect);
  marcarEstado(remainderInput, remainderCorrect);
  
  // Si se han validado correctamente, se actualizan los valores para esta fila
  if (totalCorrect && remainderCorrect) {
    Tcalc[rowIndex] = totalVal;
    Rcalc[rowIndex] = remainderVal;
    
    // Deshabilitar la fila ya validada para que no se pueda editar
    disableRow(rowIndex);
    
    // Si el resto no es 0 y no existe ya una siguiente fila, se añade automáticamente una nueva fila
    if (remainderVal !== 0) {
      if (!document.getElementById('fila_' + nextRowIndex)) {
        agregarFila();
      }
    } else {
      document.getElementById('mensajeFinal').textContent = '¡Operación completada! Resultado final: ' + totalVal;
    }
  }
}

// Función auxiliar para marcar el estado (correcto/incorrecto) de un input
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

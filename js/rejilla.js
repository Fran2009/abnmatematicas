// rejilla.js

// Variables globales para almacenar los números y los resultados intermedios
let bigNumber, smallNumber, thirdNumber;
let currentOperation;
// Tcalc, Rcalc y R2calc almacenan el total y el resto validados de la fila anterior.
let Tcalc = [];
let Rcalc = [];
let R2calc = [];
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
    case "5": maxNumber = 5000; break;
    case "6": maxNumber = 10000; break;
    default: maxNumber = 20;
  }
  
  // Generar números aleatorios
  let n1 = Math.floor(Math.random() * (maxNumber + 1));
  let n2 = Math.floor(Math.random() * (maxNumber + 1));
  let n3;
  
  const isTriple = (currentOperation === 'doblesuma' || currentOperation === 'dobleresta' || currentOperation === 'sumiresta');
  
  if (isTriple) {
    n3 = Math.floor(Math.random() * (maxNumber + 1));
    // Forzar que el primer número sea suficientemente grande para restas
    if (currentOperation === 'dobleresta' || currentOperation === 'sumiresta') {
       let tempArray = [n1, n2, n3].sort((a,b) => b-a);
       n1 = tempArray[0]; // El mayor
       n2 = tempArray[1];
       n3 = tempArray[2];
       if (currentOperation === 'dobleresta' && n1 < (n2 + n3)) {
         n1 = n2 + n3 + Math.floor(Math.random() * 20); // Aseguramos no negativos
       }
    }
  } else {
    // Forzar que el mayor sea el número principal (bigNumber) para resta normal
    if (n2 > n1) { [n1, n2] = [n2, n1]; }
  }

  bigNumber = n1;
  smallNumber = n2;
  if (isTriple) { thirdNumber = n3; }
  
  // Inicializar los valores previos
  Tcalc = [bigNumber];
  Rcalc = [smallNumber];
  if (isTriple) { R2calc = [thirdNumber]; }
  nextRowIndex = 1;
  
  let opSim1 = (currentOperation === 'suma' || currentOperation === 'doblesuma' || currentOperation === 'sumiresta') ? '+' : '-';
  let opSim2 = (currentOperation === 'doblesuma') ? '+' : '-'; // para sumiresta el 3ro es resta
  
  let ejText = `<strong>Ejercicio:</strong> ${bigNumber} ${opSim1} ${smallNumber}`;
  if (isTriple) ejText += ` ${opSim2} ${thirdNumber}`;

  let html = `
    <p>${ejText}</p>
    <table id="abnTable">
      <thead>
        <tr>
          <th>Cantidad a descomponer</th>
          <th id="thBigNumber">${bigNumber}</th>
          <th id="thSmallNumber">${smallNumber}</th>
          ${isTriple ? `<th id="thThirdNumber">${thirdNumber}</th>` : ''}
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
  
  const isTriple = (currentOperation === 'doblesuma' || currentOperation === 'dobleresta' || currentOperation === 'sumiresta');

  // Columna 1: Cantidad a descomponer (con símbolo)
  let td1 = document.createElement('td');
  let spanSimbolo = document.createElement('span');
  spanSimbolo.className = 'operacionSimbolo';
  
  let currentSymbol = (currentOperation === 'suma' || currentOperation === 'doblesuma') ? '+' : '-';
  if (currentOperation === 'sumiresta') {
    // Si ya terminamos de sumar (el resto Rcalc de la fila anterior es 0), el símbolo pasa a ser '-'.
    if (rowIndex > 1 && Rcalc[rowIndex - 1] === 0) {
      currentSymbol = '-';
    } else {
      currentSymbol = '+';
    }
  }
  spanSimbolo.textContent = currentSymbol;
  
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

  // Columna 4: Tercer número (resto 2) si es operación triple
  if (isTriple) {
    let td4 = document.createElement('td');
    let inputRemainder2 = document.createElement('input');
    inputRemainder2.type = 'tel';
    inputRemainder2.id = 'remainder2_' + rowIndex;
    inputRemainder2.style.width = "80px";
    inputRemainder2.oninput = function() { validarFila(rowIndex); };
    td4.appendChild(inputRemainder2);
    tr.appendChild(td4);
  }
  
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
  const isTriple = (currentOperation === 'doblesuma' || currentOperation === 'dobleresta' || currentOperation === 'sumiresta');

  const partialInput = document.getElementById('partial_' + rowIndex);
  const totalInput = document.getElementById('total_' + rowIndex);
  const remainderInput = document.getElementById('remainder_' + rowIndex);
  let remainder2Input = null;
  if (isTriple) remainder2Input = document.getElementById('remainder2_' + rowIndex);

  const partialVal = parseInt(partialInput.value, 10);
  const totalVal = parseInt(totalInput.value, 10);
  const remainderVal = parseInt(remainderInput.value, 10);
  let remainder2Val = null;
  if (isTriple) remainder2Val = parseInt(remainder2Input.value, 10);

  // Valores previos
  const prevTotal = Tcalc[rowIndex - 1];
  const prevRemainder = Rcalc[rowIndex - 1];
  let prevRemainder2 = null;
  if (isTriple) prevRemainder2 = R2calc[rowIndex - 1];
  
  // Condición de campos vacíos
  if (isNaN(partialVal) || isNaN(totalVal) || isNaN(remainderVal) || (isTriple && isNaN(remainder2Val))) {
    marcarEstado(partialInput, null);
    marcarEstado(totalInput, null);
    marcarEstado(remainderInput, null);
    if (isTriple) marcarEstado(remainder2Input, null);
    return;
  }
  
  let totalCorrect = false;
  let remainderCorrect = false;
  let remainder2Correct = false;
  let partialCorrect = true; // Por defecto asumimos que la cantidad a usar es válida matemáticamente
  
  // Lógica por operación
  if (currentOperation === 'suma') {
    if (partialVal > prevRemainder) partialCorrect = false;
    totalCorrect = (totalVal === prevTotal + partialVal);
    remainderCorrect = (remainderVal === prevRemainder - partialVal);
  } 
  else if (currentOperation === 'resta') {
    if (partialVal > prevRemainder) partialCorrect = false;
    totalCorrect = (totalVal === prevTotal - partialVal);
    remainderCorrect = (remainderVal === prevRemainder - partialVal);
  }
  else if (currentOperation === 'doblesuma') {
    // La suma de lo que quitamos de R1 y R2 debe ser partialVal
    const diffR1 = prevRemainder - remainderVal;
    const diffR2 = prevRemainder2 - remainder2Val;
    
    // No podemos restar más de lo que hay
    if (diffR1 < 0 || diffR2 < 0) remainderCorrect = false;
    
    totalCorrect = (totalVal === prevTotal + partialVal);
    
    if (diffR1 >= 0 && diffR2 >= 0 && (diffR1 + diffR2 === partialVal)) {
        remainderCorrect = true;
        remainder2Correct = true;
    }
  }
  else if (currentOperation === 'dobleresta') {
    // La suma de lo que quitamos de R1 y R2 debe ser partialVal
    const diffR1 = prevRemainder - remainderVal;
    const diffR2 = prevRemainder2 - remainder2Val;
    
    if (diffR1 < 0 || diffR2 < 0) remainderCorrect = false;
    
    totalCorrect = (totalVal === prevTotal - partialVal);
    
    if (diffR1 >= 0 && diffR2 >= 0 && (diffR1 + diffR2 === partialVal)) {
        remainderCorrect = true;
        remainder2Correct = true;
    }
  }
  else if (currentOperation === 'sumiresta') {
    // Invariante: T + R1 - R2 debe ser igual al invariante inicial (T0 + R1_0 - R2_0)
    // En sumiresta, primero se opera la suma (hasta que R1 llegue a 0) y luego la resta (hasta que R2 llegue a 0).
    
    // Movimiento 1: Paso cantidad de R1 a Total
    const diffR1 = prevRemainder - remainderVal; // Lo que quito de R1
    
    // Movimiento 2: Quito cantidad de Total y de R2 (resto a ambos)
    const diffR2 = prevRemainder2 - remainder2Val; // Lo que quito de R2
    
    // Validación de la triada de resultados:
    const mathTotalCorrect = (totalVal === prevTotal + diffR1 - diffR2);
    
    // Forzar que primero se termine de sumar (es decir, diffR2 debe ser 0)
    // mientras haya resto en la suma (R1). Solo permitimos tocar R2 si R1 ya es 0 (prevRemainder === 0)
    if (prevRemainder > 0 && diffR2 !== 0) {
      mathTotalCorrect = false; // Intento de restar antes de terminar la suma
    }
    
    if (mathTotalCorrect) {
       totalCorrect = true;
       // Validar que no se quita más de lo que hay
       if (diffR1 >= 0 && diffR2 >= 0) {
          remainderCorrect = true;
          remainder2Correct = true;
       }
    } else {
       totalCorrect = false;
       remainderCorrect = false;
       remainder2Correct = false;
    }
  }
  
  marcarEstado(partialInput, partialCorrect);
  marcarEstado(totalInput, totalCorrect);
  marcarEstado(remainderInput, remainderCorrect);
  if (isTriple) marcarEstado(remainder2Input, remainder2Correct);
  
  // Si todo es correcto
  let allCorrect = partialCorrect && totalCorrect && remainderCorrect;
  if (isTriple) allCorrect = allCorrect && remainder2Correct;

  if (allCorrect) {
    Tcalc[rowIndex] = totalVal;
    Rcalc[rowIndex] = remainderVal;
    if (isTriple) R2calc[rowIndex] = remainder2Val;
    
    disableRow(rowIndex);
    
    // Condición de finalización
    let finished = false;
    if (currentOperation === 'suma' || currentOperation === 'resta') {
      finished = (remainderVal === 0);
    } else if (currentOperation === 'doblesuma' || currentOperation === 'dobleresta') {
      finished = (remainderVal === 0 && remainder2Val === 0);
    } else if (currentOperation === 'sumiresta') {
      finished = (remainderVal === 0 && remainder2Val === 0);
    }
    
    if (!finished) {
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

// --- FUNCIONES PARA NÚMEROS PERSONALIZADOS ---
function mostrarInputPersonalizadoRejilla() {
  const container = document.getElementById('customInputContainerRejilla');
  if (container.style.display === 'none' || container.style.display === '') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
}

function toggleTercerNumeroPersonalizado() {
  const op = document.getElementById('operacion').value;
  const isTriple = (op === 'doblesuma' || op === 'dobleresta' || op === 'sumiresta');
  const contenedorNum3 = document.getElementById('contenedorNum3');
  
  if (contenedorNum3) {
    if (isTriple) {
      contenedorNum3.style.display = 'inline-block';
    } else {
      contenedorNum3.style.display = 'none';
    }
  }
}

function iniciarEjercicioPersonalizado() {
  const op = document.getElementById('operacion').value;
  const isTriple = (op === 'doblesuma' || op === 'dobleresta' || op === 'sumiresta');
  
  const num1Str = document.getElementById('num1Personalizado').value;
  const num2Str = document.getElementById('num2Personalizado').value;
  let num3Str = null;
  if (isTriple) {
     num3Str = document.getElementById('num3Personalizado').value;
  }
  
  let n1 = parseInt(num1Str, 10);
  let n2 = parseInt(num2Str, 10);
  let n3;
  if (isTriple) n3 = parseInt(num3Str, 10);
  
  if (isNaN(n1) || isNaN(n2) || (isTriple && isNaN(n3))) {
    alert("Por favor, introduce números válidos.");
    return;
  }
  
  currentOperation = op;
  
  // Para suma/resta simple: n1 es el mayor
  if (!isTriple) {
    let max = Math.max(n1, n2);
    let min = Math.min(n1, n2);
    bigNumber = max;
    smallNumber = min;
  } else {
    // Para operaciones dobles, dejamos que el usuario establezca el orden,
    // pero advirtiendo si va a dar negativo en resta
    if ((op === 'dobleresta' || op === 'sumiresta') && n1 < (n2 + n3) && op === 'dobleresta') {
       alert("En la doble resta, asegúrate de que el primer número sea mayor que la suma de los otros dos para no tener resultados negativos.");
       return;
    }
    bigNumber = n1;
    smallNumber = n2;
    thirdNumber = n3;
  }
  
  // Inicializar los valores previos
  Tcalc = [bigNumber];
  Rcalc = [smallNumber];
  if (isTriple) R2calc = [thirdNumber];
  nextRowIndex = 1;

  let opSim1 = (currentOperation === 'suma' || currentOperation === 'doblesuma' || currentOperation === 'sumiresta') ? '+' : '-';
  let opSim2 = (currentOperation === 'doblesuma') ? '+' : '-'; // para sumiresta el 3ro es resta
  
  let ejText = `<strong>Ejercicio:</strong> ${bigNumber} ${opSim1} ${smallNumber}`;
  if (isTriple) ejText += ` ${opSim2} ${thirdNumber}`;
  
  // Construir la estructura de la tabla
  let html = `
    <p>${ejText}</p>
    <table id="abnTable">
      <thead>
        <tr>
          <th>Cantidad a descomponer</th>
          <th id="thBigNumber">${bigNumber}</th>
          <th id="thSmallNumber">${smallNumber}</th>
          ${isTriple ? `<th id="thThirdNumber">${thirdNumber}</th>` : ''}
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
  
  // Ocultar el contenedor después de generar
  document.getElementById('customInputContainerRejilla').style.display = 'none';
}

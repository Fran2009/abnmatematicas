// numeracion.js

// Variables globales para almacenar la operación y los números generados
let operand1 = null;
let operand2 = null;
let correctResult = null;
let currentOperation = null;
let resultadoObtenido = false;  // Flag que indica si ya se acertó el resultado

// Función para formatear el número en HTML: 
// Si el número tiene más de un dígito, separa la parte de las decenas (o centenas, etc.) y la unidad.
function formatNumber(n) {
  const str = n.toString();
  if (str.length === 1) {
    // Número de un dígito: lo consideramos como la unidad
    return `<span class="digit-ones">${str}</span>`;
  } else {
    const tens = str.slice(0, -1); // Todo excepto el último dígito
    const ones = str.slice(-1);    // Último dígito
    return `<span class="digit-tens">${tens}</span><span class="digit-ones">${ones}</span>`;
  }
}

// Genera el cuadrado (grid) con números del 1 al 100
function generateGrid() {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = ''; // Limpiar si ya existe
  for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    cell.id = 'cell-' + i;
    // En lugar de textContent, usamos innerHTML para aplicar el formato
    cell.innerHTML = formatNumber(i);
    // Agregar listener para click
    cell.addEventListener('click', () => cellClicked(i, cell));
    gridContainer.appendChild(cell);
  }
}

// Función que se ejecuta al hacer click en una celda
function cellClicked(cellNumber, cellElement) {
  // Si el resultado ya fue obtenido, no se produce parpadeo
  if (resultadoObtenido) return;
  // Si aún no se han generado números, no se hace nada
  if (correctResult === null) return;

  if (cellNumber === correctResult) {
    // Celda correcta: marcar en verde y mostrar mensaje
    cellElement.classList.add('correct-answer');
    document.getElementById('mensaje').textContent =
      '¡Correcto! ' + operand1 + (currentOperation === 'suma' ? ' + ' : ' - ') + operand2 + ' = ' + correctResult;
    resultadoObtenido = true;
  } else {
    // Celda incorrecta: parpadeo único, más lento (2s)
    cellElement.classList.add('error-blink');
    setTimeout(() => {
      cellElement.classList.remove('error-blink');
    }, 2000);
  }
}

// Función para generar los dos números aleatorios según la operación
function generarNumeros() {
  const operacionSelect = document.getElementById('operacion');
  currentOperation = operacionSelect.value;
  let n1, n2, result;

  if (currentOperation === 'suma') {
    // Para suma: generar dos números y asegurar que la suma <= 100.
    n1 = getRandomInt(1, 99);
    n2 = getRandomInt(1, 100 - n1);
    // Asegurarse de que el mayor esté a la izquierda:
    operand1 = Math.max(n1, n2);
    operand2 = Math.min(n1, n2);
    result = operand1 + operand2;
  } else {
    // Para resta: n1 entre 1 y 100, n2 entre 1 y n1 para que n1 - n2 >= 0.
    do {
        let n1 = getRandomInt(1, 100);
        let n2 = getRandomInt(1, n1);
        operand1 = n1;
        operand2 = n2;
        result = n1 - n2;
    } while (result === 0);
  }

  correctResult = result;
  resultadoObtenido = false; // Reiniciar flag

  // Limpiar cualquier marca anterior en el grid
  clearGridHighlights();

  // Marcar en naranja los cuadrados correspondientes a los operandos
  const cell1 = document.getElementById('cell-' + operand1);
  const cell2 = document.getElementById('cell-' + operand2);
  if (cell1) cell1.classList.add('selected-operand');
  if (cell2) cell2.classList.add('selected-operand');

  // Actualizar mensaje para indicar la operación a resolver
  document.getElementById('mensaje').textContent =
    'Encuentra el resultado: ' + (currentOperation === 'suma' ? (operand1 + ' + ' + operand2) : (operand1 + ' - ' + operand2));
}

// Función para obtener un entero aleatorio entre min y max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para quitar las marcas de todos los cuadrados
function clearGridHighlights() {
  const cells = document.getElementsByClassName('grid-cell');
  for (let cell of cells) {
    cell.classList.remove('selected-operand');
    cell.classList.remove('correct-answer');
    cell.classList.remove('error-blink');
  }
  document.getElementById('mensaje').textContent = '';
}

// Al cargar la página se genera el grid y se asigna el evento al botón
window.addEventListener('load', () => {
  generateGrid();
  const generarBtn = document.getElementById('generarBtn');
  generarBtn.addEventListener('click', () => {
    correctResult = null;
    clearGridHighlights();
    generarNumeros();
  });
});

// js/rejilla.js - Lógica completa de la Rejilla ABN (Básicas, Escaleras, Igualación, Comparación y Triples)

let bigNumber, smallNumber, thirdNumber;
let currentOperation = "suma";
let currentIgualacionMode = "asc"; // 'asc' (subir del menor al mayor) o 'desc' (bajar del mayor al menor)

// Arrays de estado validado por fila (índice 0 = estado inicial en la cabecera)
let Tcalc = [];
let Rcalc = [];
let R2calc = [];
let nextRowIndex = 1;

// Diccionario de guías didácticas y ejemplos visuales para niños
const OPERATION_GUIDES = {
  suma: {
    badge: "Básica · 2 Números",
    title: "Suma en Rejilla (+)",
    desc: "Pasamos partes del <strong>segundo número</strong> al <strong>primero</strong> poco a poco. Terminamos cuando el segundo número se queda en <strong>0</strong>.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: <strong>34 + 25</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Paso (+)</th><th>34 (Sube ⬆️)</th><th>25 (Baja ⬇️)</th></tr>
        </thead>
        <tbody>
          <tr><td>+ 20</td><td>54</td><td>5</td></tr>
          <tr><td>+ 5</td><td class="cell-win">59 ✨</td><td class="cell-zero">0</td></tr>
        </tbody>
      </table>
      <p class="mini-note">1º Pasamos 20 (34+20=54 y quedan 5). 2º Pasamos los 5 que faltan (54+5=59 y quedan 0).</p>
    `
  },
  resta: {
    badge: "Básica · 2 Números",
    title: "Resta por Detracción (-)",
    desc: "Vamos quitando partes del <strong>segundo número</strong> a los dos lados a la vez hasta que en la última columna quede un <strong>0</strong>.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: <strong>58 - 24</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Quito (-)</th><th>58 (Me quedan ⬇️)</th><th>24 (Por quitar ⬇️)</th></tr>
        </thead>
        <tbody>
          <tr><td>- 20</td><td>38</td><td>4</td></tr>
          <tr><td>- 4</td><td class="cell-win">34 ✨</td><td class="cell-zero">0</td></tr>
        </tbody>
      </table>
      <p class="mini-note">1º Quitamos 20 a ambos (quedan 38 y 4). 2º Quitamos 4 a ambos (quedan 34 y 0).</p>
    `
  },
  escalera_asc: {
    badge: "Escalera ABN · Subir",
    title: "Escalera Ascendente (Subir del menor al mayor)",
    desc: "Empezamos en el <strong>número menor</strong> y vamos dando saltos hacia arriba (<strong>+</strong>) hasta llegar al <strong>número mayor</strong>. En la columna del medio vamos sumando los saltos para saber la diferencia.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: De <strong>26</strong> subir hasta <strong>50</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Salto (+)</th><th>Total subido (0 ⬆️)</th><th>Escalón (26 ➡️ 50)</th></tr>
        </thead>
        <tbody>
          <tr><td>+ 4</td><td>4</td><td>30</td></tr>
          <tr><td>+ 20</td><td class="cell-win">24 ✨</td><td class="cell-zero">50 (¡Meta!)</td></tr>
        </tbody>
      </table>
      <p class="mini-note">De 26 subimos +4 (llegamos al 30, llevamos 4). De 30 subimos +20 (llegamos a la meta 50, total subido: 24).</p>
    `
  },
  escalera_desc: {
    badge: "Escalera ABN · Bajar",
    title: "Escalera Descendente (Bajar del mayor al menor)",
    desc: "Empezamos en el <strong>número mayor</strong> y damos saltos hacia abajo (<strong>-</strong>) hasta bajar al <strong>número menor</strong>. En la columna central vamos sumando cuánto hemos bajado en total.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: De <strong>63</strong> bajar hasta <strong>40</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Salto (-)</th><th>Total bajado (0 ⬆️)</th><th>Escalón (63 ➡️ 40)</th></tr>
        </thead>
        <tbody>
          <tr><td>- 20</td><td>20</td><td>43</td></tr>
          <tr><td>- 3</td><td class="cell-win">23 ✨</td><td class="cell-zero">40 (¡Meta!)</td></tr>
        </tbody>
      </table>
      <p class="mini-note">De 63 bajamos 20 (llegamos a 43, llevamos 20). Luego bajamos 3 (llegamos a la meta 40, total bajado: 23).</p>
    `
  },
  igualacion: {
    badge: "Comparar e Igualar ABN",
    title: "Igualación de dos cantidades",
    desc: "Tenemos dos cantidades diferentes y queremos que <strong>tengan exactamente lo mismo</strong>. Damos pasos en la rejilla hasta igualar la cantidad meta y acumulamos en el centro cuánto hemos necesitado.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: Igualar <strong>32</strong> y <strong>60</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Paso</th><th>Total para igualar (0 ⬆️)</th><th>Cantidad (32 ➡️ 60)</th></tr>
        </thead>
        <tbody>
          <tr><td>+ 8</td><td>8</td><td>40</td></tr>
          <tr><td>+ 20</td><td class="cell-win">28 ✨</td><td class="cell-zero">60 (¡Iguales!)</td></tr>
        </tbody>
      </table>
      <p class="mini-note">Añadimos 8 para llegar a 40 y luego 20 para igualar los 60. ¡Hacen falta 28 para que sean iguales!</p>
    `
  },
  detraccion_comparacion: {
    badge: "Comparación ABN",
    title: "Detracción con Comparación",
    desc: "Para saber cuántos más tiene el grupo grande que el pequeño, vamos <strong>quitando la misma cantidad a los dos grupos a la vez</strong> hasta que el grupo menor se quede en <strong>0</strong>. ¡Lo que sobre en el grande es la diferencia!",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: Comparar <strong>75</strong> y <strong>42</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Quito a ambos (-)</th><th>Mayor: 75 (⬇️)</th><th>Menor: 42 (⬇️ a 0)</th></tr>
        </thead>
        <tbody>
          <tr><td>- 40</td><td>35</td><td>2</td></tr>
          <tr><td>- 2</td><td class="cell-win">33 ✨</td><td class="cell-zero">0</td></tr>
        </tbody>
      </table>
      <p class="mini-note">Quitamos 40 a los dos (quedan 35 y 2) y luego 2 a los dos (quedan 33 y 0). El mayor tiene 33 más.</p>
    `
  },
  doblesuma: {
    badge: "Reto · 3 Números",
    title: "Doble Suma (+ +)",
    desc: "Juntamos tres números. En cada fila puedes pasar cantidades del 2º número, del 3º número ¡o de los dos a la vez! al primer número hasta que ambos queden en <strong>0</strong>.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: <strong>25 + 14 + 12</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Paso (+)</th><th>25 (Sube ⬆️)</th><th>14 (⬇️)</th><th>12 (⬇️)</th></tr>
        </thead>
        <tbody>
          <tr><td>+ 20</td><td>45</td><td>4</td><td>2</td></tr>
          <tr><td>+ 6</td><td class="cell-win">51 ✨</td><td class="cell-zero">0</td><td class="cell-zero">0</td></tr>
        </tbody>
      </table>
      <p class="mini-note">En la 1ª fila cogemos 10 del 14 y 10 del 12 (+20 en total). En la 2ª fila cogemos los 4 y 2 que quedaban (+6).</p>
    `
  },
  dobleresta: {
    badge: "Reto · 3 Números",
    title: "Doble Resta (- -)",
    desc: "Al primer número (el más grande) le vamos quitando cantidades del 2º y del 3º número hasta que las dos últimas columnas lleguen a <strong>0</strong>.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: <strong>85 - 23 - 12</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Quito (-)</th><th>85 (Baja ⬇️)</th><th>23 (⬇️)</th><th>12 (⬇️)</th></tr>
        </thead>
        <tbody>
          <tr><td>- 30</td><td>55</td><td>3</td><td>2</td></tr>
          <tr><td>- 5</td><td class="cell-win">50 ✨</td><td class="cell-zero">0</td><td class="cell-zero">0</td></tr>
        </tbody>
      </table>
      <p class="mini-note">1º Quitamos 30 en total (20 de la 2ª columna y 10 de la 3ª). 2º Quitamos los 5 restantes (3 y 2).</p>
    `
  },
  sumiresta: {
    badge: "Reto · 3 Números",
    title: "Sumirresta (+ y luego -)",
    desc: "¡Tiene dos fases! <strong>Fase 1 (+):</strong> Primero sumamos toda la columna del medio al primer número hasta dejarla en <strong>0</strong>. <strong>Fase 2 (-):</strong> Después restamos la última columna hasta dejarla también en <strong>0</strong>.",
    exampleHtml: `
      <div class="mini-example-title">Ejemplo: <strong>40 + 15 - 12</strong></div>
      <table class="mini-table">
        <thead>
          <tr><th>Paso</th><th>40</th><th>+ 15 (1º Sumar)</th><th>- 12 (2º Restar)</th></tr>
        </thead>
        <tbody>
          <tr><td>+ 15</td><td>55</td><td class="cell-zero">0</td><td>12</td></tr>
          <tr><td>- 12</td><td class="cell-win">43 ✨</td><td class="cell-zero">0</td><td class="cell-zero">0</td></tr>
        </tbody>
      </table>
      <p class="mini-note">Mientras sumamos el 15, el 12 espera sin cambiar. Cuando el 15 llega a 0, el signo cambia a (-) y restamos el 12.</p>
    `
  }
};

document.addEventListener("DOMContentLoaded", () => {
  actualizarGuiaOperacion();
});

// Cambia la pestaña de categoría de operaciones
function cambiarCategoriaRejilla(categoria) {
  const tabs = document.querySelectorAll(".cat-tab");
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.getAttribute("data-cat") === categoria);
  });

  const cards = document.querySelectorAll(".op-card");
  let firstOpInCat = null;
  cards.forEach((card) => {
    const match = card.getAttribute("data-cat") === categoria;
    card.style.display = match ? "flex" : "none";
    if (match && !firstOpInCat) {
      firstOpInCat = card.getAttribute("data-op");
    }
  });

  // Si la operación actual no pertenece a esta categoría, seleccionamos la primera de la categoría
  const activeCard = document.querySelector(`.op-card[data-op="${currentOperation}"]`);
  if (!activeCard || activeCard.getAttribute("data-cat") !== categoria) {
    if (firstOpInCat) {
      seleccionarOperacionRejilla(firstOpInCat);
    }
  }
}

// Selecciona una tarjeta de operación
function seleccionarOperacionRejilla(op) {
  currentOperation = op;
  const selectEl = document.getElementById("operacion");
  if (selectEl) {
    selectEl.value = op;
  }

  const cards = document.querySelectorAll(".op-card");
  cards.forEach((card) => {
    card.classList.toggle("active", card.getAttribute("data-op") === op);
  });

  toggleTercerNumeroPersonalizado();
  actualizarGuiaOperacion();
}

// Si cambia el select oculto directamente
function onSelectOperacionChange() {
  const selectEl = document.getElementById("operacion");
  if (selectEl) {
    seleccionarOperacionRejilla(selectEl.value);
  }
}

// Actualiza el cuadro de guía didáctica según la operación seleccionada
function actualizarGuiaOperacion() {
  const op = document.getElementById("operacion")?.value || currentOperation;
  currentOperation = op;
  const info = OPERATION_GUIDES[op] || OPERATION_GUIDES.suma;

  const badgeEl = document.getElementById("guideBadge");
  const titleEl = document.getElementById("guideTitle");
  const descEl = document.getElementById("guideDescription");
  const exampleEl = document.getElementById("guideExampleContainer");
  const igualacionWrap = document.getElementById("igualacionSubModeWrap");

  if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-lightbulb"></i> ${info.badge}`;
  if (titleEl) titleEl.textContent = info.title;
  if (descEl) descEl.innerHTML = info.desc;
  if (exampleEl) exampleEl.innerHTML = info.exampleHtml;

  if (igualacionWrap) {
    igualacionWrap.style.display = op === "igualacion" ? "flex" : "none";
  }

  const checkedRadio = document.querySelector('input[name="modoIgualacion"]:checked');
  if (checkedRadio) {
    currentIgualacionMode = checkedRadio.value;
  }
}

// Muestra u oculta el ejemplo resuelto
function toggleEjemploGuia() {
  const exampleEl = document.getElementById("guideExampleContainer");
  const btn = document.getElementById("btnToggleExample");
  if (!exampleEl || !btn) return;

  const isHidden = exampleEl.style.display === "none" || exampleEl.style.display === "";
  exampleEl.style.display = isHidden ? "block" : "none";
  btn.innerHTML = isHidden
    ? `<i class="fa-solid fa-eye-slash"></i> Ocultar ejemplo`
    : `<i class="fa-solid fa-eye"></i> Ver ejemplo resuelto`;
}

// Comprueba si es operación de 3 números
function esOperacionTriple(op) {
  return op === "doblesuma" || op === "dobleresta" || op === "sumiresta";
}

// Inicia un ejercicio aleatorio
function iniciarEjercicio() {
  const nivel = document.getElementById("nivel").value;
  currentOperation = document.getElementById("operacion").value;

  const checkedRadio = document.querySelector('input[name="modoIgualacion"]:checked');
  if (checkedRadio) {
    currentIgualacionMode = checkedRadio.value;
  }

  let maxNumber;
  switch (nivel) {
    case "1": maxNumber = 50; break;
    case "2": maxNumber = 100; break;
    case "3": maxNumber = 500; break;
    case "4": maxNumber = 1000; break;
    case "5": maxNumber = 5000; break;
    case "6": maxNumber = 10000; break;
    default: maxNumber = 50;
  }

  let n1 = Math.floor(Math.random() * (maxNumber - 4)) + 5;
  let n2 = Math.floor(Math.random() * (maxNumber - 4)) + 2;
  let n3 = null;

  const isTriple = esOperacionTriple(currentOperation);

  if (isTriple) {
    n3 = Math.floor(Math.random() * (maxNumber - 4)) + 2;
    if (currentOperation === "dobleresta" || currentOperation === "sumiresta") {
      let tempArray = [n1, n2, n3].sort((a, b) => b - a);
      n1 = tempArray[0];
      n2 = tempArray[1];
      n3 = tempArray[2];
      if (currentOperation === "dobleresta" && n1 < n2 + n3) {
        n1 = n2 + n3 + Math.floor(Math.random() * 15) + 3;
      }
    }
  } else {
    // Asegurar dos números distintos y que n1 sea el mayor
    if (n1 === n2) {
      n1 = n2 + Math.floor(Math.random() * 10) + 4;
    }
    if (n2 > n1) {
      [n1, n2] = [n2, n1];
    }
  }

  bigNumber = n1;
  smallNumber = n2;
  if (isTriple) thirdNumber = n3;

  construirRejillaActiva();
}

// Configura los vectores iniciales Tcalc, Rcalc, R2calc y renderiza la tabla de la rejilla
function construirRejillaActiva() {
  const isTriple = esOperacionTriple(currentOperation);
  nextRowIndex = 1;

  // Estado inicial en la fila 0 según el tipo de operación ABN
  if (currentOperation === "escalera_asc") {
    // Col 2 (Tcalc): diferencia acumulada empieza en 0
    // Col 3 (Rcalc): posición actual empieza en el menor y sube hasta bigNumber
    Tcalc = [0];
    Rcalc = [smallNumber];
  } else if (currentOperation === "escalera_desc") {
    // Col 2 (Tcalc): diferencia acumulada empieza en 0
    // Col 3 (Rcalc): posición actual empieza en el mayor y baja hasta smallNumber
    Tcalc = [0];
    Rcalc = [bigNumber];
  } else if (currentOperation === "igualacion") {
    Tcalc = [0];
    Rcalc = [currentIgualacionMode === "asc" ? smallNumber : bigNumber];
  } else {
    // Suma, resta, detracción con comparación y triples
    Tcalc = [bigNumber];
    Rcalc = [smallNumber];
    if (isTriple) R2calc = [thirdNumber];
  }

  // Construir el encabezado del problema y las cabeceras descriptivas de las columnas
  const headerInfo = obtenerInfoCabeceraRejilla();

  let html = `
    <div class="problem-banner">
      <div class="problem-main">${headerInfo.problemTitle}</div>
      <div class="problem-story">${headerInfo.problemStory}</div>
    </div>

    <div id="liveStepHint" class="live-step-hint"></div>

    <div class="table-responsive-wrap">
      <table id="abnTable">
        <thead>
          <tr>
            <th>
              <span class="th-main">${headerInfo.col1Title}</span>
              <span class="th-sub">${headerInfo.col1Sub}</span>
            </th>
            <th id="thBigNumber">
              <span class="th-main">${headerInfo.col2Title}</span>
              <span class="th-sub">${headerInfo.col2Sub}</span>
            </th>
            <th id="thSmallNumber">
              <span class="th-main">${headerInfo.col3Title}</span>
              <span class="th-sub">${headerInfo.col3Sub}</span>
            </th>
            ${
              isTriple
                ? `<th id="thThirdNumber">
                    <span class="th-main">${headerInfo.col4Title}</span>
                    <span class="th-sub">${headerInfo.col4Sub}</span>
                  </th>`
                : ""
            }
          </tr>
        </thead>
        <tbody id="tablaBody">
        </tbody>
      </table>
    </div>
    <div id="mensajeFinal" class="mensaje-final-rejilla"></div>
  `;

  document.getElementById("ejercicio").innerHTML = html;

  agregarFila();
  actualizarPistaEnVivo(1);
}

// Devuelve los textos claros para cada columna y el enunciado según la operación
function obtenerInfoCabeceraRejilla() {
  switch (currentOperation) {
    case "suma":
      return {
        problemTitle: `<span class="op-tag tag-green">Suma</span> ${bigNumber} + ${smallNumber}`,
        problemStory: `Pasa cantidades del <strong>${smallNumber}</strong> al <strong>${bigNumber}</strong> hasta que la última columna llegue a <strong>0</strong>.`,
        col1Title: "Paso (+)",
        col1Sub: "Lo que paso",
        col2Title: `${bigNumber}`,
        col2Sub: "Acumulado ⬆️",
        col3Title: `${smallNumber}`,
        col3Sub: "Queda por pasar ⬇️"
      };
    case "resta":
      return {
        problemTitle: `<span class="op-tag tag-orange">Resta</span> ${bigNumber} - ${smallNumber}`,
        problemStory: `Quita partes del <strong>${smallNumber}</strong> en ambas columnas hasta que la última llegue a <strong>0</strong>.`,
        col1Title: "Quito (-)",
        col1Sub: "Lo que quito",
        col2Title: `${bigNumber}`,
        col2Sub: "Me quedan ⬇️",
        col3Title: `${smallNumber}`,
        col3Sub: "Falta por quitar ⬇️"
      };
    case "escalera_asc":
      return {
        problemTitle: `<span class="op-tag tag-blue">Escalera Ascendente</span> De ${smallNumber} hasta ${bigNumber}`,
        problemStory: `Estamos en el escalón <strong>${smallNumber}</strong> y queremos subir hasta la meta <strong>${bigNumber}</strong>.`,
        col1Title: "Subo (+)",
        col1Sub: "Salto del escalón",
        col2Title: `0`,
        col2Sub: "Total subido ⬆️",
        col3Title: `${smallNumber} ➡️ ${bigNumber}`,
        col3Sub: `Estoy en... (Meta: ${bigNumber})`
      };
    case "escalera_desc":
      return {
        problemTitle: `<span class="op-tag tag-teal">Escalera Descendente</span> De ${bigNumber} hasta ${smallNumber}`,
        problemStory: `Estamos arriba en el <strong>${bigNumber}</strong> y queremos bajar hasta el escalón <strong>${smallNumber}</strong>.`,
        col1Title: "Bajo (-)",
        col1Sub: "Salto hacia abajo",
        col2Title: `0`,
        col2Sub: "Total bajado ⬆️",
        col3Title: `${bigNumber} ➡️ ${smallNumber}`,
        col3Sub: `Estoy en... (Meta: ${smallNumber})`
      };
    case "igualacion":
      if (currentIgualacionMode === "asc") {
        return {
          problemTitle: `<span class="op-tag tag-sun">Igualación (Subiendo)</span> Igualar ${smallNumber} con ${bigNumber}`,
          problemStory: `🧒 Leo tiene <strong>${smallNumber}</strong> y 👧 Sara tiene <strong>${bigNumber}</strong>. ¿Cuánto añadimos a ${smallNumber} para igualar a ${bigNumber}?`,
          col1Title: "Añado (+)",
          col1Sub: "Paso para igualar",
          col2Title: `0`,
          col2Sub: "Total añadido ⬆️",
          col3Title: `${smallNumber} ➡️ ${bigNumber}`,
          col3Sub: `Tiene... (Igualar a ${bigNumber})`
        };
      } else {
        return {
          problemTitle: `<span class="op-tag tag-sun">Igualación (Bajando)</span> Igualar ${bigNumber} con ${smallNumber}`,
          problemStory: `👧 Sara tiene <strong>${bigNumber}</strong> y 🧒 Leo tiene <strong>${smallNumber}</strong>. ¿Cuánto quitamos a ${bigNumber} para igualar a ${smallNumber}?`,
          col1Title: "Quito (-)",
          col1Sub: "Paso para igualar",
          col2Title: `0`,
          col2Sub: "Total quitado ⬆️",
          col3Title: `${bigNumber} ➡️ ${smallNumber}`,
          col3Sub: `Tiene... (Igualar a ${smallNumber})`
        };
      }
    case "detraccion_comparacion":
      return {
        problemTitle: `<span class="op-tag tag-pink">Detracción con Comparación</span> ${bigNumber} y ${smallNumber}`,
        problemStory: `Comparamos <strong>${bigNumber}</strong> y <strong>${smallNumber}</strong> quitando lo mismo a los dos hasta vaciar el menor (<strong>0</strong>).`,
        col1Title: "Quito a ambos (-)",
        col1Sub: "Misma cantidad",
        col2Title: `${bigNumber}`,
        col2Sub: "Grupo Mayor ⬇️",
        col3Title: `${smallNumber}`,
        col3Sub: "Grupo Menor ⬇️ (a 0)"
      };
    case "doblesuma":
      return {
        problemTitle: `<span class="op-tag tag-purple">Doble Suma</span> ${bigNumber} + ${smallNumber} + ${thirdNumber}`,
        problemStory: `Pasa cantidades de las dos últimas columnas al <strong>${bigNumber}</strong> hasta que las dos queden en <strong>0</strong>.`,
        col1Title: "Paso (+)",
        col1Sub: "Total que paso",
        col2Title: `${bigNumber}`,
        col2Sub: "Acumulado ⬆️",
        col3Title: `+ ${smallNumber}`,
        col3Sub: "1º Sumando ⬇️",
        col4Title: `+ ${thirdNumber}`,
        col4Sub: "2º Sumando ⬇️"
      };
    case "dobleresta":
      return {
        problemTitle: `<span class="op-tag tag-red">Doble Resta</span> ${bigNumber} - ${smallNumber} - ${thirdNumber}`,
        problemStory: `Quita al <strong>${bigNumber}</strong> cantidades de las otras dos columnas hasta que ambas queden en <strong>0</strong>.`,
        col1Title: "Quito (-)",
        col1Sub: "Total que quito",
        col2Title: `${bigNumber}`,
        col2Sub: "Me quedan ⬇️",
        col3Title: `- ${smallNumber}`,
        col3Sub: "1º Resta ⬇️",
        col4Title: `- ${thirdNumber}`,
        col4Sub: "2º Resta ⬇️"
      };
    case "sumiresta":
      return {
        problemTitle: `<span class="op-tag tag-indigo">Sumirresta</span> ${bigNumber} + ${smallNumber} - ${thirdNumber}`,
        problemStory: `<strong>1º</strong> Suma toda la columna del medio (<strong>+${smallNumber}</strong>) hasta dejarla en 0. <strong>2º</strong> Después resta la última (<strong>-${thirdNumber}</strong>).`,
        col1Title: "Paso (+ / -)",
        col1Sub: "Cantidad del paso",
        col2Title: `${bigNumber}`,
        col2Sub: "Resultado parcial",
        col3Title: `+ ${smallNumber}`,
        col3Sub: "1º Sumar (a 0)",
        col4Title: `- ${thirdNumber}`,
        col4Sub: "2º Restar (a 0)"
      };
    default:
      return {
        problemTitle: `${bigNumber} + ${smallNumber}`,
        problemStory: "",
        col1Title: "Cantidad",
        col1Sub: "",
        col2Title: `${bigNumber}`,
        col2Sub: "",
        col3Title: `${smallNumber}`,
        col3Sub: ""
      };
  }
}

// Determina qué símbolo (+ o -) corresponde a la fila actual
function obtenerSimboloFila(rowIndex) {
  if (
    currentOperation === "suma" ||
    currentOperation === "doblesuma" ||
    currentOperation === "escalera_asc"
  ) {
    return "+";
  }
  if (
    currentOperation === "resta" ||
    currentOperation === "dobleresta" ||
    currentOperation === "escalera_desc" ||
    currentOperation === "detraccion_comparacion"
  ) {
    return "-";
  }
  if (currentOperation === "igualacion") {
    return currentIgualacionMode === "asc" ? "+" : "-";
  }
  if (currentOperation === "sumiresta") {
    if (rowIndex > 1 && Rcalc[rowIndex - 1] === 0) {
      return "-";
    }
    return "+";
  }
  return "+";
}

// Muestra una pista amigable en vivo indicando el progreso actual
function actualizarPistaEnVivo(rowIndex) {
  const hintEl = document.getElementById("liveStepHint");
  if (!hintEl) return;

  const prevT = Tcalc[rowIndex - 1];
  const prevR = Rcalc[rowIndex - 1];
  const prevR2 = R2calc[rowIndex - 1];

  if (currentOperation === "suma") {
    hintEl.innerHTML = `<i class="fa-solid fa-compass"></i> Llevas <strong>${prevT}</strong> y te faltan <strong>${prevR}</strong> por sumar.`;
  } else if (currentOperation === "resta" || currentOperation === "detraccion_comparacion") {
    hintEl.innerHTML = `<i class="fa-solid fa-compass"></i> Tienes <strong>${prevT}</strong> y aún debes quitar <strong>${prevR}</strong>.`;
  } else if (currentOperation === "escalera_asc") {
    const falta = bigNumber - prevR;
    hintEl.innerHTML = `<i class="fa-solid fa-stairs"></i> Estás en el escalón <strong>${prevR}</strong> y quieres llegar al <strong>${bigNumber}</strong> (te faltan ${falta}).`;
  } else if (currentOperation === "escalera_desc") {
    const falta = prevR - smallNumber;
    hintEl.innerHTML = `<i class="fa-solid fa-stairs"></i> Estás en el escalón <strong>${prevR}</strong> y quieres bajar al <strong>${smallNumber}</strong> (te faltan ${falta}).`;
  } else if (currentOperation === "igualacion") {
    if (currentIgualacionMode === "asc") {
      hintEl.innerHTML = `<i class="fa-solid fa-scale-balanced"></i> Tienes <strong>${prevR}</strong> y quieres igualar a <strong>${bigNumber}</strong>. Llevas añadidos <strong>${prevT}</strong>.`;
    } else {
      hintEl.innerHTML = `<i class="fa-solid fa-scale-balanced"></i> Tienes <strong>${prevR}</strong> y quieres bajar para igualar a <strong>${smallNumber}</strong>. Llevas quitados <strong>${prevT}</strong>.`;
    }
  } else if (currentOperation === "sumiresta") {
    if (prevR > 0) {
      hintEl.innerHTML = `<span class="phase-pill phase-add">Fase 1: SUMAR (+)</span> Pasa del <strong>${prevR}</strong> al <strong>${prevT}</strong>. En la última columna pon <strong>${prevR2}</strong> (aún espera).`;
    } else {
      hintEl.innerHTML = `<span class="phase-pill phase-sub">Fase 2: RESTAR (-)</span> ¡Ya sumaste todo! En la 3ª columna pon <strong>0</strong> y quita del <strong>${prevR2}</strong> al <strong>${prevT}</strong>.`;
    }
  } else if (currentOperation === "doblesuma") {
    hintEl.innerHTML = `<i class="fa-solid fa-compass"></i> Llevas <strong>${prevT}</strong>. Quedan <strong>${prevR}</strong> y <strong>${prevR2}</strong> por pasar.`;
  } else if (currentOperation === "dobleresta") {
    hintEl.innerHTML = `<i class="fa-solid fa-compass"></i> Tienes <strong>${prevT}</strong>. Quedan <strong>${prevR}</strong> y <strong>${prevR2}</strong> por quitar.`;
  }
}

// Agrega una nueva fila a la tabla
function agregarFila() {
  const tbody = document.getElementById("tablaBody");
  const rowIndex = nextRowIndex;
  const tr = document.createElement("tr");
  tr.setAttribute("id", "fila_" + rowIndex);

  const isTriple = esOperacionTriple(currentOperation);
  const currentSymbol = obtenerSimboloFila(rowIndex);

  // Columna 1: Cantidad del paso (con símbolo + o -)
  let td1 = document.createElement("td");
  let wrap1 = document.createElement("div");
  wrap1.className = "cell-input-wrap";

  let spanSimbolo = document.createElement("span");
  spanSimbolo.className =
    "operacionSimbolo " + (currentSymbol === "+" ? "simbolo-mas" : "simbolo-menos");
  spanSimbolo.textContent = currentSymbol;
  wrap1.appendChild(spanSimbolo);

  let inputPartial = document.createElement("input");
  inputPartial.type = "tel";
  inputPartial.inputMode = "numeric";
  inputPartial.id = "partial_" + rowIndex;
  inputPartial.placeholder = "Paso";
  inputPartial.oninput = function () {
    validarFila(rowIndex);
  };
  wrap1.appendChild(inputPartial);
  td1.appendChild(wrap1);

  // Columna 2: Acumulado / Total
  let td2 = document.createElement("td");
  let inputTotal = document.createElement("input");
  inputTotal.type = "tel";
  inputTotal.inputMode = "numeric";
  inputTotal.id = "total_" + rowIndex;
  inputTotal.placeholder = "Total";
  inputTotal.oninput = function () {
    validarFila(rowIndex);
  };
  td2.appendChild(inputTotal);

  // Columna 3: Resto / Escalón actual
  let td3 = document.createElement("td");
  let inputRemainder = document.createElement("input");
  inputRemainder.type = "tel";
  inputRemainder.inputMode = "numeric";
  inputRemainder.id = "remainder_" + rowIndex;
  if (currentOperation === "sumiresta" && rowIndex > 1 && Rcalc[rowIndex - 1] === 0) {
    inputRemainder.placeholder = "0";
  } else {
    inputRemainder.placeholder = "Queda";
  }
  inputRemainder.oninput = function () {
    validarFila(rowIndex);
  };
  td3.appendChild(inputRemainder);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  // Columna 4: Tercer número si es operación triple
  if (isTriple) {
    let td4 = document.createElement("td");
    let inputRemainder2 = document.createElement("input");
    inputRemainder2.type = "tel";
    inputRemainder2.inputMode = "numeric";
    inputRemainder2.id = "remainder2_" + rowIndex;
    if (currentOperation === "sumiresta" && Rcalc[rowIndex - 1] > 0) {
      inputRemainder2.placeholder = String(R2calc[rowIndex - 1]);
    } else {
      inputRemainder2.placeholder = "Queda";
    }
    inputRemainder2.oninput = function () {
      validarFila(rowIndex);
    };
    td4.appendChild(inputRemainder2);
    tr.appendChild(td4);
  }

  tbody.appendChild(tr);
  nextRowIndex++;

  setTimeout(() => {
    inputPartial.focus();
  }, 40);
}

// Deshabilita los inputs de una fila ya validada
function disableRow(rowIndex) {
  const row = document.getElementById("fila_" + rowIndex);
  if (row) {
    const inputs = row.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }
}

// Valida la fila con índice rowIndex
function validarFila(rowIndex) {
  const isTriple = esOperacionTriple(currentOperation);

  const partialInput = document.getElementById("partial_" + rowIndex);
  const totalInput = document.getElementById("total_" + rowIndex);
  const remainderInput = document.getElementById("remainder_" + rowIndex);
  let remainder2Input = null;
  if (isTriple) remainder2Input = document.getElementById("remainder2_" + rowIndex);

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

  // Si algún campo está vacío, limpiamos marcas y esperamos a que termine de escribir
  if (
    isNaN(partialVal) ||
    isNaN(totalVal) ||
    isNaN(remainderVal) ||
    (isTriple && isNaN(remainder2Val))
  ) {
    marcarEstado(partialInput, null);
    marcarEstado(totalInput, null);
    marcarEstado(remainderInput, null);
    if (isTriple) marcarEstado(remainder2Input, null);
    return;
  }

  let partialCorrect = partialVal > 0;
  let totalCorrect = false;
  let remainderCorrect = false;
  let remainder2Correct = false;

  if (currentOperation === "suma") {
    if (partialVal > prevRemainder || partialVal <= 0) partialCorrect = false;
    totalCorrect = totalVal === prevTotal + partialVal;
    remainderCorrect = remainderVal === prevRemainder - partialVal;
  } else if (
    currentOperation === "resta" ||
    currentOperation === "detraccion_comparacion"
  ) {
    if (partialVal > prevRemainder || partialVal <= 0) partialCorrect = false;
    totalCorrect = totalVal === prevTotal - partialVal;
    remainderCorrect = remainderVal === prevRemainder - partialVal;
  } else if (currentOperation === "escalera_asc") {
    // Subimos desde smallNumber hasta bigNumber
    const maxStep = bigNumber - prevRemainder;
    if (partialVal <= 0 || partialVal > maxStep) partialCorrect = false;
    totalCorrect = totalVal === prevTotal + partialVal;
    remainderCorrect = remainderVal === prevRemainder + partialVal;
  } else if (currentOperation === "escalera_desc") {
    // Bajamos desde bigNumber hasta smallNumber
    const maxStep = prevRemainder - smallNumber;
    if (partialVal <= 0 || partialVal > maxStep) partialCorrect = false;
    totalCorrect = totalVal === prevTotal + partialVal;
    remainderCorrect = remainderVal === prevRemainder - partialVal;
  } else if (currentOperation === "igualacion") {
    if (currentIgualacionMode === "asc") {
      const maxStep = bigNumber - prevRemainder;
      if (partialVal <= 0 || partialVal > maxStep) partialCorrect = false;
      totalCorrect = totalVal === prevTotal + partialVal;
      remainderCorrect = remainderVal === prevRemainder + partialVal;
    } else {
      const maxStep = prevRemainder - smallNumber;
      if (partialVal <= 0 || partialVal > maxStep) partialCorrect = false;
      totalCorrect = totalVal === prevTotal + partialVal;
      remainderCorrect = remainderVal === prevRemainder - partialVal;
    }
  } else if (currentOperation === "doblesuma") {
    const diffR1 = prevRemainder - remainderVal;
    const diffR2 = prevRemainder2 - remainder2Val;
    if (partialVal <= 0 || partialVal > prevRemainder + prevRemainder2) {
      partialCorrect = false;
    }
    totalCorrect = totalVal === prevTotal + partialVal;
    if (diffR1 >= 0 && diffR2 >= 0 && diffR1 + diffR2 === partialVal) {
      remainderCorrect = true;
      remainder2Correct = true;
    }
  } else if (currentOperation === "dobleresta") {
    const diffR1 = prevRemainder - remainderVal;
    const diffR2 = prevRemainder2 - remainder2Val;
    if (partialVal <= 0 || partialVal > prevRemainder + prevRemainder2) {
      partialCorrect = false;
    }
    totalCorrect = totalVal === prevTotal - partialVal;
    if (diffR1 >= 0 && diffR2 >= 0 && diffR1 + diffR2 === partialVal) {
      remainderCorrect = true;
      remainder2Correct = true;
    }
  } else if (currentOperation === "sumiresta") {
    const diffR1 = prevRemainder - remainderVal;
    const diffR2 = prevRemainder2 - remainder2Val;

    if (prevRemainder > 0) {
      // Fase 1: Todavía estamos sumando la columna central
      if (partialVal <= 0 || partialVal > prevRemainder) partialCorrect = false;
      totalCorrect = totalVal === prevTotal + partialVal;
      remainderCorrect = diffR1 === partialVal && remainderVal >= 0;
      remainder2Correct = diffR2 === 0;
    } else {
      // Fase 2: La columna central ya es 0, ahora restamos la última columna
      if (partialVal <= 0 || partialVal > prevRemainder2) partialCorrect = false;
      totalCorrect = totalVal === prevTotal - partialVal;
      remainderCorrect = remainderVal === 0;
      remainder2Correct = diffR2 === partialVal && remainder2Val >= 0;
    }
  }

  marcarEstado(partialInput, partialCorrect);
  marcarEstado(totalInput, totalCorrect);
  marcarEstado(remainderInput, remainderCorrect);
  if (isTriple) marcarEstado(remainder2Input, remainder2Correct);

  let allCorrect = partialCorrect && totalCorrect && remainderCorrect;
  if (isTriple) allCorrect = allCorrect && remainder2Correct;

  if (allCorrect) {
    Tcalc[rowIndex] = totalVal;
    Rcalc[rowIndex] = remainderVal;
    if (isTriple) R2calc[rowIndex] = remainder2Val;

    disableRow(rowIndex);

    // Comprobar si hemos finalizado el ejercicio
    let finished = false;
    if (
      currentOperation === "suma" ||
      currentOperation === "resta" ||
      currentOperation === "detraccion_comparacion"
    ) {
      finished = remainderVal === 0;
    } else if (currentOperation === "escalera_asc") {
      finished = remainderVal === bigNumber;
    } else if (currentOperation === "escalera_desc") {
      finished = remainderVal === smallNumber;
    } else if (currentOperation === "igualacion") {
      finished =
        currentIgualacionMode === "asc"
          ? remainderVal === bigNumber
          : remainderVal === smallNumber;
    } else if (isTriple) {
      finished = remainderVal === 0 && remainder2Val === 0;
    }

    if (!finished) {
      if (!document.getElementById("fila_" + nextRowIndex)) {
        agregarFila();
        actualizarPistaEnVivo(nextRowIndex - 1);
      }
    } else {
      mostrarExitoRejilla(totalVal);
    }
  }
}

function mostrarExitoRejilla(resultadoFinal) {
  const hintEl = document.getElementById("liveStepHint");
  if (hintEl) {
    hintEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Has completado todos los pasos de la rejilla!`;
  }

  const msgEl = document.getElementById("mensajeFinal");
  if (!msgEl) return;

  let textoExplicativo = `Resultado final: <strong>${resultadoFinal}</strong>`;
  if (currentOperation === "escalera_asc" || currentOperation === "escalera_desc") {
    textoExplicativo = `¡Llegaste a la meta! La diferencia entre ${bigNumber} y ${smallNumber} es <strong>${resultadoFinal}</strong>.`;
  } else if (currentOperation === "igualacion") {
    textoExplicativo = `¡Cantidades igualadas! Hacían falta <strong>${resultadoFinal}</strong> para que fueran iguales.`;
  } else if (currentOperation === "detraccion_comparacion") {
    textoExplicativo = `¡Comparación terminada! El grupo mayor tiene <strong>${resultadoFinal}</strong> más que el menor.`;
  }

  msgEl.style.display = "block";
  msgEl.innerHTML = `
    <div class="win-icon"><i class="fa-solid fa-award"></i></div>
    <h3>¡Operación completada!</h3>
    <p>${textoExplicativo}</p>
  `;

  lanzarConfetiRejilla();
}

function marcarEstado(element, estado) {
  if (!element) return;
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

// --- FUNCIONES PARA NÚMEROS PERSONALIZADOS ---
function mostrarInputPersonalizadoRejilla() {
  const container = document.getElementById("customInputContainerRejilla");
  if (!container) return;
  if (container.style.display === "none" || container.style.display === "") {
    container.style.display = "block";
    toggleTercerNumeroPersonalizado();
  } else {
    container.style.display = "none";
  }
}

function toggleTercerNumeroPersonalizado() {
  const op = document.getElementById("operacion")?.value || currentOperation;
  const isTriple = esOperacionTriple(op);
  const contenedorNum3 = document.getElementById("contenedorNum3");

  if (contenedorNum3) {
    contenedorNum3.style.display = isTriple ? "flex" : "none";
  }
}

function iniciarEjercicioPersonalizado() {
  const op = document.getElementById("operacion").value;
  const isTriple = esOperacionTriple(op);

  const checkedRadio = document.querySelector('input[name="modoIgualacion"]:checked');
  if (checkedRadio) {
    currentIgualacionMode = checkedRadio.value;
  }

  const num1Str = document.getElementById("num1Personalizado").value;
  const num2Str = document.getElementById("num2Personalizado").value;
  let num3Str = null;
  if (isTriple) {
    num3Str = document.getElementById("num3Personalizado").value;
  }

  let n1 = parseInt(num1Str, 10);
  let n2 = parseInt(num2Str, 10);
  let n3;
  if (isTriple) n3 = parseInt(num3Str, 10);

  if (isNaN(n1) || isNaN(n2) || (isTriple && isNaN(n3))) {
    alert("Por favor, introduce números válidos en todas las casillas.");
    return;
  }

  currentOperation = op;

  if (!isTriple) {
    let max = Math.max(n1, n2);
    let min = Math.min(n1, n2);
    if (
      (op === "escalera_asc" || op === "escalera_desc" || op === "igualacion") &&
      max === min
    ) {
      alert("Para escaleras e igualación, introduce dos números diferentes.");
      return;
    }
    bigNumber = max;
    smallNumber = min;
  } else {
    if (op === "dobleresta" && n1 < n2 + n3) {
      alert(
        "En la doble resta, asegúrate de que el primer número sea mayor o igual que la suma de los otros dos."
      );
      return;
    }
    if (op === "sumiresta" && n1 + n2 < n3) {
      alert(
        "En la sumirresta, la suma de los dos primeros números debe ser mayor o igual que el tercero."
      );
      return;
    }
    bigNumber = n1;
    smallNumber = n2;
    thirdNumber = n3;
  }

  construirRejillaActiva();
  document.getElementById("customInputContainerRejilla").style.display = "none";
}

function lanzarConfetiRejilla() {
  let canvas = document.getElementById("confettiCanvasRejilla");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "confettiCanvasRejilla";
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colores = ["#673ab7", "#ffca28", "#4caf50", "#29b6f6", "#ec407a", "#ff7043"];
  const particulas = Array.from({ length: 70 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: Math.random() * 8 + 5,
    color: colores[Math.floor(Math.random() * colores.length)],
    speedY: Math.random() * 3 + 2.5,
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
    if (frames < 160) {
      requestAnimationFrame(animar);
    } else if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }
  requestAnimationFrame(animar);
}

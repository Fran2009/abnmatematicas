// js/soles.js - Lógica interactiva de Los Soles ABN (Modo Guiado y Modo Libre)

let totalRayosSol = 10; // Por defecto 10 rayos u opciones
let modoActualSol = "guiado"; // 'guiado' o 'libre'
let numeroCentroSol = 20;
let rayosData = [];
let rayosCompletados = 0;
let expresionesUsadasLibre = new Set();

// Lee y valida la cantidad de rayos configurada en el input
function obtenerCantidadRayos() {
  const input = document.getElementById("cantidadRayosSol");
  if (!input) return totalRayosSol || 10;
  let val = parseInt(input.value, 10);
  if (isNaN(val) || val < 2) val = 2;
  if (val > 30) val = 30;
  totalRayosSol = val;
  input.value = val;
  return totalRayosSol;
}

// Variables de estadísticas y cronómetro (por cada Sol)
let cronometroSolInterval = null;
let tiempoSegundosSol = 0;
let aciertosSol = 0;
let erroresSol = 0;
let rayosConFallo = new Set();

function formatearTiempoSol(segundos) {
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function actualizarStatsSol() {
  const statsSec = document.getElementById("statsSectionSol");
  if (statsSec) statsSec.style.display = "flex";

  const tiempoEl = document.getElementById("cronometroTiempoSol");
  const aciertosEl = document.getElementById("contadorAciertosSol");
  const erroresEl = document.getElementById("contadorErroresSol");

  if (tiempoEl) tiempoEl.textContent = formatearTiempoSol(tiempoSegundosSol);
  if (aciertosEl) aciertosEl.textContent = aciertosSol;
  if (erroresEl) erroresEl.textContent = erroresSol;
}

function iniciarCronometroSol() {
  if (cronometroSolInterval) {
    clearInterval(cronometroSolInterval);
  }
  tiempoSegundosSol = 0;
  aciertosSol = 0;
  erroresSol = 0;
  rayosConFallo.clear();

  const statsSec = document.getElementById("statsSectionSol");
  if (statsSec) statsSec.style.display = "flex";

  actualizarStatsSol();

  cronometroSolInterval = setInterval(() => {
    tiempoSegundosSol++;
    const tiempoEl = document.getElementById("cronometroTiempoSol");
    if (tiempoEl) {
      tiempoEl.textContent = formatearTiempoSol(tiempoSegundosSol);
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const inputRayos = document.getElementById("cantidadRayosSol");
  if (inputRayos) {
    inputRayos.addEventListener("change", () => {
      obtenerCantidadRayos();
      construirSol(numeroCentroSol);
    });
    inputRayos.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        obtenerCantidadRayos();
        construirSol(numeroCentroSol);
      }
    });
  }
  generarSolAleatorio();
});

// Cambia entre Modo Guiado y Modo Libre
function cambiarModoSol(nuevoModo) {
  modoActualSol = nuevoModo;
  document.getElementById("btnModoGuiado")?.classList.toggle("active", nuevoModo === "guiado");
  document.getElementById("btnModoLibre")?.classList.toggle("active", nuevoModo === "libre");

  // Reconstruir el sol actual con el número activo
  construirSol(numeroCentroSol);
}

// Genera un número aleatorio según el nivel seleccionado
function generarSolAleatorio() {
  const nivel = document.getElementById("nivelSol")?.value || "2";
  let min = 10,
    max = 20;

  switch (nivel) {
    case "1":
      min = 4;
      max = 10;
      break;
    case "2":
      min = 11;
      max = 20;
      break;
    case "3":
      min = 21;
      max = 50;
      break;
    case "4":
      min = 51;
      max = 100;
      break;
    case "5":
      min = 101;
      max = 500;
      break;
    case "6":
      min = 501;
      max = 1000;
      break;
    default:
      min = 10;
      max = 20;
  }

  numeroCentroSol = Math.floor(Math.random() * (max - min + 1)) + min;
  construirSol(numeroCentroSol);
}

// Muestra u oculta el panel para introducir número personalizado
function toggleInputPersonalizadoSol() {
  const panel = document.getElementById("customSolContainer");
  if (!panel) return;
  panel.style.display =
    panel.style.display === "none" || panel.style.display === "" ? "flex" : "none";
}

// Genera un sol con el número elegido por el usuario
function generarSolPersonalizado() {
  const input = document.getElementById("inputNumeroSol");
  const val = parseInt(input?.value, 10);
  if (isNaN(val) || val < 2) {
    alert("Por favor, introduce un número mayor o igual a 2 para el centro del Sol.");
    return;
  }
  numeroCentroSol = val;
  document.getElementById("customSolContainer").style.display = "none";
  construirSol(numeroCentroSol);
}

// Construye los rayos del sol según el modo activo y la cantidad configurada
function construirSol(target) {
  totalRayosSol = obtenerCantidadRayos();
  rayosCompletados = 0;
  expresionesUsadasLibre.clear();
  rayosData = [];

  document.getElementById("sunTargetNumber").textContent = target;
  document.getElementById("sunFace").textContent = "😊";
  document.getElementById("sunCore").classList.remove("sun-complete");
  document.getElementById("solMensajeFinal").style.display = "none";
  document.getElementById("solStage").style.display = "block";
  document.getElementById("solProgressWrap").style.display = "block";

  const tipEl = document.getElementById("solHelperTip");
  if (tipEl) {
    tipEl.innerHTML =
      modoActualSol === "guiado"
        ? `<i class="fa-solid fa-circle-info"></i> Escribe en cada casilla el número que falta para que la operación dé <strong>${target}</strong>.`
        : `<i class="fa-solid fa-wand-magic-sparkles"></i> Escribe <strong>${totalRayosSol}</strong> operaciones distintas (ej: <strong>${Math.max(1, target - 3)}+3</strong>, <strong>${target + 5}-5</strong>) que den <strong>${target}</strong>.`;
  }

  if (modoActualSol === "guiado") {
    rayosData = generarPromptsGuiados(target, totalRayosSol);
  } else {
    for (let i = 0; i < totalRayosSol; i++) {
      rayosData.push({
        index: i,
        solved: false
      });
    }
  }

  renderizarRayos();
  actualizarProgresoSol();
  iniciarCronometroSol();
}

// Genera retos guiados variados (sumas, restas, sumas dobles) cuyo resultado es `target`
function generarPromptsGuiados(target, cantidad) {
  const prompts = [];
  const usados = new Set();

  for (let i = 0; i < cantidad; i++) {
    let promptObj = null;
    let intentos = 0;

    while (!promptObj && intentos < 80) {
      intentos++;
      const tipo = (i + intentos) % 4; // 0: a + [?], 1: [?] + b, 2: c - [?], 3: a + b + [?]

      if (tipo === 0) {
        if (target > 1) {
          const a = Math.floor(Math.random() * (target - 1)) + 1;
          const ans = target - a;
          const key = `add1_${a}`;
          if (!usados.has(key)) {
            usados.add(key);
            promptObj = {
              prefix: `${a} +`,
              suffix: "",
              expected: ans
            };
          }
        }
      } else if (tipo === 1) {
        if (target > 1) {
          const b = Math.floor(Math.random() * (target - 1)) + 1;
          const ans = target - b;
          const key = `add2_${b}`;
          if (!usados.has(key)) {
            usados.add(key);
            promptObj = {
              prefix: "",
              suffix: `+ ${b}`,
              expected: ans
            };
          }
        }
      } else if (tipo === 2) {
        const extra = Math.floor(Math.random() * Math.max(5, Math.min(30, target))) + intentos;
        const c = target + extra;
        const key = `sub_${c}`;
        if (!usados.has(key)) {
          usados.add(key);
          promptObj = {
            prefix: `${c} -`,
            suffix: "",
            expected: extra
          };
        }
      } else {
        if (target >= 4) {
          const a = Math.max(1, Math.floor(target / 3));
          const b = Math.floor(Math.random() * (target - a - 1)) + 1;
          const ans = target - a - b;
          const key = `triple_${a}_${b}`;
          if (ans > 0 && !usados.has(key)) {
            usados.add(key);
            promptObj = {
              prefix: `${a} + ${b} +`,
              suffix: "",
              expected: ans
            };
          }
        }
      }
    }

    // Fallback garantizado y siempre único (mediante resta)
    if (!promptObj) {
      const extra = i + 1;
      promptObj = {
        prefix: `${target + extra} -`,
        suffix: "",
        expected: extra
      };
    }

    prompts.push({
      index: i,
      ...promptObj,
      solved: false
    });
  }

  return prompts;
}

// Renderiza los rayos alrededor del sol (distribuidos entre izquierda y derecha)
function renderizarRayos() {
  const leftContainer = document.getElementById("raysLeft");
  const rightContainer = document.getElementById("raysRight");
  leftContainer.innerHTML = "";
  rightContainer.innerHTML = "";

  const mitad = Math.ceil(totalRayosSol / 2);

  rayosData.forEach((rayo, idx) => {
    const rayCard = document.createElement("div");
    rayCard.className = "ray-card";
    rayCard.id = `ray_card_${idx}`;

    if (modoActualSol === "guiado") {
      rayCard.innerHTML = `
        <span class="ray-badge"><i class="fa-solid fa-sun"></i> ${idx + 1}</span>
        <div class="ray-operation">
          ${rayo.prefix ? `<span class="ray-text">${rayo.prefix}</span>` : ""}
          <input
            type="tel"
            inputmode="numeric"
            class="ray-input ray-input-guided"
            id="ray_input_${idx}"
            placeholder="?"
            autocomplete="off"
            aria-label="Rayo ${idx + 1}"
          />
          ${rayo.suffix ? `<span class="ray-text">${rayo.suffix}</span>` : ""}
        </div>
        <span class="ray-status" id="ray_status_${idx}"></span>
      `;
    } else {
      const placeholderText =
        idx === 0 ? `Ej: ${Math.max(1, numeroCentroSol - 1)}+1` : "";
      rayCard.innerHTML = `
        <span class="ray-badge"><i class="fa-solid fa-sun"></i> ${idx + 1}</span>
        <div class="ray-operation ray-operation-free">
          <input
            type="text"
            class="ray-input ray-input-free"
            id="ray_input_${idx}"
            placeholder="${placeholderText}"
            autocomplete="off"
            aria-label="Escribe una operación para el rayo ${idx + 1}"
          />
        </div>
        <span class="ray-status" id="ray_status_${idx}"></span>
      `;
    }

    if (idx < mitad) {
      leftContainer.appendChild(rayCard);
    } else {
      rightContainer.appendChild(rayCard);
    }

    const inputEl = rayCard.querySelector("input");
    if (modoActualSol === "guiado") {
      inputEl.addEventListener("input", () => validarRayoGuiado(idx, false));
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          validarRayoGuiado(idx, true);
        }
      });
      inputEl.addEventListener("blur", () => {
        if (inputEl.value.trim() !== "" && !inputEl.disabled) {
          validarRayoGuiado(idx, true);
        }
      });
    } else {
      inputEl.addEventListener("input", () => validarRayoLibre(idx, false));
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          validarRayoLibre(idx, true);
        }
      });
      inputEl.addEventListener("blur", () => {
        if (inputEl.value.trim() !== "" && !inputEl.disabled) {
          validarRayoLibre(idx, true);
        }
      });
    }
  });

  // Enfocar el primer rayo
  setTimeout(() => {
    document.getElementById("ray_input_0")?.focus();
  }, 50);
}

// Valida un rayo en Modo Guiado
function validarRayoGuiado(idx, forzar = false) {
  const rayo = rayosData[idx];
  const inputEl = document.getElementById(`ray_input_${idx}`);
  const statusEl = document.getElementById(`ray_status_${idx}`);
  const cardEl = document.getElementById(`ray_card_${idx}`);
  if (!rayo || rayo.solved || !inputEl) return;

  const valStr = inputEl.value.trim();
  if (valStr === "") {
    inputEl.classList.remove("correcto", "incorrecto");
    statusEl.innerHTML = "";
    return;
  }

  const valNum = parseInt(valStr, 10);
  if (valNum === rayo.expected) {
    marcarRayoCompletado(idx, inputEl, statusEl, cardEl);
  } else {
    // Si aún no ha completado las cifras que requiere la solución y no se ha forzado comprobación
    const expStr = String(rayo.expected);
    const faltanCifras = valStr.length < expStr.length;

    if (!forzar && faltanCifras) {
      inputEl.classList.remove("correcto", "incorrecto");
      statusEl.innerHTML = "";
    } else {
      inputEl.classList.add("incorrecto");
      inputEl.classList.remove("correcto");
      statusEl.innerHTML = `<i class="fa-solid fa-xmark" style="color:#c62828;"></i>`;
      if (!rayosConFallo.has(idx)) {
        erroresSol++;
        rayosConFallo.add(idx);
        actualizarStatsSol();
      }
    }
  }
}

// Evalúa de forma segura una expresión aritmética escrita por el niño (+, -, *, x, ×, /, :)
function evaluarExpresionSegura(rawStr) {
  // Normalizar símbolos de multiplicación y división
  const clean = rawStr
    .replace(/\s+/g, "")
    .replace(/[xX×·]/g, "*")
    .replace(/[:÷]/g, "/");

  // Debe contener al menos un operador y solo dígitos y operadores básicos
  if (!/^[0-9]+([+\-*/][0-9]+)+$/.test(clean)) {
    return { validSyntax: false, value: null, normalized: clean };
  }

  // Tokenizar números y operadores respetando precedencia de * y /
  const tokens = clean.match(/[0-9]+|[+\-*/]/g);
  if (!tokens || tokens.length < 3) {
    return { validSyntax: false, value: null, normalized: clean };
  }

  // 1ª pasada: * y /
  const pass1 = [parseFloat(tokens[0])];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const nextNum = parseFloat(tokens[i + 1]);
    if (op === "*") {
      pass1[pass1.length - 1] = pass1[pass1.length - 1] * nextNum;
    } else if (op === "/") {
      if (nextNum === 0) return { validSyntax: false, value: null, normalized: clean };
      pass1[pass1.length - 1] = pass1[pass1.length - 1] / nextNum;
    } else {
      pass1.push(op, nextNum);
    }
  }

  // 2ª pasada: + y -
  let result = pass1[0];
  for (let i = 1; i < pass1.length; i += 2) {
    const op = pass1[i];
    const num = pass1[i + 1];
    if (op === "+") result += num;
    else if (op === "-") result -= num;
  }

  return {
    validSyntax: true,
    value: result,
    normalized: clean
  };
}

// Valida un rayo en Modo Libre
function validarRayoLibre(idx, forzarFeedback) {
  const rayo = rayosData[idx];
  const inputEl = document.getElementById(`ray_input_${idx}`);
  const statusEl = document.getElementById(`ray_status_${idx}`);
  const cardEl = document.getElementById(`ray_card_${idx}`);
  const tipEl = document.getElementById("solHelperTip");
  if (!rayo || rayo.solved || !inputEl) return;

  const valStr = inputEl.value.trim();
  if (valStr === "") {
    inputEl.classList.remove("correcto", "incorrecto");
    statusEl.innerHTML = "";
    return;
  }

  const evalRes = evaluarExpresionSegura(valStr);

  if (evalRes.validSyntax && evalRes.value === numeroCentroSol) {
    // Verificar que no haya repetido exactamente la misma operación
    if (expresionesUsadasLibre.has(evalRes.normalized)) {
      inputEl.classList.add("incorrecto");
      statusEl.innerHTML = `<i class="fa-solid fa-repeat" style="color:#ef6c00;" title="Operación repetida"></i>`;
      if (tipEl) {
        tipEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#ef6c00;"></i> ¡Ya has usado <strong>${evalRes.normalized}</strong> en otro rayo! Inventa otra combinación distinta.`;
      }
      if (!rayosConFallo.has(idx)) {
        erroresSol++;
        rayosConFallo.add(idx);
        actualizarStatsSol();
      }
      return;
    }

    expresionesUsadasLibre.add(evalRes.normalized);
    if (tipEl) {
      tipEl.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ¡Genial! <strong>${evalRes.normalized} = ${numeroCentroSol}</strong>. Sigue iluminando los demás rayos.`;
    }
    marcarRayoCompletado(idx, inputEl, statusEl, cardEl);
  } else if (forzarFeedback) {
    inputEl.classList.add("incorrecto");
    inputEl.classList.remove("correcto");
    statusEl.innerHTML = `<i class="fa-solid fa-xmark" style="color:#c62828;"></i>`;
    if (!rayosConFallo.has(idx)) {
      erroresSol++;
      rayosConFallo.add(idx);
      actualizarStatsSol();
    }
    if (tipEl) {
      if (!evalRes.validSyntax) {
        tipEl.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color:#c62828;"></i> Escribe una operación como <strong>${Math.max(1, numeroCentroSol - 2)}+2</strong> o <strong>${numeroCentroSol + 5}-5</strong>.`;
      } else {
        tipEl.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color:#c62828;"></i> Esa operación da <strong>${evalRes.value}</strong> y necesitamos que dé <strong>${numeroCentroSol}</strong>.`;
      }
    }
  } else {
    inputEl.classList.remove("correcto", "incorrecto");
    statusEl.innerHTML = "";
  }
}

// Marca un rayo como resuelto, actualiza el sol y pasa el foco al siguiente rayo
function marcarRayoCompletado(idx, inputEl, statusEl, cardEl) {
  rayosData[idx].solved = true;
  rayosCompletados++;
  aciertosSol++;
  rayosConFallo.delete(idx);
  actualizarStatsSol();

  inputEl.classList.remove("incorrecto");
  inputEl.classList.add("correcto");
  inputEl.disabled = true;
  cardEl.classList.add("ray-solved");
  statusEl.innerHTML = `<i class="fa-solid fa-check" style="color:#2e7d32;"></i>`;

  actualizarProgresoSol();

  // Si aún quedan rayos por resolver, enfocar el siguiente disponible
  if (rayosCompletados < totalRayosSol) {
    for (let step = 1; step <= totalRayosSol; step++) {
      const nextIdx = (idx + step) % totalRayosSol;
      if (!rayosData[nextIdx].solved) {
        setTimeout(() => {
          document.getElementById(`ray_input_${nextIdx}`)?.focus();
        }, 60);
        break;
      }
    }
  } else {
    // ¡Todos los rayos iluminados!
    if (cronometroSolInterval) {
      clearInterval(cronometroSolInterval);
      cronometroSolInterval = null;
    }
    document.getElementById("sunFace").textContent = "😎";
    document.getElementById("sunCore").classList.add("sun-complete");
    const finalEl = document.getElementById("solMensajeFinal");
    const resEl = document.getElementById("solResumenFinal");
    if (resEl) {
      resEl.innerHTML = `¡Fantástico! Has encendido los <strong>${totalRayosSol} rayos</strong> del Sol del número <strong>${numeroCentroSol}</strong> en <strong>${formatearTiempoSol(tiempoSegundosSol)}</strong> con <strong>${erroresSol} fallo(s)</strong>.`;
    }
    if (finalEl) {
      finalEl.style.display = "block";
      finalEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    lanzarConfetiSol();
  }
}

function actualizarProgresoSol() {
  const txtEl = document.getElementById("solProgressText");
  const fillEl = document.getElementById("solProgressFill");
  const faceEl = document.getElementById("sunFace");

  if (txtEl) {
    txtEl.textContent = `${rayosCompletados} de ${totalRayosSol}`;
  }
  if (fillEl) {
    const pct = Math.round((rayosCompletados / totalRayosSol) * 100);
    fillEl.style.width = `${pct}%`;
  }
  if (faceEl && rayosCompletados < totalRayosSol) {
    const ratio = rayosCompletados / totalRayosSol;
    if (ratio === 0) faceEl.textContent = "😊";
    else if (ratio < 0.4) faceEl.textContent = "😄";
    else if (ratio < 0.8) faceEl.textContent = "🤩";
    else faceEl.textContent = "🥳";
  }
}

function lanzarConfetiSol() {
  let canvas = document.getElementById("confettiCanvasSol");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "confettiCanvasSol";
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colores = ["#ffb300", "#ffca28", "#ff7043", "#673ab7", "#4caf50", "#29b6f6"];
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


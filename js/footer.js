// footer.js

document.addEventListener("DOMContentLoaded", () => {
    const footer = document.createElement("footer");
    footer.innerHTML = `
      <span>Proyecto educativo y sin ánimo de lucro · Creado por <strong>Fran Tirado</strong></span>
      <span class="footer-divider" aria-hidden="true">·</span>
      <a href="https://github.com/Fran2009/abnmatematicas/" target="_blank" rel="noopener" aria-label="Código fuente del proyecto en GitHub">
        <i class="fab fa-github"></i> GitHub
      </a>
    `;
    document.body.appendChild(footer);
});
  
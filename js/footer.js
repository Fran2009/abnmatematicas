// footer.js

document.addEventListener("DOMContentLoaded", () => {
    const footer = document.createElement("footer");
    footer.innerHTML = `
      Web creada por Fran Tirado · 
      <a href="https://github.com/Fran2009" target="_blank" aria-label="GitHub">
        <i class="fab fa-github"></i> GitHub
      </a>
    `;
    document.body.appendChild(footer);
  });
  
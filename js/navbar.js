// navbar.js

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <div class="navbar-container">
      <span class="brand">Método ABN</span>
      <button class="menu-toggle" aria-label="Abrir menú">
        <i class="fas fa-bars"></i>
      </button>
      <ul class="nav-links">
        <li><a href="index.html">Inicio</a></li>
        <li><a href="numeracion.html">Numeración y Conteo</a></li>
        <li><a href="casita.html">Casita de Descomposición</a></li>
        <li><a href="rejilla.html">Rejilla</a></li>
        <li><a href="videos.html">Vídeos de Ejemplos</a></li>
      </ul>
    </div>
  `;
  document.body.prepend(nav);

  // Lógica para abrir/cerrar el menú
  const toggleButton = nav.querySelector(".menu-toggle");
  const navLinks = nav.querySelector(".nav-links");

  toggleButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});

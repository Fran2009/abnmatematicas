// navbar.js

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const links = [
    { href: "index.html", label: "Inicio", icon: "fa-solid fa-house" },
    { href: "numeracion.html", label: "Numeración", icon: "fa-solid fa-table-cells" },
    { href: "casita.html", label: "Casita", icon: "fa-solid fa-house-chimney-window" },
    { href: "soles.html", label: "Soles ABN", icon: "fa-solid fa-sun" },
    { href: "rejilla.html", label: "Rejilla", icon: "fa-solid fa-border-all" },
    { href: "multiplicaciones.html", label: "Multiplicar", icon: "fa-solid fa-xmark" },
    { href: "videos.html", label: "Vídeos", icon: "fa-solid fa-circle-play" }
  ];

  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <div class="navbar-container">
      <a href="index.html" class="brand">
        <span class="brand-badge"><i class="fa-solid fa-shapes"></i></span>
        <span>Método ABN</span>
      </a>
      <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false">
        <i class="fas fa-bars"></i>
      </button>
      <ul class="nav-links">
        ${links
          .map(
            (item) => `
          <li>
            <a href="${item.href}" class="${currentPage === item.href ? "active-page" : ""}">
              <i class="${item.icon}"></i>
              <span>${item.label}</span>
            </a>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `;
  document.body.prepend(nav);

  // Lógica para abrir/cerrar el menú en móvil
  const toggleButton = nav.querySelector(".menu-toggle");
  const navLinks = nav.querySelector(".nav-links");
  const toggleIcon = toggleButton.querySelector("i");

  toggleButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    toggleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (toggleIcon) {
      toggleIcon.className = isOpen ? "fas fa-times" : "fas fa-bars";
    }
  });
});

# Método ABN - Recursos Educativos

Este es un proyecto educativo y sin ánimo de lucro, desarrollado para facilitar el aprendizaje del **Método ABN (Algoritmos Basados en Números)** mediante recursos visuales, modernos y prácticos para alumnos, docentes y familias.

## 📚 ¿Qué es el Método ABN?

El método ABN es una forma alternativa de enseñar matemáticas basada en la descomposición flexible de números, el cálculo mental y el razonamiento. Fue creado por **Jaime Martínez Montero**, inspector de educación y especialista en didáctica de las matemáticas.

## 🧩 Contenidos disponibles

- **Numeración y Conteo:** Juegos y ejercicios sobre la tabla del 100 para trabajar la estructura numérica con sumas y restas.
- **Casita de Descomposición:** Actividad visual para descomponer números en órdenes de magnitud y sumandos.
- **Los Soles ABN:** Descomposición y cálculo flexible iluminando los rayos alrededor del número central del sol (por defecto 10 rayos, configurable a más o menos, con **Modo Guiado** para completar huecos y **Modo Libre** para inventar operaciones propias).
- **La Rejilla ABN:** Herramienta interactiva guiada paso a paso con ejemplos visuales resueltos, cabeceras descriptivas y pistas en vivo para practicar:
  - **Operaciones Básicas:** Suma y Resta por detracción.
  - **Comparación, Escaleras e Igualación ABN:** Escalera Ascendente, Escalera Descendente, Igualación y Detracción con Comparación.
  - **Operaciones de 3 Números:** Doble Suma, Doble Resta y Sumirresta.
- **Multiplicaciones:** Práctica configurable de tablas de multiplicar (todas las combinaciones sin repetición o un número determinado de preguntas) con cronómetro, aciertos y fallos interactivos.
- **Vídeos de Ejemplos:** Enlaces a recursos audiovisuales para aprender el método paso a paso.

## 🌐 Estructura del Proyecto

```text
├── css/
│   ├── casita.css              # Estilos de la casita de descomposición
│   ├── cookie-modal.css        # Estilos de la librería de cookies
│   ├── footer.css              # Estilos del pie de página
│   ├── index.css               # Estilos de la página principal con tarjetas interactivas
│   ├── multiplicaciones.css    # Estilos de la práctica de multiplicaciones
│   ├── navbar.css              # Estilos de la barra de navegación adaptable
│   ├── numeracion.css          # Estilos de la página de numeración y conteo
│   ├── rejilla.css             # Estilos de la rejilla ABN y selector visual de operaciones
│   ├── soles.css               # Estilos de la actividad de Los Soles ABN
│   ├── theme.css               # Sistema de diseño global (tipografía infantil, colores y componentes)
│   └── video.css               # Estilos de la galería de vídeos
├── js/
│   ├── analytics.js            # Scripts para el funcionamiento de Google Analytics
│   ├── casita.js               # Lógica de la casita de descomposición
│   ├── cookie-modal.js         # Toda la lógica para la gestión de cookies
│   ├── footer.js               # Pie de página con autor e icono de GitHub
│   ├── multiplicaciones.js     # Lógica de la práctica de multiplicaciones
│   ├── navbar.js               # Menú de navegación insertado dinámicamente
│   ├── numeracion.js           # Lógica de la página numeración y conteo
│   ├── rejilla.js              # Lógica de sumas, restas, escaleras, igualación, comparación y triples en rejilla
│   └── soles.js                # Lógica de Los Soles ABN (modo guiado y modo libre)
├── casita.html                 # Casita de descomposición
├── index.html                  # Página principal con tarjetas de acceso a las secciones
├── multiplicaciones.html       # Práctica de multiplicaciones
├── numeracion.html             # Actividades de numeración
├── rejilla.html                # Método de la rejilla ABN
├── soles.html                  # Actividad de Los Soles ABN
└── videos.html                 # Galería de vídeos educativos
```

## 🔧 Tecnologías utilizadas

- HTML5 + CSS3 (Diseño moderno y adaptable a dispositivos móviles)
- JavaScript (Vanilla)
- Google Fonts (`Fredoka` y `Nunito`) y Font Awesome para iconos
- Librería [cookie-GDPR-CCPA](https://github.com/Fran2009/cookie-GDPR-CCPA) (modificada)

## 🚀 Cómo usar

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Fran2009/abnmatematicas.git
   ```

2. Para la gestión de cookies, ya está incluida la librería `cookie-GDPR-CCPA`, personalizada para este proyecto. También puedes obtenerla desde:

   ```bash
   git clone https://github.com/Fran2009/cookie-GDPR-CCPA.git
   ```

3. Ya solo quedaría abrir el `index.html` en tu navegador.

## 🤝 Contribuciones

¡Toda ayuda es bienvenida! Si tienes ideas para nuevas actividades o mejoras, puedes abrir un issue o pull request.

## 🧑‍💻 Autor

Web creada por **Fran Tirado**  
[https://github.com/Fran2009](https://github.com/Fran2009)

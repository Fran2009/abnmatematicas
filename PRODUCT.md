# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Alumnos de Educación Infantil y Primaria:** Estudiantes que aprenden o practican el cálculo matemático y la descomposición numérica. Necesitan interfaces comprensibles, amigables, visuales y con retroalimentación inmediata sin frustración.
- **Docentes de Matemáticas:** Maestros que utilizan las herramientas en el aula (mediante pizarra digital interactiva, ordenadores o tablets escolares) para ilustrar y practicar algoritmos ABN.
- **Familias:** Madres y padres que acompañan a sus hijos en casa en el repaso y consolidación de la metodología ABN.

## Product Purpose

Proporcionar una suite de herramientas interactivas, visuales, gratuitas y accesibles directamente en el navegador web para el aprendizaje práctico del Método ABN (Algoritmos Basados en Números). El éxito significa que cualquier alumno pueda practicar de manera autónoma, razonada y sin miedo al error, comprendiendo el sentido numérico en lugar del cálculo mecánico tradicional.

## Positioning

Recursos didácticos interactivos fieles al rigor metodológico del Método ABN desarrollado por Jaime Martínez Montero, que combinan flexibilidad de cálculo, descomposición visual y retroalimentación inmediata sin registros obligatorios, sin publicidad intrusiva y sin barreras de instalación.

## Operating Context

- **Entornos:** Aulas de colegios (pizarras digitales interactivas, tablets, ordenadores de aula), escritorios domésticos y dispositivos móviles o tablets en casa.
- **Rituales didácticos:** Sesiones de cálculo mental diario, resolución colaborativa de operaciones guiadas o libres, preparación de pruebas y práctica autónoma con cronómetro.
- **Integraciones técnicas:** Ejecución en navegador estándar (Google Chrome, Firefox, Safari, Edge) o servidor local (XAMPP/Apache), con Google Analytics opcional y banner de cookies GDPR/CCPA.

## Capabilities and Constraints

- **Capacidades funcionales:**
  - *Numeración y Conteo:* Exploración de la tabla del 100 con dinámicas de suma, resta y localización espacial numérica.
  - *Casita de Descomposición:* Desglose de números en órdenes de magnitud (centenas, decenas, unidades) y sumandos libres.
  - *Los Soles ABN:* Descomposición radial en torno a un número central con selector de número de rayos y modos guiado y libre.
  - *La Rejilla ABN:* Asistente paso a paso de rejilla para operaciones básicas (suma, resta por detracción), comparación/escaleras/igualación, y operaciones de 3 números (doble suma, doble resta, sumirresta).
  - *Multiplicaciones:* Práctica por tablas/rangos o grupos personalizados, con cronómetro, estadísticas de aciertos/fallos y validación interactiva.
  - *Galería de Vídeos:* Recursos audiovisuales enlazados para aprender la metodología.
- **Restricciones técnicas:**
  - Código en Vanilla JavaScript, HTML5 y CSS3 puro; sin bundlers ni frameworks SPA pesados (garantiza ligereza, portabilidad y ejecución directa).
  - Sin dependencias de backend obligatorias; toda la lógica matemática y de estado se procesa en el cliente.
  - Licencia de software libre y código abierto bajo repositorio público.

## Brand Commitments

- **Nombre:** Método ABN - Recursos Educativos (`abnmatematicas`).
- **Autoría:** Fran Tirado (proyecto sin ánimo de lucro y con contribución comunitaria abierta).
- **Voz y tono:** Didáctico, cercano, motivador, claro y respetuoso con la terminología pedagógica ABN.
- **Identidad visual existente:** Tipografías legibles y amigables para niños (`Fredoka` para titulares/botones y `Nunito` para lectura), paletas de colores diferenciadas por tipo de actividad y componentes claros y táctiles.

## Evidence on Hand

- Código fuente completo con actividades implementadas: `index.html`, `casita.html`, `multiplicaciones.html`, `numeracion.html`, `rejilla.html`, `soles.html`, `videos.html`.
- Sistema de estilos centralizado en `css/theme.css` junto a hojas de estilo modulares por actividad en `css/`.
- Lógica pedagógica en JavaScript modular en `js/`.
- Documentación de proyecto en `README.md`.

## Product Principles

1. **Rigor Pedagógico ABN:** Respetar fielmente la didáctica y conceptos del Método ABN (descomposición libre, transparencia algorítmica, cálculo con sentido).
2. **Fricción Cero:** Acceso instantáneo en cualquier navegador sin necesidad de crear cuenta, descargar aplicaciones ni configurar entornos complejos.
3. **Retroalimentación Constructiva:** Proporcionar pistas, validaciones visuales y estadísticas de progreso sin penalización destructiva, reforzando la confianza del estudiante.
4. **Claridad y Usabilidad Infantil:** Interfaz limpia, elementos táctiles de tamaño generoso y textos directos adaptados a niños en edad escolar.


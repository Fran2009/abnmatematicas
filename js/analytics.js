// js/analytics.js - Bloqueo previo estricto de Google Analytics (Conforme AEPD / RGPD)

const GA_MEASUREMENT_ID = 'X-XXXXXXXXX';

function hasAnalyticsConsent() {
  const cookies = document.cookie.split(';');
  return cookies.some((c) => {
    const trimmed = c.trim();
    return (
      trimmed === 'performanceCookies=enabled' ||
      trimmed === 'advertisingCookies=enabled'
    );
  });
}

function loadGoogleAnalytics() {
  // Si no hay consentimiento explícito, NO conectar con Google bajo ningún concepto
  if (!hasAnalyticsConsent()) return;

  // Evitar inyección duplicada si ya se cargó
  if (document.getElementById('google-analytics-gtag')) return;

  // 1. Inyectar dinámicamente el script de Google Tag
  const scriptTag = document.createElement('script');
  scriptTag.id = 'google-analytics-gtag';
  scriptTag.async = true;
  scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(scriptTag);

  // 2. Inicializar dataLayer y configuración
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

// Al cargar la página, solo si el usuario ya tenía aceptadas las cookies previamente
document.addEventListener('DOMContentLoaded', loadGoogleAnalytics);

// Exponer la función para que el modal de cookies la invoque al pulsar "Aceptar"
window.loadGoogleAnalytics = loadGoogleAnalytics;


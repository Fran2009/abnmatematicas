// js/analytics.js

function hasAdvertisingConsent() {
  return document.cookie.split(';').some(cookie => cookie.trim() === 'advertisingCookies=enabled');
}

function loadGoogleAnalytics() {
  if (!hasAdvertisingConsent()) return;

  // Inserta el script de GA
  const scriptTag = document.createElement('script');
  scriptTag.async = true;
  scriptTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // Sustituye con tu ID real
  document.head.appendChild(scriptTag);

  // Configura gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX'); // Sustituye con tu ID real
}

document.addEventListener("DOMContentLoaded", loadGoogleAnalytics);
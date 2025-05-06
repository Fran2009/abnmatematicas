(function (window) {
    let initialized = false; // Variable para comprobar si ya se ha inicializado

    // Configuración por defecto
    const defaultConfig = {
        language: 'es', // Idioma por defecto
        availableLanguages: ['es'], // Idiomas qu se muestran en el select
        texts: null // Textos personalizados (null por defecto)
    };

    // Textos por defecto en varios idiomas 
    const defaultTexts = {
        es: {
            title: "Centro de Preferencias de Cookies",
            privacyTitle: "Tu privacidad es importante para nosotros",
            privacyText: "Usamos cookies propias y de terceros con fines analíticos. Puedes aceptar todas las cookies o configurarlas según tus preferencias.",

            strictCookiesTitle: "Cookies estrictamente necesarias",
            strictCookiesText: "Estas cookies son necesarias para que el sitio funcione correctamente y no se pueden desactivar. No almacenan información personal identificable.",

            performanceCookiesTitle: "Cookies de análisis y rendimiento",
            performanceCookiesText: "Estas cookies nos permiten contar las visitas y fuentes de tráfico, para poder medir y mejorar el rendimiento de nuestro sitio. Toda la información recogida por estas cookies es agregada y por tanto anónima. Usamos Google Analytics para este fin.",

            moreInfoTitle: "Más información",
            moreInfoText: "Puedes obtener más información sobre cómo usamos las cookies y cómo desactivarlas consultando nuestra política de cookies o escribiéndonos a nuestro correo de contacto.",

            savePreferences: "Guardar mis preferencias",
            acceptAllCookies: "Aceptar todas las cookies",
            rejectCookiesMessage: "¿Desea rechazar las cookies?",
            rejectCookies: "Sí, rechazar",
            returnToCookies: "Volver a cookies"
        },

    };

    // Inicialización del módulo con los parámetros
    window.initCookieModal = function (userConfig = {}) {
        if (initialized) return; // Evitar inicialización múltiple
        initialized = true;

        const config = Object.assign({}, defaultConfig, userConfig);
        let currentLanguage = config.language;

        // Obtener los textos finales
        function mergeTextsWithDefaults(language) {
            const currentTexts = defaultTexts[language] || {};
            const finalTexts = {};

            // Siempre incluir languageLabel, title, privacyTitle y privacyText
            finalTexts.languageLabel = currentTexts.languageLabel;
            finalTexts.title = currentTexts.title;
            finalTexts.privacyTitle = currentTexts.privacyTitle;
            finalTexts.privacyText = currentTexts.privacyText;

            // Si no se configuran textos adicionales, mostrar todos los textos por defecto
            if (!config.texts) {
                return currentTexts;
            }

            // Si se configuran textos, generar los textos finales
            Object.keys(currentTexts).forEach((key) => {
                if (config.texts[key] !== undefined || config.texts[key] === true) {
                    finalTexts[key] = currentTexts[key];

                    // Incluir el texto correspondiente 
                    if (key.endsWith('Title')) {
                        const textKey = key.replace('Title', 'Text');
                        finalTexts[textKey] = currentTexts[textKey];
                    }
                }
            });

            return finalTexts;
        }

        // Generar dinámicamente el selector de idioma
        function generateLanguageSelect() {
            return `
                <label for="language-select" id="language-label">${defaultTexts[currentLanguage].languageLabel}:</label>
                <select id="language-select">
                    ${config.availableLanguages.map(lang => `
                        <option value="${lang}" ${lang === currentLanguage ? 'selected' : ''}>${getLanguageName(lang)}</option>
                    `).join('')}
                </select>
            `;
        }

        // Obtener el nombre del idioma para mostrar en el selector
        function getLanguageName(lang) {
            const languageNames = {
                es: 'Español',
                en: 'English',
                fr: 'Français'
            };
            return languageNames[lang] || lang;
        }

        // Función para crear cookies
        function setCookie(name, value, days) {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        // Función para eliminar cookies
        function deleteCookie(name) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        // Función para actualizar los textos en el modal según el idioma
        function updateTexts(language) {
            const finalTexts = mergeTextsWithDefaults(language);
            document.getElementById('language-label').textContent = finalTexts.languageLabel || '';
            document.querySelector('.cookie-header h2').textContent = finalTexts.title || '';
            document.querySelector('.cookie-body h3').textContent = finalTexts.privacyTitle || '';
            document.querySelector('.cookie-body p').textContent = finalTexts.privacyText || '';



            // Solo mostrar las secciones configuradas en el array 'texts'
            let sectionsHTML = '';
            if (finalTexts.strictCookiesTitle) {
                sectionsHTML += `
                    <h4 class="toggle-section" data-target="strict-cookies">${finalTexts.strictCookiesTitle}</h4>
                    <div class="toggle-content" id="strict-cookies">
                        <p>${finalTexts.strictCookiesText}</p>
                        <div class="toggle">
                            <input type="checkbox" id="strict-cookies-toggle" checked disabled>
                            <label for="strict-cookies-toggle"></label>
                        </div>
                    </div>
                `;
            }
            if (finalTexts.functionalityCookiesTitle) {
                sectionsHTML += `
                    <h4 class="toggle-section" data-target="functionality-cookies">${finalTexts.functionalityCookiesTitle}</h4>
                    <div class="toggle-content" id="functionality-cookies">
                        <p>${finalTexts.functionalityCookiesText}</p>
                        <div class="toggle">
                            <input type="checkbox" id="functionality-cookies-toggle">
                            <label for="functionality-cookies-toggle"></label>
                        </div>
                    </div>
                `;
            }
            if (finalTexts.performanceCookiesTitle) {
                sectionsHTML += `
                    <h4 class="toggle-section" data-target="performance-cookies">${finalTexts.performanceCookiesTitle}</h4>
                    <div class="toggle-content" id="performance-cookies">
                        <p>${finalTexts.performanceCookiesText}</p>
                        <div class="toggle">
                            <input type="checkbox" id="performance-cookies-toggle">
                            <label for="performance-cookies-toggle"></label>
                        </div>
                    </div>
                `;
            }
            if (finalTexts.advertisingCookiesTitle) {
                sectionsHTML += `
                    <h4 class="toggle-section" data-target="advertising-cookies">${finalTexts.advertisingCookiesTitle}</h4>
                    <div class="toggle-content" id="advertising-cookies">
                        <p>${finalTexts.advertisingCookiesText}</p>
                        <div class="toggle">
                            <input type="checkbox" id="advertising-cookies-toggle">
                            <label for="advertising-cookies-toggle"></label>
                        </div>
                    </div>
                `;
            }
            if (finalTexts.moreInfoTitle) {
                sectionsHTML += `
                    <h4 class="toggle-section" data-target="more-info">${finalTexts.moreInfoTitle}</h4>
                    <div class="toggle-content" id="more-info">
                        <p>${finalTexts.moreInfoText}</p>
                    </div>
                `;
            }
            document.querySelector('.cookie-options').innerHTML = sectionsHTML;

            // Siempre se muestra el botón de guardar preferencias
            document.getElementById('save-preferences').textContent = defaultTexts[currentLanguage].savePreferences;
            document.getElementById('accept-all-cookies').textContent = defaultTexts[currentLanguage].acceptAllCookies;
        }

        // Estructura del modal
        const modalHTML = `
        <div class="cookie-preferences-modal">
            <div class="cookie-preferences">
                <div class="cookie-header">
                    <h2></h2>
                    <button id="close-modal">✖</button>
                </div>
                <div class="cookie-body">
                    ${generateLanguageSelect()} <!-- Selector de idioma dinámico -->
                    <h3></h3>
                    <p></p>
                    <div class="cookie-options"></div> <!-- Secciones dinámicas -->
                </div>
                <div class="cookie-footer">
                    <button id="save-preferences"></button>
                    <button id="accept-all-cookies"></button> <!-- Botón de aceptar todas -->
                </div>
                <div class="footer-text"> <!-- Nuevo bloque con el texto solicitado -->
                        <span>Powerd by <a href="https://zonapp.es" target="_blank"><strong>ZonApp</strong></a></span>
                </div>
            </div>
        </div>`;


        // Insertar el modal y seleccionar el idioma por defecto
        document.getElementById('cookie-modal-container').innerHTML = modalHTML;
        updateTexts(currentLanguage);
        // Inicializar los toggles al cargar el modal
        initializeToggles();

        // Función para inicializar los toggles de las secciones
        function initializeToggles() {
            document.querySelectorAll('.toggle-section').forEach(function (header) {
                header.addEventListener('click', function () {
                    const targetId = header.getAttribute('data-target');
                    const targetContent = document.getElementById(targetId);

                    // Ocultar todas las secciones excepto la seleccionada
                    document.querySelectorAll('.toggle-content').forEach(function (content) {
                        if (content.id !== targetId) {
                            content.style.display = 'none';
                        }
                    });

                    // Mostrar u ocultar la sección seleccionada
                    if (targetContent.style.display === 'block') {
                        targetContent.style.display = 'none';
                    } else {
                        targetContent.style.display = 'block';
                    }
                });
            });
        }


        // Cambiar el idioma dinámicamente cuando el usuario selecciona otro idioma
        document.getElementById('language-select').addEventListener('change', function () {
            currentLanguage = this.value;
            updateTexts(currentLanguage);
            initializeToggles();  // Re-inicializar los toggles después de cambiar el idioma
        });

        // Función para guardar cookies basadas en los toggles activos
        document.getElementById('save-preferences').addEventListener('click', function () {
            // Guardar siempre la cookie de `strictCookies`
            setCookie('strictCookies', 'enabled', 30);

            // Guardar o eliminar otras cookies según el estado de los toggles
            const functionalityCookies = document.getElementById('functionality-cookies-toggle')?.checked;
            const performanceCookies = document.getElementById('performance-cookies-toggle')?.checked;
            const advertisingCookies = document.getElementById('advertising-cookies-toggle')?.checked;

            // Crear o eliminar cookies
            functionalityCookies ? setCookie('functionalityCookies', 'enabled', 30) : deleteCookie('functionalityCookies');
            performanceCookies ? setCookie('performanceCookies', 'enabled', 30) : deleteCookie('performanceCookies');
            advertisingCookies ? setCookie('advertisingCookies', 'enabled', 30) : deleteCookie('advertisingCookies');

            // Ocultar el modal
            document.querySelector('.cookie-preferences-modal').style.display = 'none';
        });

        // Función para guardar todas las cookies
        document.getElementById('accept-all-cookies').addEventListener('click', function () {
            setCookie('strictCookies', 'enabled', 30);
            setCookie('functionalityCookies', 'enabled', 30);
            setCookie('performanceCookies', 'enabled', 30);
            setCookie('advertisingCookies', 'enabled', 30);

            // Ocultar el modal después de aceptar todas
            document.querySelector('.cookie-preferences-modal').style.display = 'none';
        });

        // Función para cerrar el modal 
        document.getElementById('close-modal').addEventListener('click', function () {
            showRejectCookiesDialog();
        });

        function showRejectCookiesDialog() {
            const rejectModalHTML = `
            <div class="reject-cookies-modal">
                <div class="reject-cookies-content">
                    <p>${defaultTexts[currentLanguage].rejectCookiesMessage}</p>
                    <div class="dialog-actions">
                        <button id="reject-cookies">${defaultTexts[currentLanguage].rejectCookies}</button>
                        <button id="return-to-cookies">${defaultTexts[currentLanguage].returnToCookies}</button>
                    </div>
                </div>
            </div>`;

            // Insertar el modal de rechazo de cookies
            document.getElementById('cookie-modal-container').insertAdjacentHTML('beforeend', rejectModalHTML);

            document.getElementById('reject-cookies').addEventListener('click', function () {
                // Rechazar todas las cookies
                deleteCookie('strictCookies');
                deleteCookie('functionalityCookies');
                deleteCookie('performanceCookies');
                deleteCookie('advertisingCookies');
                closeRejectCookiesModal();
                document.querySelector('.cookie-preferences-modal').style.display = 'none'; // Cerrar el modal principal
            });

            document.getElementById('return-to-cookies').addEventListener('click', function () {
                closeRejectCookiesModal(); // Cerrar el modal de rechazo
            });
        }

        function closeRejectCookiesModal() {
            const rejectModal = document.querySelector('.reject-cookies-modal');
            if (rejectModal) {
                rejectModal.remove();
            }
        }

    };

    // Ejecutar automáticamente si no se llama explícitamente a initCookieModal
    document.addEventListener('DOMContentLoaded', function () {

        if (document.cookie.includes('strictCookies=enabled') ||
            document.cookie.includes('advertisingCookies=enabled') ||
            document.cookie.includes('performanceCookies=enabled') ||
            document.cookie.includes('functionalityCookies=enabled')) {
            // Ya se han guardado las preferencias: NO mostrar el modal
            return;
        }

        if (!initialized) {
            initCookieModal(); // Cargar con valores por defecto si no se ha llamado explícitamente
        }
    });

})(window);



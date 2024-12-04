const script = document.createElement('script');
script.src = chrome.runtime.getURL('libs/exif.js'); // Assurez-vous que 'libs/exif.js' existe réellement
script.onload = function () {
    console.log("EXIF.js chargé avec succès !");
};
script.onerror = function () {
    console.error("Erreur lors du chargement de EXIF.js !");
};

document.head.appendChild(script);


// Injecte le script principal dans la page
const injectedScript = document.createElement('script');
injectedScript.src = chrome.runtime.getURL('injected.js'); // Chemin vers injected.js
(document.head || document.documentElement).appendChild(injectedScript);
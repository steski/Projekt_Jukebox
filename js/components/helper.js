/*
Helfer Funktionen - HTML und delay Funktionen
*/

function group(css) {
    return document.querySelectorAll(css);
};
function el(css){
    return document.querySelector(css);
};
function create(html){
    return document.createElement(html);
};
function hotButtons(HTMLElement) {
    group('#gui-buttons button').forEach((val) => {
        val.className = 'passiv';
    });
    if (HTMLElement) {
        HTMLElement.className = 'aktiv';
    };
};

// Delay Funktion mit Promise, Es wird somit immer auf das Timeout Ergebnis gewartet
const delay = millisekunden => new Promise(ergebnis => setTimeout(ergebnis, millisekunden));

export {group, el, create, hotButtons, delay};

// group derzeit nicht benötigt
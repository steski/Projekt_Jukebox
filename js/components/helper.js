/*
Helfer Funktionen - HTML und delay Funktionen
*/

function el(css){
    return document.querySelector(css);
};
function create(html){
    return document.createElement(html);
};

// Delay Funktion mit Promise, Es wird somit immer auf das Timeout Ergebnis gewartet
const delay = millisekunden => new Promise(ergebnis => setTimeout(ergebnis, millisekunden));

// Gibt Zeit in Xmin XXs aus
function timeConvert(songVerbleibendDuration){
    const second = Math.floor(songVerbleibendDuration%60);
    if (second < 10) {
        return `${Math.floor(songVerbleibendDuration/60)}min 0${second}s`
    } else {
        return `${Math.floor(songVerbleibendDuration/60)}min ${second}s`
    };
};

export {el, create, delay, timeConvert};

// group derzeit nicht benötigt
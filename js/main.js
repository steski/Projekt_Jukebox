import makeList from "./components/makeList.js";
import {el} from "./components/helper.js";
import {get, clear } from './components/indexedDB.js';
import {handleDragOver, processFile} from "./components/Drag_Drop.js";
import {loadSongsFunktionen} from "./components/audioFunctions.js";
import {songAnzahlLesen} from "./components/indexedDB_Functions.js";

/*
Startfunktionen + Eventlistener
seite Start -->   liest erstmalig SongANzahl
                  erstellt Liste aus der IndexDB
                  liest und seztzt alle Einstellungen aus localStorage
checkBrowser -->  Browser auf bestimmte Inhalte Prüfen
EventListener --> Drag & Drop --> reinziehen der Lieder
                                  führt handleDragOver & processFile aus
                  Abspielen --> loadSongSFunktionen
                  zurücksetzen --> alles Löschen
*/

(function(){

// let songAnzahl = 0;

// ################################### SEITENAUFRUF START ###################################

// Liest Songs und Einstellungen für den Start
async function loadStartSong(){

  // Liest die Songs aus der IndexedDB und schreibt den Namen in die Playlist
  // Anzahl der Songs getten
  const songAnzahl = await songAnzahlLesen();

  // Schleife, die von 0 bis songAnzahl zählt
  for(let songIndex = 0; songIndex <= songAnzahl; songIndex++){
    // aus DB laden
    const songGeladen = await get(`Song${songIndex}`).then((wert)=>wert);
    makeList(songGeladen.name.slice(0, -4));
  }; // Ende Schleife
};

async function loadStartOptions(){
  // Werte der Einstellungen aus localStorage Lesen und eintragen
  const localStorageKeys = ["fade","visual","abstand","volume","vor","zurueck","loop","geschwindigkeit"];
  const values = ["#fadeslider","#visualslider","#abstandslider","#volumeslider","#vorslider","#zurueckslider","#loopslider","#geschwindigkeitslider"];
  const labels = ["#volume","#vor","#zurueck","#loop","#geschwindigkeitsliderlabel"];

  for (let i = 0; i < 8; i++){
    if (localStorage.getItem(`${localStorageKeys[i]}`) !== null){
      el(`${values[i]}`).value = localStorage.getItem(`${localStorageKeys[i]}`);
      if (i == 4){
        el(`${labels[i-3]}`).innerHTML = `${localStorage.getItem(`${localStorageKeys[i]}`)}s&nbsp; <img src="img/icons/right-arrow.png" alt="vorspulen" title="vorspulen" height="15">`;
      } else if (i == 5){
        el(`${labels[i-3]}`).innerHTML = `<img src="img/icons/left-arrow.png" alt="zurückspulen" title="zurückspulen" height="15"> &nbsp;${localStorage.getItem(`${localStorageKeys[i]}`)}s`;
      } else if (i == 6){
        el(`${labels[i-3]}`).innerHTML = `${localStorage.getItem(`${localStorageKeys[i]}`)}s <img src="img/icons/loop.png" alt="loop" title="loop" height="15"> ein`;  
      } else if (i == 7){
        el(`${labels[i-3]}`).innerHTML = `<img src="img/icons/speed-o-meter.jpg" alt="Geschwindigkeit" title="Geschwindigkeit"> ${localStorage.getItem(`${localStorageKeys[i]}`)*10}%`;
      };
    };
  };
};

// Checken ob der Browser bestimmte Funktionen unterstützt
function checkBrowser(){
  if(window.FileReader && window.Blob && window.FileList && window.File){
    // Alles ok
  }
  else{
    // Fehlermeldung bei nicht unterstützt
    alert('Bitte keinen Steinzeitbrowser benutzen. Danke.')
  };
}; // Ende Checkbrowser Funktion 

// Startfunktionen werden zum Start aufgerufen
checkBrowser();
loadStartSong();
loadStartOptions();

// ################################### SEITENAUFRUF ENDE ###################################

// ############################# EVENT LISTENER #############################

// Drag & Drop Events in Drag_Drop.js
el('#drag-drop').addEventListener('dragover',handleDragOver);
el('#drag-drop').addEventListener('drop',processFile);

// Click Events
el('#abbrechen').addEventListener('click',function(){
      // IndexedDB löschen
      clear();
      // Seite neuladen
      location.reload();
});

// Spielt die Playliste
el('#abspielen').addEventListener('click',async function(){
  // Überprüfung ob Songs vorhanden sind
  const songAnzahl = await songAnzahlLesen();
  if( songAnzahl >= 1 ){
    loadSongsFunktionen();
  }
  else{
    el('#drag-drop').innerHTML = "<br>Eine Liste besteht aus mindestens 2 Elementen.<br>Finde den Fehler!";
  };
});

}());
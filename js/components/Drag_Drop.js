import {el} from "./helper.js";
import makeList from "./makeList.js";
import {songAnzahlLesen, songSpeichern} from "./indexedDB_Functions.js";

// Blocken des Standard (play) Verhalten des Browsers
function browserBlocken(evt){
  evt.stopPropagation();
  evt.preventDefault();
}; 

// DragOver Funktion (nur das Rüberziehen)
function handleDragOver(evt){
    browserBlocken(evt);
    // Tooltip Text auf "kopieren" ändern
    evt.dataTransfer.dropEffect = 'copy';
};

// Funktion für den Drag & Drop - Verarbeitung des Songs
async function processFile(evt){
  browserBlocken(evt);

  // speichert die gedraggte Datei in Variable
  const file = evt.dataTransfer.files[0];

  // Checken ob Audio Datei
  // es werden die letzten 4 Stellen abgetrennt und die Endung überprüft
  if (file.name.slice(-4) === ".mp3" || file.name.slice(-4) === ".m4a"){
    el('#drag-drop').innerHTML = '<br><br>Drop';
  }
  else{
    alert( "Das war keine unterstützte Audio-Datei!" );
    return;
  };

  // Make List Funktion mit Namen als Übergabeparameter
  makeList(file.name.slice(0, -4));

  // Anschließend folgt Speicherung des files (Blob) in IndexedDB mit songAnzahl
  // songAnzahl wird ebenfalls gespeichert
  const songAnzahlDB = await songAnzahlLesen();
  songSpeichern(songAnzahlDB, file);
}; // Process File Funktion ende

export {handleDragOver, processFile};
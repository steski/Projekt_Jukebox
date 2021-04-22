import makeList from "./components/makeList.js";
import {el} from "./components/helper.js";
import {get, set, getMany, clear } from './components/indexedDB.js';
import {handleDragOver, processFile} from "./components/Drag_Drop.js";
import {loadSongsFunktionen} from "./components/audioFunctions.js";
import {songAnzahlLesen} from "./components/indexedDB_Functions.js";

/*
Startfunktionen + Eventlistener
seite Start -->   liest erstmalig SongANzahl
                  erstellt Liste aus der IndexDB
                  liest und seztzt alle Einstellungen aus IndexDB
checkBrowser -->  Browser auf bestimmte Inhalte Prüfen
EventListener --> Drag & Drop --> reinziehen der Lieder
                                  führt handleDragOver & processFile aus
                  Abspielen --> loadSongSFunktionen
                  zurücksetzen --> alles Löschen
                  Canvas Slider --> Speicherung in indexDB
*/

(function(){

let songAnzahl = 0;

// ################################### SEITENAUFRUF START ###################################

// Liest Songs und Einstellungen für den Start
async function seiteStart(){

  // Liest die Songs aus der IndexedDB und schreibt den Namen in die Playlist
  // Anzahl der Songs getten
  let songAnzahl = await songAnzahlLesen();

  // Schleife, die von 0 bis songAnzahl zählt
  for( let songIndex = 0; songIndex <= songAnzahl; songIndex++ ){
    
    // Variablen Deklaration für die Songs
    let audioName, songGeladen;

    // aus DB laden
    songGeladen = await get(`Song${songIndex}`).then((wert)=>wert);
    // Song Name wird in Variable gespeichert
    audioName = songGeladen.name.split('.')[0];

    makeList(audioName);
  }; // Ende Schleife

  // Werte der Einstellungen aus IndexedDB Lesen und eintragen
  // es wird getMany benutzt, anstatt jedes einzeln zu getten
  let alleWerte = await getMany(["fade","visual","abstand","volume","vor","zurueck","loop","geschwindigkeit"]);

  // Überprüfung ob Wert vorhanden. Kein Wert ist undefined, somit wird If nicht ausgeführt
  // beim erstmaligen Start sind bspw. keine Werte gespeichert
    if(alleWerte[0]){
      el('#fadeslider').value = alleWerte[0];
      el('#fadesliderlabel').innerHTML = `Fade`;    
    };
    if(alleWerte[1]){
      el('#visualslider').value = alleWerte[1];
      el('#visualsliderlabel').innerHTML = `Balken-Breite`;
    };
    if(alleWerte[2]){
      el('#abstandslider').value = alleWerte[2];
      el('#abstandsliderlabel').innerHTML = `Balken-Abstand`;
    }
    if(alleWerte[3]){
      el('#volumeslider').value = alleWerte[3];
      el('#volume').innerHTML = `<img src="img/icons/volume.jpg" alt="Lautstärke" title="Lautstärke"> ${alleWerte[3]}%`;
    };
    if(alleWerte[4]){
      el('#vorslider').value = alleWerte[4];
      el('#vor').innerHTML = `${alleWerte[4]}s&nbsp; <img src="img/icons/right-arrow.png" alt="vorspulen" title="vorspulen" height="15">`;
    }; 
    if(alleWerte[5]){
      el('#zurueckslider').value = alleWerte[5];
      el('#zurueck').innerHTML = `<img src="img/icons/left-arrow.png" alt="zurückspulen" title="zurückspulen" height="15"> &nbsp;${alleWerte[5]}s`;
    };
    if(alleWerte[6]){
      el('#loopslider').value = alleWerte[6];
      el('#loop').innerHTML = `${alleWerte[6]}s <img src="img/icons/loop.png" alt="loop" title="loop" height="15"> ein`;
    };
    if(alleWerte[7]){
      el('#geschwindigkeitslider').value = alleWerte[7];
      el('#geschwindigkeitsliderlabel').innerHTML = `<img src="img/icons/speed-o-meter.jpg" alt="Geschwindigkeit" title="Geschwindigkeit"> ${alleWerte[7]/10}`;
    };
};  // Ende seiteStart funktion

// Checken ob der Browser bestimmte Funktionen unterstützt
function checkBrowser(){
  if(window.FileReader && window.Blob && window.FileList && window.File){
    // Alles ok und nichts machen, wenn untersützt
  }
  else{
    // Fehlermeldung bei nicht unterstützt
    alert('Bitte keinen Steinzeitbrowser benutzen. Danke.')
  }
}; // Ende Checkbrowser Funktion 

// Beide Startfunktionen werden direkt aufgerufen
checkBrowser();
seiteStart();

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
el('#abspielen').addEventListener('click',function(){
  // Überprüfung ob Songs vorhanden sind
  if( songAnzahl >= 0 ){
    loadSongsFunktionen();
  }
  else{
    el('#drag-drop').innerHTML = "<br>Eine Liste besteht aus mindestens 2 Punkten.<br>Finde den Fehler!";
  };
});

// Speichern der Slider Einstellungen bei mouseleave
el('#visualslider').addEventListener('mouseleave',function(){
  set('visual',Number(this.value));
});

el('#fadeslider').addEventListener('mouseleave',function(){
  set('fade',Number(this.value));
});

el('#abstandslider').addEventListener('mouseleave',function(){
  set('abstand',Number(this.value));
});

}());

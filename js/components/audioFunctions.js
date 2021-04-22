import {get,set} from './indexedDB.js';
import {el, delay} from "./helper.js";
import {songAnzahlLesen} from "./indexedDB_Functions.js";
import render from "./render.js";

/*
Hier befinden sich die 3 AudioFunktionen:
songLesen --> Liest Song
loadSongsFunktionen --> liest Song aus Speicher
                        übergibt den Song an playAudioFunktionen
playAudioFunktionen --> schreibt Titelinformationen
                        startet Sound
                        Canvas Sichtbar
                        übergibt Sound (AudioQuelle) an render Funktion
Eventlistener -->       Alle Eventlistener (Button und Slider), die sich unmittelbar mit dem derzeitigen Song befassen
                        volumeslider + mouseleave set + mute button
                        vorslider + mouseleave set + vorspulen button
                        zurückslider + mouseleave set + zurückspulen button
                        loopslider + mouseleave set + loop button
                        geschwindigkeitslider + mouseleave set
                        play/pause button
                        vorheriger titel button + nächster titel button
                        titel wiederholen button
*/                      

// ################################### VARIABLEN ###################################

// Variablen für Songreihenfolge
let songindex = 0;

// Variablen für Steuerung
let loopflag = 1;
let pauseflag = 0;
let muteflag = 0;
let volumeTemp;

// Variablen für Funktionen
let sound;
// ################################### VARIABLEN ENDE ###################################


// Funktion zum Lesen des Songs
// gibt File Blob zurück
function songLesen(file){

  // Mit Pfeilfunktion
  return new Promise((resolve,reject) => {
    // neuen Filereader
    let reader = new FileReader();
    // Wenn er fertig ist wird funktion ausgeführt
    reader.onload = () => {
      // reader.result ist das Resultat, also das was reingedroppt wird
      resolve(reader.result);
    };
    // Fehlermeldung wenn es nicht geht
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
}; // SongLesen Ende

// Funktion zum Laden der Songs, Liest Songs aus Speicher, übergibt sie dem Player
async function loadSongsFunktionen(){

    // Anzahl der Songs getten
    let songAnzahl = await songAnzahlLesen();

    // If Abfrage songindex mit songAnzahl vergleichen
    // setzt index wieder auf 0, wenn der letzte Song erreicht wurde (Liste beginnt von vorn)
    if (songAnzahl+1 === songindex){
      songindex = 0;
    };

    // Variablen Deklaration für die Songs
    // audioQuelle ist dateipfad oder file (blob)
    let titel, kuenstlerName, erscheinungsDatum, audioQuelle;

    // file blob lesen
    let songGeladen = await get(`Song${songindex}`).then((wert)=>wert);

    // audioQuelle = Song 
    audioQuelle = await songLesen(songGeladen);

    // Anzeige Variablen füllen
    titel = songGeladen.name.split('.')[0];
    // sind beim Drag&Drop Song nicht bekannt
    kuenstlerName = '';
    erscheinungsDatum = '';

    // Funktion zum Abspielen des Lieds aufrufen
    playAudioFunktionen(titel, kuenstlerName, erscheinungsDatum, audioQuelle);

    // Index hochzählen
    songindex++;
}; // Ende loadSong Funktion

// Audio Funktion
function playAudioFunktionen(titel, kuenstlerName, erscheinungsDatum, audioQuelle){

  // alten Sound stoppen
  if (sound){
    sound.pause();
  };

  // falls Pause gedrückt wurde und danach nächste Titel kommt
  if (pauseflag === 1){
    pauseflag = 0;
    el('#playpause').innerHTML = `<img src="img/icons/pause.jpg" alt="Abspielen und Anhalten" title="Abspielen und Anhalten">`;
  }

  // Standard Audio Funktionen
  sound = new Audio();
  sound.src = audioQuelle;
  sound.playbackRate = Number(geschwindigkeitslider.value)/10;
  sound.play();

  // Visualizer aufrufen und CSS Elemente ändern
  el('#visualizer-wrapper').style.display = "block";
  el('#canvas').style.display = "block";
  el('#canvas').width = window.innerWidth-100;
  el('#canvas').height = 300;
  el('#canvas-vis-regler').style.display = "block";

  // Anzeige setzen
  sound.onloadeddata = function(){
    // Der Momentane Wert wird im Animationframe (render funktion) berechnet und angezeigt
    el('#titel-anzeige').innerHTML = titel;
    el('#laenge-anzeige').innerHTML = Math.floor(sound.duration/60) + 'min ' + Math.floor((sound.duration%60)) + 's';
    el('#fortschrittsbalken-inner').max = sound.duration;
  }; // Ende onload

  // Aufruf render Funktion
  render(sound);

}; // Ende Audio Funktion

// ################################### EVENT LISTENER ###################################

el('#fortschrittsbalken-inner').addEventListener('input',function(){
  sound.currentTime = sound.duration-Number(this.value);
});

// Alle Steuerungsfunktionen beinhalten jeweils den Eventlistener
// Dazu wird jeweils die anonyme Funktion direkt aufgerufen

// Alle Werte werden beim Mouseleave Event in die DB gespeichert, da performancemäßig besser

// volumeslider
el('#volumeslider').addEventListener('input',function(){
  el('#volume').innerHTML = `<img src="img/icons/volume.jpg" alt="Lautstärke" title="Lautstärke" height="15"> ${Number(this.value)}%`;
  // Muteflag muss hier zurückgesetzt werden, falls nach dem Mute der Slider angefasst wird
  muteflag = 0;
});
el('#volumeslider').addEventListener('mouseleave',function(){
  set('volume', Number(this.value));
});

//vor slider
el('#vorslider').addEventListener('input',function(){
  el('#vor').innerHTML = `${Number(this.value)}s <img src="img/icons/right-arrow.png" alt="vorspulen" title="vorspulen" height="15">`;
});
el('#vorslider').addEventListener('mouseleave',function(){
  set('vor',Number(this.value));
});

// zurück slider
el('#zurueckslider').addEventListener('input',function(){
  el('#zurueck').innerHTML = `<img src="img/icons/left-arrow.png" alt="zurückspulen" title="zurückspulen" height="15"> &nbsp;${Number(this.value)}s`;
});
el('#zurueckslider').addEventListener('mouseleave',function(){
  set('zurueck',Number(this.value));
});


// Loop slider
el('#loopslider').addEventListener('input',function(){
  if(loopflag === 0){
    el('#loop').innerHTML = `<img src="img/icons/loop.png" alt="loop" title="loop" height="15"> Aus`;
  }
  else{
    el('#loop').innerHTML = `${Number(this.value)}s <img src="img/icons/loop.png" alt="loop" title="loop" height="15"> ein`;
  };
});
el('#loopslider').addEventListener('mouseleave',function(){
  set('loop',Number(this.value));
});

// Geschwindigkeit Slider
el('#geschwindigkeitslider').addEventListener('input',function(){
  // Überprüfung, ob Sound vorhanden ist
  if(sound){
    sound.playbackRate = Number(this.value)/10;
  };
  // Zahl immer mit einer Nachkommastelle
  el('#geschwindigkeitsliderlabel').innerHTML = `<img src="img/icons/speed-o-meter.jpg" alt="Geschwindigkeit" title="Geschwindigkeit"> ${(Number(this.value)/10).toFixed(1)}`;
});
el('#geschwindigkeitslider').addEventListener('mouseleave',function(){
  set('geschwindigkeit',Number(this.value));
});

// Play oder Pause Funktion
// ändert Button Text, mithilfe des Flags wird pause oder play ausgeführt
el('#playpause').addEventListener('click', function(){
  if ( pauseflag === 0){
    sound.pause();
    pauseflag = 1;
    el('#playpause').innerHTML = `<img src="img/icons/play.jpg" alt="Abspielen und Anhalten" title="Abspielen und Anhalten">`;
  }
  else{
    sound.play();
    pauseflag = 0;
    el('#playpause').innerHTML = `<img src="img/icons/pause.jpg" alt="Abspielen und Anhalten" title="Abspielen und Anhalten">`;
  };
});

// mute / unmute Funktion
// mithilfe des Flags wird mute oder unmute ausgeführt
el('#volume').addEventListener('click',function(){
  if (muteflag === 0){
    // derzeitige Lautstärke speichern
    volumeTemp = sound.volume*100;
    // Lautstärke 0 in Slider und Button anzeigen
    el('#volumeslider').value = 0;
    el('#volume').innerHTML = `<img src="img/icons/no-volume.jpg" alt="Lautstärke" title="Lautstärke"> 0%`;
    // Flag ändern
    muteflag = 1;
  }
  else{
    // alte Lautstärke in Slider und Button anzeigen
    el('#volumeslider').value = volumeTemp;
    el('#volume').innerHTML = `<img src="img/icons/volume.jpg" alt="Lautstärke" title="Lautstärke"> ${Number(volumeslider.value)}%`;
    // Flag ändern
    muteflag = 0;
  };
}); // Ende EventListener mute / unmute Funktion

// Titel zurück
el('#skip-back').addEventListener('click',function(){
  // Überprüfung ob nicht erster Song
  if(songindex>1){
    // zählt index zurück, ruft Funktion zum Laden des Songs auf
    songindex = songindex-2;
    loadSongsFunktionen();
  }
  else{
    // wiederholt den aktuellen Song
    sound.currentTime = 0;
  };
});

// Vorspulen um X Sekunden, Addiert X Sekunden auf die CurrentTime
el('#vor').addEventListener('click', function(){
  let zeit = Number(vorslider.value);
  sound.currentTime = sound.currentTime + zeit;
});

// Zurückspulen um X Sekunden, Subrahiert X Sekunden von der CurrentTime
el('#zurueck').addEventListener('click', function(){
  let zeit = Number(zurueckslider.value);
  sound.currentTime = sound.currentTime - zeit;
});

// Nächster Titel
el('#skip-to-next').addEventListener('click',async function(){
  // Überprüfung ob mehr als 1 Song in Playlist
  let songAnzahl = await songAnzahlLesen()
  if(songAnzahl>0){
    loadSongsFunktionen();
  };
  // Nichts machen, wenn nur ein Song vorhanden ist
});

// Loopfunktion. Alle x Sekunden für der Abschnitt wiederholt
// mit Flag, der bei nochmaligem Klicken deaktiviert wird
// asynchrone Funktion wegen delay implementierung
el('#loop').addEventListener('click', async function(){
  let zeit = Number(loopslider.value);
  if(loopflag === 0){
    loopflag = 1;
    el('#loop').innerHTML = `${Number(loopslider.value)}s <img src="img/icons/loop.png" alt="loop" title="loop" height="15"> ein`;
  }
  else{
    loopflag = 0;
    el('#loop').innerHTML = `<img src="img/icons/loop.png" alt="loop" title="loop" height="15"> Aus`;
  };
  while (loopflag === 0){
    sound.currentTime = sound.currentTime - zeit;
    
    // Muss am Ende durch den Wert der eingestellten Geschwindigkeit dividiert werden
    await delay(zeit*1000/(Number(geschwindigkeitslider.value/10)));
  };
}); // Ende EventListener Loop Funktion

// aktuellen Titel wiederholen, setzt die Zeit auf 0
el('#titel-wiederholen').addEventListener('click', function(){
  sound.currentTime = 0;
});


// ################################### EVENT LISTENER ENDE ###################################

// experimentelle geheime Top-Secret Funktionen :>

// Schallplattensprung
function schallPlattenSprung(audioData){
  // 1/1000 -> 0,1% Chance, dass der Zufall 1 wird
  let zufall = Math.floor(Math.random()*1000);
  if (zufall == 1){
    // 2 mal einen 0,5 sekündigen "Sprung" erzeugen
    setTimeout(function(){audioData.currentTime = audioData.currentTime - 0.5;},500);
    setTimeout(function(){audioData.currentTime = audioData.currentTime - 0.5;},1000);
  };
};

// Exportierte Funktionen
export {loadSongsFunktionen}

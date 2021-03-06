import {get, set} from './indexedDB.js';

/*
Funktionen, die Inhalte der IndexeDB liest oder speichert
*/

// Gibt die Anzahl der gespeicherten Songs in der Liste zurück
// fängt bei 0 an
async function songAnzahlLesen(){
    const songAnzahlDB = await get("songAnzahl").then((wert) => wert);
    return songAnzahlDB;
};

// Funktion zum Speichern der Songs
function songSpeichern(songAnzahl, song){
    // Wenn bereits Songs drin sind
    if (songAnzahl >= 0){
      songAnzahl++;
      set(`Song${songAnzahl}`,song);
      set("songAnzahl",songAnzahl);
    }
    // Wenn nicht, dann erster Song
    // SongAnzahl (aus indexedDB) ist dann nämlich nicht vorhanden, also undefined
    else{
      set("Song0",song);
      set("songAnzahl",0);
    };
}; 

export {songAnzahlLesen, songSpeichern};
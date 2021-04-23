import {loadSongsFunktionen} from "./audioFunctions.js";
import {el, hotButtons} from "./helper.js";

// Sound Vizualizer Variable
let animate = null;
// Variablen für Balken Farbe
let r, g, b;
// Variablen für invertierte Farben
let rr, gg, bb;

// Render Funktion (hauptsächlich Visualisierung)
export default function render(audioData) {

    // Animate zurücksetzen
    // Ansonsten erscheint kein Vizualizer mehr, wenn man während eines Lieds ein neues Lied spielt
    animate = 0;
  
    // Canvas deklaration
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");
  
    // Originalteil der Visualizer funktion
    let context = new AudioContext(); // (Interface) Audio-processing graph
    let src = context.createMediaElementSource(audioData); // Give the audio context an audio source,
    // to which can then be played and manipulated
    const analyser = context.createAnalyser(); // Create an analyser for the audio context
    src.connect(analyser); // Connects the audio context source to the analyser
    analyser.connect(context.destination); // End destination of an audio graph in a given context
  
    const bufferLength = analyser.frequencyBinCount; // (read-only property)
    // Unsigned integer, half of fftSize 
    // Equates to number of data values you have to play with for the visualization
    const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
    // At this point dataArray is an array with length of bufferLength but no values
  
    // Startwerte der Balken
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    let barWidth = (WIDTH / bufferLength) * 13;
    let barHeight;
    let x;
    let bars;
  
    // Variable für Dauer Anzeige
    let songVerbleibendDuration;
  
    // Start der Render Funktion (AnimationFrame)
    function renderFrame(){
  
        animate = requestAnimationFrame(renderFrame);
        // Einkommentieren um einen Schallplattensprung zu simulieren
        //schallPlattenSprung(audioData);
        
        // Hier können die Anzahl der Balken dynamisch während der Laufzeit geändert werden
        // FFTSize muss Potenz von 2 sein, daher sind die Werte fest vorgegeben
        // ist bei Abstand Wert 1 passend
        if(Number(visualslider.value) === 0){
            analyser.fftSize = 256;
            bars = 10;
        }
        else if(Number(visualslider.value) === 1){
            analyser.fftSize = 512;
            bars = 20;
        }
        else if(Number(visualslider.value) === 2){
            analyser.fftSize = 1024;
            bars = 40;
        }
        else if(Number(visualslider.value) === 3){
            analyser.fftSize = 2048;
            bars = 80;
        }
        else if(Number(visualslider.value) === 4){
            analyser.fftSize = 4096;
            bars = 160;
        }
        else if(Number(visualslider.value) === 5){
            analyser.fftSize = 8192;
            bars = 320;
        }; // Ende if
  
        barWidth = (WIDTH / analyser.frequencyBinCount) * 13;
  
        // verbleibende Dauer Berechnung und zuweisen
        songVerbleibendDuration = audioData.duration-audioData.currentTime;
        el('#verbleibend-anzeige').innerHTML = Math.floor(songVerbleibendDuration/60) + 'min ' + Math.floor((songVerbleibendDuration%60)) +'s';
        el('#fortschrittsbalken-inner').value = songVerbleibendDuration;
  
        // Lautstärke während der Laufzeit änderbar
        audioData.volume = Number(volumeslider.value)/100;
  
        // Wenn das aktuelle AudioFile abgelaufen ist
        // renderFrame durch return und cancelAnimationFrame(animate) stoppen
        // Canvas wird zurückgesetzt
        if (audioData.currentTime >= audioData.duration){
            // Canvas Leeren
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
            // Animationframe canceln
            cancelAnimationFrame(animate);
            hotButtons(false);
            animate = false;
  
            // Funktion aufrufen, neuer Titel wird hier gestartet
            loadSongsFunktionen();
  
            // Funktion beenden
            return;
        }; // Ende if
  
        // Canvas X Wert
        x = 0;
  
        // weiterer Originalteil der Visualizer Funktion
        analyser.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
        // Results in a normalized array of values between 0 and 255
        // Before this step, dataArray's values are all zeros (but with length of 8192)
  
        // Canvas Leeren bevor neue Balken angezeigt werden.
        // Leztzter Wert ist der Fade Wert, dieser kommt dynamisch aus dem slider
        ctx.fillStyle = `rgba(0,0,0,${Number(fadeslider.value)/10})`; 
        ctx.fillRect(0, 0, WIDTH, HEIGHT); 
  
        // Hier werden die einzelnen Farben gesetzt
        for (let i = 0; i < bars; i++) {
  
            // Balken Höhe. Wert passt gut zu Canvas Höhe mit 300px
            barHeight = (dataArray[i] * 1.1);
  
            if (dataArray[i] > 220) { // Pink
                r = 250;
                g = 0;
                b = 220;
            } else if (dataArray[i] > 210) { // Rot
                r = 250;
                g = 0;
                b = 0;
            } else if (dataArray[i] > 195) { // Orange
                r = 250;
                g = 100;
                b = 0;
            } else if (dataArray[i] > 180) { // yellow
                r = 250;
                g = 255;
                b = 0;
            } else if (dataArray[i] > 165) { // Grün Gelb
                r = 204;
                g = 255;
                b = 0;
            } else if (dataArray[i] > 150) { // Grün
                r = 80;
                g = 255;
                b = 80;
            } else if (dataArray[i] > 135) { // Grün Blau
                r = 0;
                g = 219;
                b = 131;
            } else if (dataArray[i] > 120) { // Blau
                r = 80;
                g = 80;
                b = 250;
            } else { // Hell blau für alles andere
                r = 40;
                g = 100;
                b = 255;
            };
            // Farben invertieren
            rr=255-r; gg=255-g; bb=255-b;
  
            // Farben den Elementen zuweisen
            el('#canvas').style.border = `solid 10px rgb(${r}, ${g}, ${b})`;
            el('#drag-drop').style.background = `rgb(${r}, ${g}, ${b})`;
            el('#drag-drop').style.color = `rgb(${rr}, ${gg}, ${bb})`;
            el('#drag-drop').style.border = `solid 10px rgb(${rr}, ${gg}, ${bb})`;
    
            // Balken mit den Farben zuweisen
            ctx.fillStyle = `rgb(${r},${g},${b})`;
  
            // (Startpunkt X, Starpunkt y, Endpunkt X, Endpunkt Y)
            ctx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);
         
            // -1 da bei 0 ein Pixel zwischen den Balken ist
            x += barWidth + Number(abstandslider.value-1);
        }; // Ende for Schleife
    }; // Animation Ende
  
    if (!animate) {
        renderFrame();
    };
}; // Render Funktion Ende
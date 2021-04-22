import { create, el } from "../components/htmlFunctions.js";

// Erstellt Liste der hinzugefügten Lieder
export default function makeList(audioName){

    // neues div mit unter-div (name) und Button erstellen
    let plDiv = create('div');
    plDiv.setAttribute('id','pl-song');
    
    let audioDiv = create('div');
    audioDiv.innerHTML = audioName;
    let plButton = create('div');
    plButton.innerHTML = '-';
  
    // Div der Liste hinzufügen
    el('#list').appendChild(plDiv);
    plDiv.appendChild(audioDiv);
    plDiv.appendChild(plButton);
  
    // ClassNames hinzufügen
    audioDiv.className = 'song-pl';
    plButton.className = 'select-pl';
}; 
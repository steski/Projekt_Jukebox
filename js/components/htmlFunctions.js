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

export {group, el, create, hotButtons};

// group derzeit nicht benötigt
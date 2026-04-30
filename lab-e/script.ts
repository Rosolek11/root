 const msg: string = "Wszystko działa jak należy";
 alert(msg);

interface StyleMap {
    [name: string]: string;
}

const appStyles: StyleMap = {
    "Style 1": "/style-1.css",
    "Style 2": "/style-2.css",
    "Style 3": "/style-3.css"
};

interface AppState {
    currentStyle: string;
    dictionary: StyleMap;
}

const state: AppState = {
    currentStyle: Object.keys(appStyles)[0],
    dictionary: appStyles
};

let currentLinkTag: HTMLLinkElement | null = null;

function applyStyle(styleName: string) {
    const file = state.dictionary[styleName];
    if (!file) return;

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = file;

    document.head.appendChild(newLink);

    if (currentLinkTag) {
        document.head.removeChild(currentLinkTag);
    }

    currentLinkTag = newLink;
    state.currentStyle = styleName;
}

function generateLinks() {
    const menu = document.getElementById("styles-menu");
    if (!menu) return;

    Object.keys(state.dictionary).forEach(name => {
        const button = document.createElement("button");
        button.innerText = name;
        button.style.marginRight = "10px";
        button.style.cursor = "pointer";
        button.addEventListener("click", () => {
            applyStyle(name);
        });
        menu.appendChild(button);
    });
}

// Initialization
applyStyle(state.currentStyle);
generateLinks();
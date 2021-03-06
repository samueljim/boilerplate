//--------------------------- crop and bleed -----------------------------------

var cropSVG =
  '<svg class="crop-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.6 21.6" xmlns:v="https://vecta.io/nano"><path d="M21 15V0m-6 21H0" fill="none" stroke="#000" stroke-width="0.25" stroke-miterlimit="10.0131"/></svg>';

const trimMarks = document.body.dataset.trim == "true" ? true : false;
const renderer = document.body.dataset.renderer;
const pages = document.querySelectorAll(".page");
pages.forEach(function (page) {
  page.style.height = pageHeightSetup(trimMarks, renderer);

  if (trimMarks) {
    var cropString = `<div class="crop-marks">
         <div class="crop-mark top-left">${cropSVG}</div>
         <div class="crop-mark top-right">${cropSVG}</div>
         <div class="crop-mark bottom-left">${cropSVG}</div>
         <div class="crop-mark bottom-right">${cropSVG}</div>
       </div>`;

    page.insertAdjacentHTML("afterbegin", cropString);
  }
});

// Fix for the resizable background images - fullscreen and digital vairaitons only
function checkCrop() {
  document
    .querySelectorAll("[data-trim='false'] .outfit-resizable-background")
    .forEach((el) => {
      el.parentNode.style.left = "0";
      el.parentNode.style.right = "0";
      el.parentNode.style.top = "0";
      el.parentNode.style.bottom = "0";
      el.parentNode.style.width = "100%";
      el.parentNode.style.height = "100%";
    });
}

/*document.querySelectorAll(".bleed").forEach(bleed => {
  bleed.style.cssText
});
Array.prototype.slice.call(document.querySelectorAll('.bleed'))
.forEach(function(bleed) {
    bleed.style.cssText = !!window.showCrop 
    ? 'position: absolute; top: 4.41mm; right: 4.41mm; bottom: 4.41mm; left: 4.41mm;'
    : 'position: absolute; top: -3mm; right: -3mm; bottom: -3mm; left: -3mm';
});  
*/
// setSize

Array.prototype.slice
  .call(document.querySelectorAll(".bleed"))
  .forEach(function (bleed) {
    bleed.style.cssText = trimMarks
      ? "position: absolute; top: 4.41mm; right: 4.41mm; bottom: 4.41mm; left: 4.41mm;"
      : "position: absolute; top: -3mm; right: -3mm; bottom: -3mm; left: -3mm";
  });

window.addEventListener("resize", setSize);

function setSize() {
  const vw = (trimMarks ? window.innerWidth : window.innerWidth + 57.62) / 100;
  const vh =
    (trimMarks ? window.innerHeight : window.innerHeight + 57.62) / 100;
  const vmin = Math.min(vw, vh);
  const vmax = Math.max(vw, vh);

  // Saving the preliminary font size calculation
  const preliminaryCalc = vmin * 2 + vmax * 1.4 + vh * 2;

  // Checking if the document is currently in export mode
  const isExportMode = window.location.href.indexOf("exports") > -1;

  // Checking if the active browser is Firefox
  const isFirefox = navigator.userAgent.includes("Firefox");

  // Grabbing the data-export-font-reduce-by-percent from the body element
  const exportReduceVal =
    document.body.dataset.reduceExportFontSizeByPercent === undefined
      ? 0
      : parseFloat(document.body.dataset.reduceExportFontSizeByPercent);

  // Grabbing the data-firefox-font-reduce-by-percent from the body element
  const firefoxReduceVal =
    document.body.dataset.reduceFirefoxFontSizeByPercent === undefined
      ? 0
      : parseFloat(document.body.dataset.reduceFirefoxFontSizeByPercent);

  const exportModeFontSize =
    preliminaryCalc - (exportReduceVal / 100) * preliminaryCalc;
  const firefoxFontSize =
    preliminaryCalc - (firefoxReduceVal / 100) * preliminaryCalc;

  // Reducing the preliminaryCalc value by reduceVal in export mode and in Firefox preview mode
  const finalCalc = isExportMode
    ? exportModeFontSize
    : isFirefox
    ? firefoxFontSize
    : preliminaryCalc;

  document.documentElement.style.fontSize = `${finalCalc}px`;
}

setSize();

// Check if current browser is Firefox
function firefoxCheck() {
  if (navigator.userAgent.includes("Firefox"))
    document.body.classList.add("is-firefox");
}

firefoxCheck();

// Detecting if user is on MAC operating system
function detectSystem() {
  const isMac = window.navigator.appVersion.includes("Mac");
  if (isMac) document.body.classList.add("is-mac");
}

detectSystem();

// Check if current browser is Edge for wordbreak break-word fix
function edgeCheck() {
  if (navigator.userAgent.includes("Edg")) {
    return true;
  }
  return false;
}

function wordBreakHotFix() {
  if (edgeCheck()) {
    let wordBreakSelector = document.querySelector("html");
    wordBreakSelector.style.wordBreak = "break-all";
  }
}
wordBreakHotFix();

function setupPlaceholder(placeholderVisibility, placeholderImages) {
  //If array length < 1 or the first item is "" or null or undefined
  if (
    placeholderImages.length < 1 ||
    placeholderImages[0] == "" ||
    placeholderImages[0] == null ||
    placeholderImages[0] == undefined ||
    placeholderVisibility == "hide"
  )
    return;

  var pages = document.querySelectorAll(".page .container");
  pages.forEach((page, index) => {
    let placeholderImage = placeholderImages[index];
    if (
      placeholderImage == "" ||
      placeholderImage == null ||
      placeholderImage == undefined
    )
      placeholderImage = placeholderImages[0];

    let placeholderStructure = `<div class="placeholderImage" style="background-image: url('${placeholderImage}')"></div>`;
    page.insertAdjacentHTML("afterbegin", placeholderStructure);
  });
}

function setupMutationObserver(target, observerOptions, callback, params) {
  let mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      callback.apply(this, params);
    });
  });

  mutationObserver.observe(target, observerOptions);
}

function setOutfitState() {
  var mode = window.location.href.indexOf("exports") > -1 ? "export" : false;
  mode =
    !mode && window.location.href.indexOf("templates") > -1 ? "template" : mode;
  mode =
    !mode && window.location.href.indexOf("projects") > -1 ? "document" : mode;
  mode =
    !mode && window.location.href.indexOf("preview") > -1 ? "preview" : mode;
  if (!mode) {
    mode = "error";
  }

  document.body.setAttribute("document-state", mode);
}

function getOutfitState() {
  return document.body.getAttribute("document-state");
}

function imageCompression() {
  var imageCompressEl = document.querySelectorAll("[data-custom-compression]");
  var editorString = "?qual=editor";

  function checkURL(editorString, url) {
    if (url.includes(editorString) || url.includes(".svg")) return false;
    return true;
  }

  imageCompressEl.forEach((el) => {
    //Non Repo Images with data-custom-compression on img element itself
    var imgSrc = el.getAttribute("src");
    console.log(imgSrc);
    if (imgSrc != null) {
      //src attribute exists assume that this is an <img> element
      if (!checkURL(editorString, imgSrc)) return;
      el.setAttribute("src", imgSrc + editorString);
    } else {
      var imgEl = el.querySelector("img");
      if (imgEl == null) return;
      var imgURL = imgEl.getAttribute("src");
      if (!checkURL(editorString, imgURL)) return;
      imgEl.setAttribute("src", imgURL + editorString);

      var bkgImgEl = el.querySelector(".outfit-resizable-background");
      if (bkgImgEl == null) return;
      var bkgUrl = bkgImgEl.style.backgroundImage
        .slice(4, -1)
        .replace(/"/g, "");
      if (!checkURL(editorString, bkgUrl)) return;
      bkgImgEl.style.backgroundImage = `url("${bkgUrl}${editorString}")`;
    }
  });
}

function pageHeightSetup(trimMarks, renderer) {
  switch (renderer) {
    case "1":
      console.info("Renderer 1 Set");
      return "100vh";
    case "2":
      console.info("Renderer 2 Set");
      return "calc(100vh - 1px)";
    default:
      console.error("Renderer Not Set");
      return "100vh";
  }
}

function validFontList(fontsListed) {
  if (fontsListed.length < 1) {
    console.error("No fonts were listed in the Font Oberserver array.");
    return false;
  }

  return true;
}

/**
 * Returns a background image of a inputed hex at a requested opactiy 
 * @param {string} colour - Hex code from platform. 
 * @param {number} opacity - How much traspancy do you want between 1 and 0? 
 */
function backgroundOpacityReduce (colour, opacity) {
  return `url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='50px' height='50px' viewBox='0 0 50 50' enable-background='new 0 0 50 50' xml:space='preserve'%3E%3Crect opacity='${opacity}' fill='${colour.replace('#','%23')}' width='50' height='50'/%3E%3C/svg%3E")`;
}

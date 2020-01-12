'use strict';

console.log("popup start");
let toggleButton = document.getElementById('toggleButton');
let onColor = "#00ff00"
let offColor = "#ff0000"
let isOn = true; // Starts true
chrome.storage.sync.get('toggle', function(data) {
  isOn = data.toggle;
  setButtonColor();
})

toggleButton.onclick = function(element) {
  isOn = !isOn;
  chrome.storage.sync.set({toggle: isOn});

  setButtonColor();
};

function setButtonColor() {
  toggleButton.style.backgroundColor = isOn ? onColor : offColor;
}

// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let submitButton = document.getElementById('submit');
let phobiaText = document.getElementById('phobiaText')
var list = document.getElementById('list');

let phobiasList;
chrome.storage.sync.get('phobias', function(data) {
  phobiasList = data.phobias;

  for (let i = 0; i < phobiasList.length; i++) {
    addToUI(phobiasList[i]);
  }
});

function setup() {
  submitButton.addEventListener('click', function() {
    let phobia = phobiaText.value;
    if (!phobia) {
      return;
    }


    chrome.storage.sync.get('phobias', function(data) {
      phobiasList = data.phobias;
      // Add the new phobia
      phobiasList.push(phobia);
      // Save the phobias list back to storage
      chrome.storage.sync.set({phobias: phobiasList}, function() {
        addToUI(phobia);
        // Clear the input text
        phobiaText.value = "";
      });
    });
  });
}

// Add element to list in UI
function addToUI(phobiaString) {
  // TODO: update the list of phobias added so far
  let entry = document.createElement('li');
  entry.appendChild(document.createTextNode(phobiaString));
  list.appendChild(entry);
}



setup();

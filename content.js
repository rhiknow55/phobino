console.log('Page loaded.');

// TODO: Add loading to block page load at the start of page load

// Start off
let isOn;
chrome.storage.sync.get('toggle', function(data) {
  isOn = data.toggle;

  filter();
});

let phobiaList = [];
chrome.storage.sync.get('phobias', function(data) {
  if (data.phobias) {
    phobiasList = data.phobias;
  }
});

function filter() {
  if (!isOn) {
    return;
  }

  console.log("Will filter because the extension is on!")

  // TODO: get the phobias from storage

  let images = document.getElementsByTagName('img');
  for(let i = 0; i < images.length; i++){
    // First check if name has the phobia or synonyms in it
    let imgUrl = images[i].src;
    console.log(images[i].src);

    // send the image link to the background script
    chrome.runtime.sendMessage({msg: 'image', link: imgUrl, index: i}, function(data) {
      console.log("inside then");
      console.log(data);
      console.log("index: ", data.index);

      for (let j = 0; j < data.data.length; j++) {
        if (containsPhobiaString(data.data[j].description)) {
          console.log("nani");
          images[i].src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bradypus.jpg/800px-Bradypus.jpg";
        } else {
          continue;
        }
      }
    });
  }
}

// Return true if string contains any of the phobias and synonyms
function containsPhobiaString(value) {
  // TODO: use the phobiasList to check through them all
  // and see if this string includes it
  for (let i = 0; i < phobiasList.length; i++) {
    console.log(phobiasList[i]);
    console.log(value);
    console.log(phobiasList[i].includes(value));
    if (phobiasList[i].includes(value)) {
      console.log("FUCK");
      return true;
    }
  }
  return false;
}

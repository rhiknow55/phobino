console.log('Page loaded.');

// TODO: Add loading to block page load at the start of page load

// Start off
let isOn;
chrome.storage.sync.get('toggle', function(data) {
  isOn = data.toggle;

  filter();
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
    chrome.runtime.sendMessage({msg: 'image', link: imgUrl, index: i}, function(data, index) {
      console.log("inside then");
      console.log(data);
      console.log("index: ", data.index);
    });
  }
}

// Return true if string contains any of the phobias and synonyms
function containsPhobiaString(value) {
  // TODO: use the phobiasList to check through them all
  // and see if this string includes it

  // for (let i = 0; i < )
  return true;
}

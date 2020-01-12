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

  let images = document.getElementsByTagName('img');
  for(let i = 0; i < images.length; i++){
    // First check if name has the phobia or synonyms in it
    let imgUrl = images[i].src;


    console.log();

    // chrome.runtime.sendMessage({msg: 'image', index: i}, function({data, index}) {
    //   images[index].src = data.link;
    // });
    //sdf
  }
}

// Return true if string contains any of the phobias and synonyms
function containsPhobiaString(value) {


  // for (let i = 0; i < )
}

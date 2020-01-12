// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var API_KEY = 'AIzaSyB8YXR4pvXj9OOAqrbxVTZC2T9alI2Bejk';
var MAX_LABELS = 4;

// http makes an HTTP request and calls callback with parsed JSON.
var http = function (method, url, body, cb) {
  console.log("http");
  console.log("url in http: " + url);
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) { return; }
    if (xhr.status >= 400) {
      console.log('API request failed');
      console.log('XHR failed', xhr.responseText);
      return;
    }
    cb(JSON.parse(xhr.responseText));
  };
  xhr.send(body);
};

// Fetch the API key from config.json on extension startup.
// http('GET', chrome.runtime.getURL('config.json'), '', function (obj) {
//   API_KEY = obj.key;
//   document.dispatchEvent(new Event('config-loaded'));
// });

// detect makes a Cloud Vision API request with the API key.
var detect = async function (type, b64data, cb) {
  console.log("detect()");
  var url = 'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY;
  console.log(API_KEY);
  console.log(url);
  var data = {
    requests: [{
      image: {content: b64data},
      features: [{'type': type}]
    }]
  };
  http('POST', url, JSON.stringify(data), cb);
};

var b64 = async function (url, cb) {
  console.log("b64()");
  var image = new Image();
  // image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    canvas.getContext('2d').drawImage(this, 0, 0);
    var b64data = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
    cb(b64data);
  };
  image.src = url;
};

// async function b64(url) {
//   var image = new Image();
//   image.setAttribute('crossOrigin', 'anonymous');
//   image.onload = function () {
//     var canvas = document.createElement('canvas');
//     canvas.height = this.naturalHeight;
//     canvas.width = this.naturalWidth;
//     canvas.getContext('2d').drawImage(this, 0, 0);
//     var b64data = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
//     return b64data;
//   };
//   image.src = url;
// }

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({toggle: true}, function() {
    console.log('Extension running!');
  });

  addMessageListener();

  // TODO maybe also set the phobiaslist storage key here
});

async function addMessageListener() {
  chrome.runtime.onMessage.addListener(async function(message, sender, senderResponse){
    console.log('listener called')
    if(message.msg === "image"){
      console.log("after image check");
      // call google api with this image
      // let temp_image = b64(message.link, function() {
      //
      // });

      await b64(message.link, async function (b64data) {
        console.log("b64 data: " + b64data);
        await detect('LABEL_DETECTION', b64data, async function (data) {
          var labels = (((data.responses || [{}])[0]).labelAnnotations || [{}]);
          if (labels.length === 0) {
            console.log('No labels detected');
          }
          var t = '';
          for (var i = 0; i < labels.length && i < MAX_LABELS; i++) {
            t += labels[i].description + ' (' + labels[i].score + ')\n';
          }
          console.log('Labels detected', t);
          await senderResponse({data: labels, index: message.index})
        });
      });

      // fetch('https://some-random-api.ml/pikachuimg')
      //       .then(response => response.text())
      //       .then(data => {
      //         console.log('link!!' + message.link)
      //         let dataObj = JSON.parse(data);
      //         senderResponse({data: dataObj, index: message.index});
      //       })
      //       .catch(error => console.log("error", error))
      //   return true;  // Will respond asynchronously.

      // fetch('https://some-random-api.ml/pikachuimg')
      //       .then(response => response.text())
      //       .then(data => {
      //         console.log('link!!' + message.link)
      //         let dataObj = JSON.parse(data);
      //         senderResponse({data: temp_image, index: message.index});
      //       })
      //       .catch(error => console.log("error", error))
      //   return true;  // Will respond asynchronously.

    }
    return true;
  });
}

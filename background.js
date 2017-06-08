
'use strict';
chrome.extension.onMessage.addListener(
    function(request){
        if(request.msg === "startFunc"){
          magic();
        }
    }
);

var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var newUtt;
    var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
    if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
        newUtt = utt;
        newUtt.text = txt;
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }
    else {
        var chunkLength = (settings && settings.chunkLength) || 160;
        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        var chunkArr = txt.match(pattRegex);

        if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
            //call once all text has been spoken...
            if (callback !== undefined) {
                callback();
            }
            return;
        }
        var chunk = chunkArr[0];
        newUtt = new SpeechSynthesisUtterance(chunk);
        var x;
        for (x in utt) {
            if (utt.hasOwnProperty(x) && x !== 'text') {
                newUtt[x] = utt[x];
            }
        }
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
            speechUtteranceChunker(utt, settings, callback);
        });
    }

    if (settings.modifier) {
        settings.modifier(newUtt);
    }
    console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
    //placing the speak invocation inside a callback fixes ordering and onend issues.
    setTimeout(function () {
        speechSynthesis.speak(newUtt);
    }, 0);
};

function magic() {
  let audioPlayer = `
      var audioPlayer;
      document.createElement('audio');
      audioPlayer = document.querySelector('audio');
      audioPlayer.id       = 'audio-player';
      audioPlayer.controls = 'controls';
      audioPlayer.src      = 'kurtec.mp3';
      audioPlayer.type     = 'audio/mpeg';
      document.getElementsByTagName('body')[0].appendChild(sound);
      audioPlayer.play();
      audioPlayer.volume = 0.2;
  `;

  chrome.tabs.getSelected(function(tab) {
      //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab

      let tabID = tab.id;
      chrome.tabs.executeScript(tabID, {
          code: "var x = document.querySelector('.nd-ViewArea__text').textContent; x"
        }, (results) => {
        var sentencies = results[0];
        var voices = window.speechSynthesis.getVoices().filter((voice) => {return ~voice.lang.indexOf('ru')});
        var ut = new SpeechSynthesisUtterance(sentencies);
        ut.voice = voices[0];
        //pass it into the chunking function to have it played out.
        //you can set the max number of characters by changing the chunkLength property below.
        //a callback function can also be added that will fire once the entire text has been spoken.
        speechUtteranceChunker(ut, {
            chunkLength: 120
        }, function () {
            //some code to execute when done
            console.log('done');
        });
    })
  });
}

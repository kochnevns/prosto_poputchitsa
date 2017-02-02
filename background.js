function getDOM() {
  console.log(document)
  return document.querySelector('.Body').textContent;
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.msg == "startFunc") func();
    }
);

function func() {
  chrome.tabs.executeScript(null,{code:"var x = document.querySelector('.Body').textContent; x"}, (results) => {
    var sentencies = results[0].split('.');
    var currentSent = 0;
    var voices = window.speechSynthesis.getVoices().filter((voice) => {return ~voice.lang.indexOf('ru')});

    function tryToPlayNext() {
      if (speechSynthesis.speaking) {
        setTimeout(tryToPlayNext, 2000);
      }
      else {
        if (currentSent < sentencies.length) {
          var ut = new SpeechSynthesisUtterance(sentencies[currentSent].trim());
          ut.voice = voices[2];
          speechSynthesis.cancel();
          speechSynthesis.speak(ut);
          currentSent++;
          tryToPlayNext();
        }


      }
    }
//  sadsada
  setTimeout(tryToPlayNext, 7300);

  })

}

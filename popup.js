document.addEventListener('DOMContentLoaded', function () {

        function getDOM() {
          console.log(document)
          return document.querySelector('.Body').textContent;
        }

          chrome.tabs.executeScript(null,{code:"var x = document.querySelector('.Body').textContent; x"}, (results) => {
            var sentencies = results[0].split('.');
            var currentSent = 0;
            function tryToPlayNext() {
              if (speechSynthesis.speaking) {
                setTimeout(tryToPlayNext, 2000);
              }
              else {
                if (currentSent < sentencies.length) {
                  speechSynthesis.cancel();
                  speechSynthesis.speak(new SpeechSynthesisUtterance(sentencies[currentSent].trim()));
                  currentSent++;
                  tryToPlayNext();
                }


              }
            }
          document.querySelector('audio').volume = 0.2;
          setTimeout(tryToPlayNext, 7300);

          })



});

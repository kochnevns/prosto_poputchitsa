document.addEventListener('DOMContentLoaded', function () {


        document.querySelector('button').addEventListener('click', function() {
          document.querySelector('audio').play();
          document.querySelector('audio').volume = 0.2;

          chrome.extension.sendMessage({ msg: "startFunc" });

        })




});

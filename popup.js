const bloodyStreamMap = {
  'Можно сдохнуть': 'can_die.mp3',
  'А меня не прёт': 'no_pret.mp3',
  'Гантеля'       : 'gantela.mp3',
  'Быть плохим заебись' : 'be_bad_zaebis.mp3',
  'Куртец'        : 'kurtec.mp3'
};


document.addEventListener('DOMContentLoaded', function () {


          let $trackList = document.querySelector('.tracklist');

            for ( let title in bloodyStreamMap) {
                let trackTemplate  = `<li>${title}</li>`;
                let $li = document.createElement('li');
                $li.innerHTML = trackTemplate;
                $trackList.appendChild($li);
                $li.addEventListener('click', (e) =>{
                  document.querySelector('source').src = 'audio/' + bloodyStreamMap[title];
                  document.querySelector('audio').load();
                })
            }


        document.querySelector('button').addEventListener('click', function() {
          document.querySelector('audio').play();
          document.querySelector('audio').volume = 0.2;

          chrome.extension.sendMessage({ msg: "startFunc" });

        })




});

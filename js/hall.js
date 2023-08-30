let chosenInfo = localStorage.getItem('chosenInfo');
let parsedChosedInfo = JSON.parse(chosenInfo);

let infoTitle = document.querySelector('.buying__info-title');
let infoStart = document.querySelector('.buying__info-start');
let infoHall = document.querySelector('.buying__info-hall');
let confStepWrapper = document.querySelector('.conf-step__wrapper');
let acceptBtn = document.querySelector('.acceptin-button');
let priceStandart = document.querySelector('.price-standart');
let priceVip = document.querySelector('.price-vip');

infoTitle.textContent = parsedChosedInfo.filmName;
infoStart.textContent = `Начало сеанса: ${parsedChosedInfo.seanceTime}`;
infoHall.textContent = parsedChosedInfo.hallName.substring(0,3) + ' ' + parsedChosedInfo.hallName.substring(3,4);
priceStandart.textContent = parsedChosedInfo.priceStandart;
priceVip.textContent = parsedChosedInfo.priceVip;

fetchData(`event=get_hallConfig&timestamp=${parsedChosedInfo.timestamp}&hallId=${parsedChosedInfo.hallId}&seanceId=${parsedChosedInfo.seanceId}`, response => {
    response ? parsedChosedInfo.hallConfig = response : console.log('Нет проданных билетов');
    confStepWrapper.innerHTML = parsedChosedInfo.hallConfig;

    let chairs = document.querySelectorAll('.conf-step__chair');
    let selectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
    selectedChairs.length ? acceptBtn.removeAttribute('disabled') : acceptBtn.setAttribute('disabled', true);

    chairs.forEach(chair => {
        chair.addEventListener('click', e => {
            if (!chair.classList.contains('conf-step__chair_taken')) {
                e.target.classList.toggle('conf-step__chair_selected');;
            }
            selectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
            selectedChairs.length ? acceptBtn.removeAttribute('disabled') : acceptBtn.setAttribute('disabled', true);
        })
    })

    acceptBtn.addEventListener('click', () => {
        let selectedPlaces = [];
        let rows = Array.from(document.getElementsByClassName("conf-step__row"));
        for (let row = 0; row < rows.length; row++) {
            let places = Array.from(rows[row].getElementsByClassName("conf-step__chair"));
            for (let place = 0; place < places.length; place++) {
                if (places[place].classList.contains("conf-step__chair_selected")) {
                    const typeOfPlace = (places[place].classList.contains("conf-step__chair_standart")) ? 'standart' : 'vip';
                    selectedPlaces.push({ row: row + 1, place: place + 1, type: typeOfPlace });
                }
            }
        }
        parsedChosedInfo.hallConfig = document.querySelector('.conf-step__wrapper').innerHTML;
        parsedChosedInfo.selectedPlaces = selectedPlaces;
        localStorage.setItem('chosenInfo', JSON.stringify(parsedChosedInfo));
        window.location.href = 'payment.html';
    })
})
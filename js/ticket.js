document.addEventListener("DOMContentLoaded", () => {
    let chosenInfo = localStorage.getItem('chosenInfo');
    let parsedChosedInfo = JSON.parse(chosenInfo);

    document.querySelector('.ticket__title').textContent = parsedChosedInfo.filmName;
    document.querySelector(".ticket__hall").textContent = parsedChosedInfo.hallName.substring(3, 4);
    document.querySelector(".ticket__start").textContent = parsedChosedInfo.seanceTime;

    let places = "";
    for (let {
            row,
            place
        }
        of parsedChosedInfo.selectedPlaces) {
        if (places !== "") {
            places += ", ";
        }
        places += `${row}/${place}`;
    }

    document.querySelector(".ticket__chairs").textContent = places;

    let infoQr = `Фильм: ${parsedChosedInfo.filmName}\nРяд/Место: ${places}\nЗал: ${parsedChosedInfo.hallName.substring(3, 4)}\nНачало: ${parsedChosedInfo.seanceTime}\nБилет действителен строго на свой сеанс!`;
    let qrCode = QRCreator(infoQr, {image: "SVG"});
    const content = (qrcode) => {
        return qrcode.error ?
            `недопустимые исходные данные ${qrcode.error}` :
            qrcode.result;
    };
    document.querySelector('.ticket__info-qr').append(content(qrCode));
})
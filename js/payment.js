let chosenInfo = localStorage.getItem('chosenInfo');
let parsedChosedInfo = JSON.parse(chosenInfo);

document.querySelector('.ticket__title').textContent = parsedChosedInfo.filmName;
document.querySelector(".ticket__hall").textContent = parsedChosedInfo.hallName.substring(3,4); 
document.querySelector(".ticket__start").textContent = parsedChosedInfo.seanceTime;


let places = "";
let cost = 0;
for (let {row, place, type} of parsedChosedInfo.selectedPlaces) {
    if (places !== "") {
		places += ", ";
	}
    places += `${row}/${place}`;
    cost += type === 'standart' ? Number(parsedChosedInfo.priceStandart) : Number(parsedChosedInfo.priceVip);
}

document.querySelector(".ticket__chairs").textContent = places;
document.querySelector(".ticket__cost").textContent = cost;  

const newHallConfig = parsedChosedInfo.hallConfig.replace(/selected/g, "taken");
parsedChosedInfo.hallConfig = newHallConfig;
localStorage.setItem('chosenInfo', JSON.stringify(parsedChosedInfo));

document.querySelector(".acceptin-button").addEventListener('click', fetchData(`event=sale_add&timestamp=${parsedChosedInfo.timestamp}&hallId=${parsedChosedInfo.hallId}&seanceId=${parsedChosedInfo.seanceId}&hallConfiguration=${newHallConfig}`, response => response))
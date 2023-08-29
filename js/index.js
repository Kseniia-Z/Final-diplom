document.addEventListener('DOMContentLoaded', () => {
    let pageNavDayWeek = document.querySelectorAll('.page-nav__day-week');
    let pageNavDayNumber = document.querySelectorAll('.page-nav__day-number');

    pageNavDayNumber.forEach((day, i) => {
        let today = new Date();
        today.setDate(today.getDate() + i);
        day.textContent = today.getDate();
    
        const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        pageNavDayWeek[i].textContent = daysOfWeek[today.getDay()];
    
        let navDay = day.parentNode;
        if (pageNavDayWeek[i].textContent == 'Сб' || pageNavDayWeek[i].textContent == 'Вс') {
            navDay.classList.add('page-nav__day_weekend');
        } else {
            navDay.classList.remove('page-nav__day_weekend');
        }
    })

    fetchData('event=update', (response => {
        const halls = response.halls.result.filter(hall => hall.hall_open == 1);
        const films = response.films.result;
        const seances = response.seances.result;

        const main = document.querySelector('main');

        films.forEach(film => {
            let seancesHTML = '';
            const filmId = film.film_id;

            halls.forEach((hall) => {
                const seancesInfo = seances.filter(seance => (seance.seance_hallid == hall.hall_id && seance.seance_filmid == filmId));
                if (seancesInfo.length > 0) {
                    seancesHTML += `
               <div class="movie-seances__hall">
                 <h3 class="movie-seances__hall-title">${hall.hall_name.substring(0,3)} ${hall.hall_name.substring(3,4)}</h3>
                 <ul class="movie-seances__list">`;
                    seancesInfo.forEach(seance => {
                        seancesHTML += `<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html" data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" data-price-vip="${hall.hall_price_vip}" data-price-standart="${hall.hall_price_standart}" data-seance-id="${seance.seance_id}" data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`;
                    });
                    seancesHTML += `
                 </ul>
               </div>`;
                }
            });

            if (seancesHTML) {
                main.innerHTML += `
                        <section class="movie">
                            <div class="movie__info">
                                <div class="movie__poster">
                                    <img class="movie__poster-image" alt='${film.film_name} постер' src='${film.film_poster}'>
                                </div>
                                <div class="movie__description">
                                    <h2 class="movie__title">${film.film_name}</h2>
                                    <p class="movie__synopsis">${film.film_description}</p>
                                    <p class="movie__data">
                                        <span class="movie__data-duration">${film.film_duration} мин.</span>
                                        <span class="movie__data-origin">${film.film_origin}</span>
                                    </p>
                                </div>
                            </div>
                            ${seancesHTML}
                        </section>`;
            }
        })

        const navDays = Array.from(document.querySelectorAll('.page-nav__day'));

        navDays.forEach(day => {
            day.addEventListener('click', e => {
                e.preventDefault();
                navDays.forEach(otherDay => otherDay.classList.remove('page-nav__day_chosen'));
                day.classList.add('page-nav__day_chosen');
                updateSeancesTime();
            })
        })

        const seancesTime = Array.from(document.querySelectorAll('.movie-seances__time'));

        function updateSeancesTime() {
            seancesTime.forEach(time => {
                let seanceStart = Number(time.dataset.seanceStart);
                let chosenDay = document.querySelector('.page-nav__day_chosen');
                let chosenDayIndex = navDays.indexOf(chosenDay);
                let chosenDate = new Date();
                chosenDate.setDate(chosenDate.getDate() + chosenDayIndex);
                chosenDate.setHours(0, 0, 0, 0);
                let seanceTime = Math.trunc(chosenDate.getTime() / 1000) + seanceStart * 60;
                time.dataset.timestamp = seanceTime;
                let currentTime = Math.trunc(new Date().getTime() / 1000);
                currentTime >= seanceTime ? time.classList.add("acceptin-button-disabled") : time.classList.remove("acceptin-button-disabled");
            })
        }
    
        updateSeancesTime();
        
        seancesTime.forEach(time => {
            time.addEventListener('click', e => {
                let hallId = e.target.dataset.hallId;
                let chosenHall = halls.find(hall => hall.hall_id == hallId);
                let chosenInfo = {
                    ...e.target.dataset,
                    hallConfig: chosenHall.hall_config
                };

                localStorage.setItem('chosenInfo', JSON.stringify(chosenInfo));
            });
        })

    }))
})
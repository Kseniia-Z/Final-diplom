function fetchData(requestBody, callback) {
    return fetch('https://jscp-diplom.netoserver.ru/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: requestBody,
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Произошла ошибка при отправке запроса!');
      }
      return response.json();
    })

    .then(response => callback(response))

    .catch(error => {
        console.error('Ошибка:' + error);
        callback(null);
    })
  }
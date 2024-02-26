(function () {
    fetch('/auth/current')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            const htmlText = `<p>Nombre: ${data.first_name}</p>
            <p>Apellido: ${data.last_name}</p>
            <p>Email: ${data.email}</p>`;
            const span = document.getElementById('profile-span')
            span.innerHTML = htmlText
        })
        .catch((error) => {
            req.logger.error(`${error.message}`)
        })
})();

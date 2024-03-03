
(function () {
    const URL_LOCAL = `http://localhost:8080`
    const URL_INTERNET = `https://coderhouse-proyectofinal-production.up.railway.app`


    document.getElementById('btnLogin').addEventListener("click", (event) => {
        if (confirm('login')) {
            // event.preventDefault();
            const email = document.getElementById("mail").value;
            const password = document.getElementById("pass").value;

            fetch(`${URL_INTERNET}/auth/login`, {
                // fetch(`${URL_LOCAL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('data', data)
                    const accessToken = data.token;
                    localStorage.setItem('access_token', accessToken)

                    console.log('data.redirect', data.redirect)
                    window.location.href = data.redirect
                })
                .catch(error => console.log('Error', error.message))
        } else {
            alert('no login')
        }
    })
})();

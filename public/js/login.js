
(function () {
    const URL_LOCAL = `http://localhost:8080`
    const URL_INTERNET = `https://coderhouse-proyectofinal-production.up.railway.app`
    const URL = `https://coderhouse-proyectofinal-production.up.railway.app`

    // const URL = `http://localhost:8080`;

    // document.getElementById('btnLogin').addEventListener("click", (event) => {
    //     if (confirm('login')) {
    //         // event.preventDefault();
    //         const email = document.getElementById("mail").value;
    //         const password = document.getElementById("pass").value;

    //         // fetch(`${URL_INTERNET}/auth/login`, {
    //         // fetch(`${URL_LOCAL}/auth/login`, {
    //         fetch(`http://localhost:8080/auth/login`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email, password }),
    //         })
    //             .then(response => {
    //                 console.log(response)
    //                 if (!response.ok) {
    //                     console.log(`HTTP error! Status: ${response.status}`);
    //                 }
    //                 console.log(response.json())
    //                 return response.json();
    //             })
    //             .then(data => {
    //                 console.log('data', data)
    //                 const accessToken = data.token;
    //                 localStorage.setItem('access_token', accessToken)

    //                 console.log('data.redirect', data.redirect)
    //                 window.location.href = data.redirect
    //             })
    //             .catch(error => console.log('Error', error.message))
    //     } else {
    //         alert('no login')
    //     }
    // })

    document.getElementById('btnLogin').addEventListener("click", async (event) => {
        try {
            if (confirm('login')) {
                const email = document.getElementById("mail").value;
                const password = document.getElementById("pass").value;

                const response = await fetch(`/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('data', data);

                const accessToken = data.token;
                localStorage.setItem('access_token', accessToken);

                console.log('data.redirect', data.redirect);
                window.location.href = data.redirect;
            } else {
                alert('no login');
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Manejar el error de manera apropiada, como mostrar un mensaje al usuario
        }
    });

})();

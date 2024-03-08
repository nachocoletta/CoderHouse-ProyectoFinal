
(function () {
    const URL_LOCAL = `http://localhost:8080`
    const URL_INTERNET = `https://coderhouse-proyectofinal-production.up.railway.app`
    const URL = URL_INTERNET

    // const URL = `http://localhost:8080`;

    document.getElementById('btnLogin').addEventListener("click", (event) => {

        // event.preventDefault();
        const email = document.getElementById("mail").value;
        const password = document.getElementById("pass").value;
        let accessToken;
        // fetch(`${URL_INTERNET}/auth/login`, {
        // fetch(`${URL_LOCAL}/auth/login`, {
        //     // fetch(`http://localhost:8080/auth/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email, password }),
        // })
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    console.log('data', data)
                    accessToken = data.token;
                    localStorage.setItem('access_token', accessToken)
                    window.location.href = data.redirect
                }
            })


            // console.log("response", response)
            // if (!response.ok) {
            //     console.log(`HTTP error! Status: ${response.status}`);
            // }
            // console.log(response.json())
            // return response.json();

            // .then(data => {
            //     console.log('data', data)
            //     accessToken = data.token;
            //     localStorage.setItem('access_token', accessToken)

            //     // console.log('data.redirect', data.redirect)

            // })
            .catch(error => {
                console.log('Error', error.message);
                // window.location.href = '/login'
                // No redirigir aquí
            })
        // .finally(() => {
        //     // Redirigir de manera predeterminada al final del bloque
        //     window.location.href = `${URL}/products`;
        // });

    })

    // function clearCookies() {
    //     const cookies = document.cookie.split(';');

    //     for (let i = 0; i < cookies.length; i++) {
    //         const cookie = cookies[i];
    //         const eqPos = cookie.indexOf('=');
    //         const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    //         document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    //     }
    // }
    // document.getElementById('btnLogin').addEventListener("click", async (event) => {
    //     try {

    //         // clearCookies();
    //         // localStorage.removeItem('access_token');

    //         const email = document.getElementById("mail").value;
    //         const password = document.getElementById("pass").value;

    //         const response = await fetch(`${URL}/auth/login`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email, password }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         // console.log('data', data);

    //         const accessToken = data.token;
    //         localStorage.setItem('access_token', accessToken);

    //         console.log('data.redirect', data.redirect);
    //         window.location.href = data.redirect;

    //     } catch (error) {
    //         console.error('Error:', error.message);
    //         // console.error('Response status:', error.response.status);
    //         console.error('Response text:', await error.response.text());
    //     }
    // });

})();

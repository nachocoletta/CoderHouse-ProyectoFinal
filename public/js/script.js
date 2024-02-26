(function () {
    document.getElementById("login-form")
        .addEventListener('submit', (event) => {
            event.preventDefault();
            // console.log('entra')

            const data = {
                email: document.getElementById('email-input').value,
                password: document.getElementById('password-input').value
            }

            fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((data) => {
                    // localStorage.setItem('token', data.access_token)
                    console.log('data', data);
                    console.log('cookies', document.cookie)
                    window.location.href = '/profile.html'
                })
                .catch((error) => {
                    console.log("error", error.message)
                })
        });
})();

(function () {
    const URL_LOCAL = `http://localhost:8080`
    const URL_INTERNET = `https://coderhouse-proyectofinal-production.up.railway.app`
    // const URL = `https://coderhouse-proyectofinal-production.up.railway.app`

    const URL = URL_INTERNET;
    const socket = io();


    const token = localStorage.getItem('access_token');
    const decodedToken = parseJwt(token);

    const userId = decodedToken ? decodedToken.id : null;
    const firstName = decodedToken ? decodedToken.first_name : null;


    // console.log('UserID:', userId);
    // console.log('FirstName:', firstName);

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }



    const buttonsDeleteUser = document.getElementsByClassName("usuarios");
    const arrayOfUserButtons = Array.from(buttonsDeleteUser);
    arrayOfUserButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            if (confirm("Desea borrar el usuario")) {
                if (userId === button.id) {
                    alert('No se puede borrar al mismo usuario que se encuentra logueado');
                    return
                }
                socket.emit('deleteUser', button.id)
                location.reload();
            }
        })
    })

    const buttonChangeRol = document.getElementsByClassName("rolUsuario");
    const arrayOfSelects = Array.from(buttonChangeRol);
    arrayOfSelects.forEach(button => {
        button.addEventListener('change', async (event) => {
            event.preventDefault();
            if (confirm("Desea cambiar el rol del usuario")) {
                socket.emit('cambiarRol', { usersId: button.id, nuevoRol: button.value })
                location.reload();
            }
        })
    })

    const buttonVolver = document.getElementById("btnVolver")

    buttonVolver.addEventListener("click", (event) => {
        event.preventDefault();
        // window.location.href = `${URL}/products`
        window.location.href = `/products`
    })
    // const selectRolUsuario = document.getElementsByClassName("rolUsuario");
    // console.log(selectRolUsuario)
    // const arrayOfRolesButtons = Array.from(selectRolUsuario);
    // console.log(arrayOfRolesButtons)
    // arrayOfRolesButtons.forEach(button => {
    //     button.addEventListener('click', async (event) => {
    //         event.preventDefault();
    //         alert('click')
    //     })
    // })
    // console.log("select ", selectRolUsuario)

    // console.log(arrayOfUsers.values)

})();
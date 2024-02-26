(function () {
    const socket = io();


    const buttonsDeleteUser = document.getElementsByClassName("usuarios");
    const arrayOfUserButtons = Array.from(buttonsDeleteUser);
    arrayOfUserButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            if (confirm("Desea borrar el usuario")) {
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
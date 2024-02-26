(function () {
    let username;

    const socket = io();


    // CHAT

    const formMessage = document.getElementById('form-message');
    // input-message
    const inputMessage = document.getElementById('input-message');
    // log-messages
    const logMessages = document.getElementById('log-messages');

    formMessage.addEventListener('submit', (event) => {
        event.preventDefault();

        // console.log("message", message);
        const message = inputMessage.value;
        socket.emit('new-message', { username, message });
        // console.log('Nuevo mensaje enviado', { username, text });
        inputMessage.value = '';
        inputMessage.focus();
    })

    function updateLogMessages(messages) {
        // console.log('messages', messages);
        logMessages.innerText = '';
        messages.forEach((msg) => {
            const p = document.createElement('p');
            p.innerText = `${msg.username}: ${msg.message}`;
            logMessages.appendChild(p);
        });
    }

    socket.on('notification', (messages) => {
        // console.log("messages", messages);
        updateLogMessages(messages);
    });

    socket.on('listMessages', (messages) => {
        updateLogMessages(messages);
    })

    socket.on('new-message-from-api', (message) => {
        console.log('new-message-from-api ->', message);
    });

    socket.on('new-client', () => {
        Swal.fire({
            text: 'Nuevo usuario conectado 🤩',
            toast: true,
            position: "top-right",
        });
    });

    Swal.fire({
        title: 'Identificate por favor 👮',
        input: 'text',
        inputLabel: 'Ingresa tu email',
        allowOutsideClick: false,
        inputValidator: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Ingresa un email válido.';
            }
            // if (!value) {
            //     return 'Necesitamos que ingreses un username para continuar!';
            // }
        },
    })
        .then((result) => {
            username = result.value.trim();
            Swal.fire({
                title: `Bienvenido ${username}`
            })
            console.log(`Hola ${username}, bienvenido 🖐️`);
        })
})();

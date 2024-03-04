(function () {

    const socket = io();

    // const buttonPurchaseOnCart = document.getElementById('comprarBtn')
    // alert(buttonPurchaseOnCart[0])
    const URL_LOCAL = `http://localhost:8080`
    const URL_INTERNET = `https://coderhouse-proyectofinal-production.up.railway.app`


    const URL = `https://coderhouse-proyectofinal-production.up.railway.app`

    // const URL = `http://localhost:8080`;

    document.getElementById('comprarBtn').addEventListener('click', function () {
        // Obtén el valor del botón "Comprar"
        const cartId = this.value;
        if (confirm("Desea completar a compra?")) {
            // alert(cartId);
            socket.emit('cartPurchase', cartId)
            alert("Ticket generado, en el cart quedaron los productos sin stock suficente para la compra")
            alert('Compra realizada, quedan en en el carrito productos sin stock');
            window.location.href = `${URL}/products`
            // window.location.href = `${URL_INTERNET}/products`


            // window.location.href = `http://localhost:8080/cart/${cartId}`;
        }
        // window.location.href = `https://coderhouse-proyectofinal-production.up.railway.app/cart/${cartId}`;
    });

})();
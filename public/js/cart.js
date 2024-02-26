(function () {

    const socket = io();

    // const buttonPurchaseOnCart = document.getElementById('comprarBtn')
    // alert(buttonPurchaseOnCart[0])


    document.getElementById('comprarBtn').addEventListener('click', function () {
        // Obtén el valor del botón "Comprar"
        const cartId = this.value;
        alert(cartId);
        socket.emit('cartPurchase', cartId)
        alert("Ticket generado, en el cart quedaron los productos sin stock suficente para la compra")
        window.location.href = `http://localhost:8080/cart/${cartId}`;
    });

})();
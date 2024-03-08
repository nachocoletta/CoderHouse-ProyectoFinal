(function () {

    const socket = io();

    // const buttonPurchaseOnCart = document.getElementById('comprarBtn')
    // alert(buttonPurchaseOnCart[0])
    const URL_LOCAL = `http://localhost:8080`
    const URL_INTERNET = `https://coderhouse-proyectofinal-production.up.railway.app`


    // const URL = `https://coderhouse-proyectofinal-production.up.railway.app`

    const URL = URL_INTERNET;

    document.getElementById('comprarBtn').addEventListener('click', function () {
        const cartId = this.value;

        const cartTable = document.getElementById('main');
        const cartItemsRows = cartTable.querySelectorAll('tr:not(:first-child)');

        if (cartItemsRows.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de realizar la compra.");
            return;
        }


        let alMenosUnProductoConStock = false;

        for (const cartItemRow of cartItemsRows) {
            const stockCell = cartItemRow.querySelector('td:nth-child(4)'); // Ajusta según la posición de la columna de stock
            const quantityCell = cartItemRow.querySelector('td:nth-child(5)'); // Ajusta según la posición de la columna de cantidad

            const stock = parseInt(stockCell.textContent);
            const quantity = parseInt(quantityCell.textContent);

            if (stock >= quantity) {
                alMenosUnProductoConStock = true;
                break; // Detener la iteración si al menos un producto tiene suficiente stock
            }
        }

        if (!alMenosUnProductoConStock) {
            alert("Ninguno de los productos tiene suficiente stock para completar la compra.");
            return;
        }

        if (confirm("Desea completar a compra?")) {
            // alert(cartId);
            socket.emit('cartPurchase', cartId)
            alert("Ticket generado, en el cart quedarán los productos sin stock suficente para la compra");
            // alert('Compra realizada, quedan en en el carrito productos sin stock');
            // window.location.href = `${URL}/products`
            window.location.href = `/products`
            // window.location.href = `${URL_INTERNET}/products`


            // window.location.href = `http://localhost:8080/cart/${cartId}`;
        }
        // window.location.href = `https://coderhouse-proyectofinal-production.up.railway.app/cart/${cartId}`;
    });

})();
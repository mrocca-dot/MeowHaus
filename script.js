/* ===========================
   INICIALIZACIÓN
=========================== */

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarContador();
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function cargarProductos() {
    fetch("productos.json")
        .then(res => res.json())
        .then(productos => mostrarProductos(productos))
        .catch(err => console.log("Error al cargar productos:", err));
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("productos-container");
    contenedor.innerHTML = "";

    productos.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("producto-card");

        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <p class="precio">$${prod.precio}</p>
            <button class="btn-carrito" data-id="${prod.id}">Agregar al carrito</button>
        `;

        contenedor.appendChild(card);
    });
}


function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContador() {
    const contador = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById("contador-carrito").textContent = contador;
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-carrito")) {

        const idProducto = e.target.dataset.id;

        fetch("productos.json")
            .then(res => res.json())
            .then(productos => {
                const producto = productos.find(p => p.id == idProducto);

                const item = carrito.find(p => p.id == producto.id);

                if (item) {
                    item.cantidad++;
                } else {
                    carrito.push({...producto, cantidad: 1});
                }

                guardarCarrito();
                actualizarContador();

                // Animación del botón
                e.target.classList.add("agregado");
                setTimeout(() => e.target.classList.remove("agregado"), 300);
            });
    }
});


document.getElementById("btn-ver-carrito").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío 🐾");
        return;
    }

    mostrarCarritoPopup();
    document.getElementById("popup-carrito").style.display = "flex";
});


document.getElementById("cerrar-popup").addEventListener("click", () => {
    document.getElementById("popup-carrito").style.display = "none";
});


window.addEventListener("click", (e) => {
    const popup = document.getElementById("popup-carrito");
    if (e.target === popup) popup.style.display = "none";
});


function mostrarCarritoPopup() {
    const contenedor = document.getElementById("lista-carrito");
    const total = document.getElementById("total-carrito");

    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p class="carrito-vacio">Tu carrito está vacío 🐾</p>
        `;
        total.textContent = "";
        return;
    }

    let suma = 0;

    carrito.forEach(item => {
        suma += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.classList.add("item-popup");

        div.innerHTML = `
            <span>${item.nombre} (${item.cantidad})</span>
            <button class="eliminar" data-id="${item.id}">X</button>
        `;

        contenedor.appendChild(div);
    });

    total.textContent = "Total: $" + suma;
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {

        const id = e.target.dataset.id;
        carrito = carrito.filter(item => item.id != id);

        guardarCarrito();
        mostrarCarritoPopup();
        actualizarContador();
    }
});

document.getElementById("vaciar-carrito").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarritoPopup();
    actualizarContador();
});


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("finalizar-btn")) {

        carrito = [];
        guardarCarrito();
        actualizarContador();

        document.getElementById("popup-carrito").style.display = "none";

        window.location.href = "compra-finalizada.html";
    }
});
document.getElementById("form-contacto").addEventListener("submit", function (e) {
    
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (nombre === "" || email === "" || mensaje === "") {
        e.preventDefault();
        alert("Por favor completá todos los campos.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        e.preventDefault();
        alert("Por favor ingresá un correo válido.");
        return;
    }
});
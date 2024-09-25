const maxProductos = 5;
let productos = 1;

function agregarProducto() {
    if (productos < maxProductos) {
        productos++;
        const productosDiv = document.getElementById('productos');
        
        const nuevoProducto = document.createElement('tr');
        nuevoProducto.setAttribute('id', `productoDiv${productos}`);
        
        nuevoProducto.innerHTML = `
            <td><input type="number" id="cantidad${productos}" min="1" value="1" oninput="validarCantidad(this)" onblur="corregirCantidad(this)"></td>
            <td>
                <select id="producto${productos}">
                    <option value="computadora">Computadora</option>
                    <option value="impresora">Impresora</option>
                    <option value="router">Router</option>
                    <option value="CableUTP-6">Cable UTP-6</option>
                    <option value="monitor">Monitor</option>
                </select>
            </td>
            <td><input type="text" id="precio${productos}" value="0.00" oninput="validarPrecio(this)" onblur="corregirPrecio(this)"></td>
            <td><span id="subtotal${productos}">0.00</span></td>
            <td><button type="button" class="remove-btn" onclick="eliminarProducto(${productos})">X</button></td>
        `;
        productosDiv.appendChild(nuevoProducto);
    } else {
        alert('Solo se permiten agregar hasta 5 productos.');
    }
}

function eliminarProducto(id) {
    const productoDiv = document.getElementById(`productoDiv${id}`);
    if (productoDiv) {
        productoDiv.remove();
        productos--;
        calcularPresupuesto();
    }
}

function calcularPresupuesto() {
    let totalSinIva = 0;

    for (let i = 1; i <= maxProductos; i++) {
        const cantidadEl = document.getElementById(`cantidad${i}`);
        const precioEl = document.getElementById(`precio${i}`);

        if (cantidadEl && precioEl) {
            const cantidad = parseInt(cantidadEl.value);
            const precio = parseFloat(precioEl.value);
            const subtotal = cantidad * precio;
            document.getElementById(`subtotal${i}`).textContent = subtotal.toFixed(2);
            totalSinIva += subtotal;
        }
    }

    const iva = totalSinIva * 0.21;
    const totalConIva = totalSinIva + iva;
    const ahora12 = totalConIva / 12;
    const ahora18 = (totalConIva * 1.75) / 18;

    document.getElementById('totalSinIva').textContent = totalSinIva.toFixed(2);
    document.getElementById('iva').textContent = iva.toFixed(2);
    document.getElementById('totalConIva').textContent = totalConIva.toFixed(2);
    document.getElementById('ahora12').textContent = ahora12.toFixed(2);
    document.getElementById('ahora18').textContent = ahora18.toFixed(2);
}

// Permitir que se borre y escriba el número pero corregir al salir del campo
function validarCantidad(input) {
    input.value = input.value.replace(/[^0-9]/g, ''); // Solo permitir números
}

function corregirCantidad(input) {
    if (input.value === '' || input.value < 1) {
        input.value = 1; // Corregir al salir del campo si es vacío o menor que 1
    }
}

function validarPrecio(input) {
    // Eliminar ceros iniciales no necesarios
    input.value = input.value.replace(/^0+/, '');

    // Limitar a números positivos con dos decimales
    let value = input.value;
    value = value.replace(/[^0-9.]/g, ''); // Eliminar todo lo que no sea número o punto decimal
    const decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1) {
        value = value.slice(0, decimalIndex + 1) + value.slice(decimalIndex + 1).replace(/[^0-9]/g, '').slice(0, 2); // Limitar a dos decimales
    }
    input.value = value;
}

// Corregir el formato del precio si está vacío o no tiene decimales al salir del campo
function corregirPrecio(input) {
    if (input.value === '' || parseFloat(input.value) < 0) {
        input.value = '0.00'; // Si el valor es vacío o negativo, lo forzamos a 0.00
    } else {
        input.value = parseFloat(input.value).toFixed(2); // Asegurar dos decimales
    }
}

function imprimirPresupuesto() {
    window.print();
}

function generarPDF() {
var { jsPDF } = window.jspdf;
var doc = new jsPDF();

// Título del presupuesto
doc.setFontSize(16);
doc.text("Generador de Presupuestos", 105, 10, null, null, 'center');

// Cliente
doc.setFontSize(12);
doc.text("Cliente: " + document.getElementById('cliente').value, 10, 20);

let yPosition = 30; // Control de posición vertical en el PDF

doc.text("Detalles de los productos:", 10, yPosition);
yPosition += 10;

// Encabezado de la tabla
doc.setFontSize(10);
doc.text("Cantidad", 10, yPosition);
doc.text("Producto", 40, yPosition);
doc.text("Precio Unitario", 100, yPosition);
doc.text("Total", 160, yPosition);
yPosition += 10;

// Iterar sobre los productos
for (let i = 1; i <= maxProductos; i++) {
    const cantidadEl = document.getElementById(`cantidad${i}`);
    const productoEl = document.getElementById(`producto${i}`);
    const precioEl = document.getElementById(`precio${i}`);
    const subtotalEl = document.getElementById(`subtotal${i}`);

    if (cantidadEl && productoEl && precioEl && subtotalEl) {
        const cantidad = parseInt(cantidadEl.value);
        const producto = productoEl.options[productoEl.selectedIndex].text;
        const precioUnitario = parseFloat(precioEl.value).toFixed(2);
        const subtotal = parseFloat(subtotalEl.textContent).toFixed(2);

        // Agregar cada producto en una línea con el formato adecuado
        doc.text(cantidad.toString(), 10, yPosition);
        doc.text(producto, 40, yPosition);
        doc.text("$" + precioUnitario, 100, yPosition, null, null, 'right');
        doc.text("$" + subtotal, 160, yPosition, null, null, 'right');
        yPosition += 10;
    }
}

yPosition += 10; // Espacio antes del total general

// Subtotal, IVA y total
doc.setFontSize(12);
doc.text("Subtotal: $" + document.getElementById('totalSinIva').textContent, 10, yPosition);
yPosition += 10;
doc.text("IVA (21%): $" + document.getElementById('iva').textContent, 10, yPosition);
yPosition += 10;
doc.text("Total: $" + document.getElementById('totalConIva').textContent, 10, yPosition);
yPosition += 10;
doc.text("Cuota Ahora 12 (sin interés): $" + document.getElementById('ahora12').textContent, 10, yPosition);
yPosition += 10;
doc.text("Cuota Ahora 18 (75% de interés): $" + document.getElementById('ahora18').textContent, 10, yPosition);

doc.save("presupuesto.pdf");
}
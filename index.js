// ==========================================
// DATA INICIAL (Base de datos del Inventario en CLP)
// ==========================================
const inventarioInicial = [
    { id: 1, nombre: "Laptop Pro", precio: 1200000, tieneStock: true },
    { id: 2, nombre: "Mouse Ergonómico Vertical", precio: 14990, tieneStock: true },
    { id: 3, nombre: "Monitor 4K", precio: 399990, tieneStock: false },
    { id: 4, nombre: "Teclado Mecánico", precio: 85000, tieneStock: true },
    { id: 5, nombre: "Audífonos Studio", precio: 149990, tieneStock: false }
];

// Variable global para controlar las mutaciones visuales
let productosActuales = [...inventarioInicial];

// Función auxiliar para dar formato de pesos chilenos (CLP)
const formatearCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Math.round(valor));
};

// ==========================================
// FUNCIÓN AUXILIAR: RENDERIZAR EN EL DOM
// ==========================================
const renderizarInventario = (listaProductos) => {
    const container = document.getElementById("inventario-container");
    container.innerHTML = "";

    listaProductos.forEach(producto => {
        // Uso de Destructuring para extraer los datos limpiamente
        const { nombre, precio, tieneStock } = producto;

        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${nombre}</h3>
            <p><strong>Precio:</strong> ${formatearCLP(precio)}</p>
            <span class="stock-badge ${tieneStock ? 'con-stock' : 'sin-stock'}">
                ${tieneStock ? 'Disponible' : 'Sin Stock'}
            </span>
        `;
        container.appendChild(card);
    });
};

// ==========================================
// 1. filter() - Listar productos disponibles
// ==========================================
const filtrarDisponibles = () => {
    const disponibles = inventarioInicial.filter(producto => producto.tieneStock === true);
    productosActuales = disponibles;
    renderizarInventario(productosActuales);
};

// ==========================================
// 2. map() - Aplicar 15% de descuento
// ==========================================
const aplicarDescuento = () => {
    // map crea un nuevo array modificando los precios (precio * 0.85)
    const productosConDescuento = productosActuales.map(producto => {
        return {
            ...producto, // Copiamos el objeto original de manera segura
            precio: producto.precio * 0.85
        };
    });
    productosActuales = productosConDescuento;
    renderizarInventario(productosActuales);
    
    // Recalcular métricas reflejando el descuento aplicado
    calcularMetricas();
};

// ==========================================
// 3. reduce() - Calcular valor total del inventario
// ==========================================
const calcularValorTotal = (lista) => {
    const total = lista.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    document.getElementById("valor-total").innerHTML = `<strong>Valor Total del Inventario:</strong> ${formatearCLP(total)}`;
};

// ==========================================
// 4. find() - Encontrar el producto más caro
// ==========================================
const encontrarMasCaro = (lista) => {
    if (lista.length === 0) {
        document.getElementById("producto-caro").innerHTML = `<strong>Producto más Caro:</strong> N/A`;
        return;
    }
    // Primero obtenemos cuál es el precio máximo de la lista
    const precioMaximo = Math.max(...lista.map(p => p.precio));
    
    // Usamos find() para ubicar el objeto que coincida con ese precio máximo
    const productoCaro = lista.find(producto => producto.precio === precioMaximo);
    
    if (productoCaro) {
        document.getElementById("producto-caro").innerHTML = `<strong>Producto más Caro:</strong> ${productoCaro.nombre} (${formatearCLP(productoCaro.precio)})`;
    }
};

// Función intermedia para actualizar las métricas superiores simultáneamente
const calcularMetricas = () => {
    calcularValorTotal(productosActuales);
    encontrarMasCaro(productosActuales);
};

// ==========================================
// 5. async/await - Simular guardar inventario
// ==========================================
// Promesa que emula el guardado con delay de servidor
const promesaGuardarBD = (datos) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (datos.length > 0) {
                resolve("¡Inventario guardado con éxito en la Base de Datos!");
            } else {
                reject("Error: No hay datos para guardar.");
            }
        }, 1500); // Demora de 1.5 segundos
    });
};

// Función asíncrona usando async/await
const guardarInventarioAsync = async () => {
    const statusEl = document.getElementById("status-message");
    statusEl.innerText = "Sincronizando y guardando cambios de manera asíncrona...";
    
    try {
        const respuesta = await promesaGuardarBD(productosActuales);
        alert(respuesta);
        statusEl.innerText = "Sincronización completada.";
    } catch (error) {
        console.error(error);
        statusEl.innerText = "Ocurrió un error al guardar.";
    }
};

// ==========================================
// INICIALIZACIÓN Y EVENTOS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Carga inicial
    renderizarInventario(productosActuales);
    calcularMetricas();

    // Eventos de los botones
    document.getElementById("btn-original").addEventListener("click", () => {
        productosActuales = [...inventarioInicial];
        renderizarInventario(productosActuales);
        calcularMetricas();
    });
    
    document.getElementById("btn-filter").addEventListener("click", filtrarDisponibles);
    document.getElementById("btn-map").addEventListener("click", aplicarDescuento);
    document.getElementById("btn-save").addEventListener("click", guardarInventarioAsync);
});
//variables
const productos = document.getElementById('productos')
const productosListos = document.getElementById('productosAgregados')
const totalCompra = document.getElementById('totalCompra')
const modeloTarjeta = document.getElementById('tarjeta').content
const totalProductos = document.getElementById('sumaTotal').content
const productosComprados = document.getElementById('carritoDeCompras').content
const crearTarjeta = document.createDocumentFragment()
let carrito = {}


//funcion extraer datos de productos.json
document.addEventListener('DOMContentLoaded', () => {
    extraerDeJson()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        agregarProductos()
    }
})

productos.addEventListener('click', (e) => {
    agregarAlCarrito(e)
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,       
        iconColor: 'black',
        color: 'black',
        confirmButtonColor: 'black',
        width: '250px',
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Has comprado un producto'
    })
})

productosListos.addEventListener('click', () => {
    botonAccion()
})

async function extraerDeJson (params) {
    try {
        const response = await fetch("./productos.json")
        const data = await response.json()
        //console.log(data)
        hacerTarjetas(data)
    } catch (error) {
        //console.log(error)
    }
}

//creo las tarjetas bootstrap

const hacerTarjetas = data => {
    data.forEach(producto => {
        modeloTarjeta.querySelector('h5').textContent = producto.nombre
        modeloTarjeta.querySelector('h6').textContent = producto.precioVenta
        modeloTarjeta.querySelector('img').setAttribute("src", producto.imagen)
        modeloTarjeta.querySelector('.botonComprar').dataset.id = producto.id


        const crear = modeloTarjeta.cloneNode(true)
        crearTarjeta.appendChild(crear)
    })
    productos.appendChild(crearTarjeta)
}

//boton agregar al carrito
const agregarAlCarrito = e => {
    //console.log(e.target)
    if (e.target.classList.contains('botonComprar')) {
        establecerCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

//creto el carrito
const establecerCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector('.botonComprar').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precioVenta: objeto.querySelector('h6').textContent,
        //imagen: document.querySelector("img").src
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {
        ...producto
    }
    agregarProductos()
    //console.log(producto)
}

//agrego productos al carrito
const agregarProductos = () => {
    //console.log(carrito)
    productosListos.innerHTML = ""
    //48:59

    Object.values(carrito).forEach(producto => {
        productosComprados.querySelector('th').textContent = producto.id
        productosComprados.querySelectorAll('td')[0].textContent = producto.nombre
        productosComprados.querySelectorAll('td')[1].textContent = producto.cantidad
        productosComprados.querySelector('.botonSuma').dataset.id = producto.id
        productosComprados.querySelector('.botonResta').dataset.id = producto.id
        productosComprados.querySelector('span').textContent = producto.cantidad * producto.precioVenta
        
        const crear = productosComprados.cloneNode(true)
        crearTarjeta.appendChild(crear)
    })
    productosListos.appendChild(crearTarjeta)
    sumaTotalProductos()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//Hago suma total de productos y cantidad
const sumaTotalProductos = () => {
    totalCompra.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        totalCompra.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `
        return sumaTotalProductos
    }
    const cantidadTotal = Object.values(carrito).reduce((acumulador, {
        cantidad
    }) => acumulador + cantidad, 0)
    const precioTotal = Object.values(carrito).reduce((acumulador, {
        cantidad,
        precioVenta
    }) => acumulador + cantidad * precioVenta, 0)
    //console.log(cantidadTotal)
    //console.log(precioTotal)

    totalProductos.querySelectorAll('td')[0].textContent = cantidadTotal
    totalProductos.querySelector('span').textContent = precioTotal
    const crear = totalProductos.cloneNode(true)
    crearTarjeta.appendChild(crear)
    totalCompra.appendChild(crearTarjeta)


    //vaciar carrito
    const botonVaciarCarrito = document.getElementById('vaciar-carrito')
    botonVaciarCarrito.addEventListener('click', () => {
        carrito = {}
        agregarProductos()
        Swal.fire({
            icon: 'warning',
            title: 'Una Lástima, espero compres algo!!!',
            text: 'MUCHAS FELICIDADES',
            iconColor: 'black',
            color: 'black',
            confirmButtonColor: 'black'
        })
    })
}

const botonAccion = e => {
    //console.log(e.target)
    // le doy funcion al boton de aumentar cantidad de productos
    if (e.target.classList.contains('botonSuma')) {
        //console.log(carrito[e.target.dataset.id])
        //carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {
            ...producto
        }
        agregarProductos()
    } else if (e.target.classList.contains('botonResta')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        //carrito[e.target.dataset.id] = {...producto}
        agregarProductos()
    }
    e.stopPropagation()
}
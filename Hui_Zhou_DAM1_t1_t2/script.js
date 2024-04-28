let selectPrecioMinimo = document.getElementById("select-precioMin");
let selectMarca = document.getElementById("select-marca");
let selectCategoria = document.getElementById("select-categoria");
let busquedaBoton = document.getElementById("select-botonBusqueda");
let fila = document.getElementById("fila");
let productsContainer = document.getElementById("products");
let cartItemsContainer = document.getElementById("cart-items");
let cart = [];

// Evento cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", function () {
  // Click botón de búsqueda
  busquedaBoton.addEventListener("click", function () {
    let precioMinimo = parseFloat(selectPrecioMinimo.value);
    let categoriaSeleccionada = selectCategoria.value;
    let marcaSeleccionada = selectMarca.value;

    fila.innerHTML = ""; // Limpiar la fila antes de agregar los productos filtrados

    fetch("https://dummyjson.com/products") //Json
      .then((response) => response.json()) //Promesas
      .then((data) => {
        let productosFiltrados = data.products.filter((producto) => {
          let cumpleFiltrado = true;
          if (precioMinimo && producto.price < precioMinimo) {
            cumpleFiltrado = false;
          }
          if (
            categoriaSeleccionada &&
            producto.category !== categoriaSeleccionada
          ) {
            cumpleFiltrado = false;
          }
          if (marcaSeleccionada && producto.brand !== marcaSeleccionada) {
            cumpleFiltrado = false;
          }
          return cumpleFiltrado;
        });

        productsContainer.innerHTML = ""; // Limpiar los productos antes de mostrar los nuevos

        //Filtro productos
        productosFiltrados.forEach((producto) => {
          let card = `
                    <div animate__animated animate__bounceInDown class="col-md-4 card mb-4">
                        <img src="${producto.thumbnail}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${producto.title}</h5>
                            <p class="card-text">${producto.price} €</p>
                            <p class="card-text">${producto.category}</p>
                            <button id="${producto.id}" class="btn btn-primary">Añadir al carrito</button>
                        </div>
                    </div>`;
          productsContainer.innerHTML += card;
        });
      })
      .catch((error) => console.error("Error al cargar los productos:", error));
  });

  // Evento clic en los botones "Añadir a carrito"
  productsContainer.addEventListener("click", function (event) {
    if (event.target && event.target.nodeName == "BUTTON") {
      let productId = event.target.id; // Obtener el ID del producto desde el atributo id del botón
      añadirCarrito(productId); // Llamar a la función añadirCarrito con el ID del producto
    }
  });

  loadCategoriesAndBrands(); // Cargar categorías y marcas
});

// Función para añadir un producto al carrito
function añadirCarrito(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      const productExists = cart.find((item) => item.id === product.id);
      if (productExists) {
        productExists.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      mostrarCarrito();
      Swal.fire({
        title: "Correcto",
        text: "Producto agregado al carrito",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
    .catch((error) => {
      console.error("Error al agregar producto al carrito:", error);
      Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error al agregar el producto al carrito",
        icon: "error",
        confirmButtonText: "Ok",
      });
    });
}

// Función para mostrar el carrito
function mostrarCarrito() {
  cartItemsContainer.innerHTML = ""; // Limpiar el carrito antes de mostrar los productos
  cart.forEach((item) => {
    cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <h5>${item.title} (x${item.quantity})</h5>
                <p>${item.price} € - Total: ${item.price * item.quantity} €</p>
                <button class="btn btn-secondary"onclick="eliminarCarrito(${
                  item.id
                })">Eliminar</button>
            </div>`;
  });
}

// Función para eliminar un producto del carrito
function eliminarCarrito(productId) {
  cart = cart.filter((item) => item.id !== productId);
  mostrarCarrito();
  Swal.fire({
    title: "Correcto",
    text: "Producto eliminado del carrito correctamente",
    icon: "success",
    confirmButtonText: "Ok",
  });
}

// Función para cargar categorías y marcas
function loadCategoriesAndBrands() {
  fetch("https://dummyjson.com/products")
    .then((response) => response.json())
    .then((data) => {
      const categoryList = [];
      const brandList = [];
      data.products.forEach((product) => {
        if (!categoryList.includes(product.category)) {
          categoryList.push(product.category);
        }
        if (!brandList.includes(product.brand)) {
          brandList.push(product.brand);
        }
      });
      fillSelectOptions(selectCategoria, categoryList);
      fillSelectOptions(selectMarca, brandList);
    })
    .catch((error) =>
      console.error("Error al cargar las categorías y marcas:", error)
    );
}

// Función para llenar las opciones de un elemento select
function fillSelectOptions(selectElement, options) {
  selectElement.innerHTML = '<option value="">Seleccionar</option>';
  options.forEach((option) => {
    selectElement.innerHTML += `<option value="${option}">${option}</option>`;
  });
}

let productos = [];
let categoriasSeleccionadas = "all";
const busqueda = document.querySelector("#buscar");


const contenedor = document.querySelector("#productos");
const cargarProductos = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    productos = await response.json();
    if (productos.length === 0) {
      console.warn("no hay productos");
      throw new Error("No se encontraron productos");
    } else {
        mostrarProductos(productos);
    }
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos</p>";
  }
};

const mostrarProductos = (productos) => {
  contenedor.innerHTML = "";
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add(
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "p-4",
      "flex",
      "flex-col",
      "items-center",
      "hover:shadow-lg",
      "transition-shadow",
      "duration-300"
    );
    div.innerHTML = `
        <h2 class="text-lg font-bold mb-2">${producto.title}</h2>
        <img src="${producto.image}" alt="${producto.title}" loading="lazy" class="w-32 h-32 object-contain mb-4">
        <p>Precio: $${producto.price}</p>
        <button class="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors duration-300">Agregar al carrito</button>
      `;
    contenedor.append(div);
  });
};

async function cargarCategorias() {
try {
    const respuesta = await fetch("https://fakestoreapi.com/products/categories");
    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    const categorias = await respuesta.json();
    mostrarCategorias(["all", ...categorias]);
  } catch (error) {
    console.error("Error al cargar las categorias:", error);
    contenedor.innerHTML = "<p>Error al cargar las categorias</p>";
  }
}

function filtrarProductos() {
  let filtrados = productos;

  if (categoriasSeleccionadas !== "all") {
    filtrados = filtrados.filter((p) => p.category === categoriasSeleccionadas);
  }


  const texto = busqueda.value.toLowerCase();
  if(texto.trim() !== "") {
    filtrados = filtrados.filter((p) =>
      p.title.toLowerCase().includes(texto) ||
      p.description.toLowerCase().includes(texto)
    );
  }

  mostrarProductos(filtrados);

}

function mostrarCategorias(categorias) {
  const contenedorCategorias = document.querySelector("#categorias");
  contenedorCategorias.innerHTML = ""; 

  categorias.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1); 
    btn.className =
      `text-gray-800 px-4 py-2 rounded m-1 hover:bg-gray-300 transition-colors duration-300 ${categoriasSeleccionadas === cat ? "bg-blue-900 text-white" : "bg-gray-200"} `;

    btn.addEventListener("click", () => {
      categoriasSeleccionadas = cat; 
      mostrarCategorias(categorias); 
      filtrarProductos(); 
    });

    contenedorCategorias.appendChild(btn); 
  });
}


busqueda.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarCategorias();
});
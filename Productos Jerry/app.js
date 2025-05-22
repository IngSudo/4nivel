let productos = [];
let categoriasSeleccionadas = "all";
const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
const inputBuscar = document.getElementById("buscar");

//logica de login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // no recargar la pagina

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const mensaje = document.getElementById("mensaje");

      try {
        const response = await fetch("https://fakestoreapi.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); // almacenar el token en localStorage
        mensaje.textContent = "Login exitoso";
        mensaje.classList.add("text-green-500");

        setTimeout(() => {
          window.location.href = "index.html"; // redireccionar a la pagina principal despues de 1.5 segundos
        }, 1500);
      } catch (error) {
        console.error("Error en el login:", error);
        mensaje.textContent = "Error en el login";
        mensaje.classList.add("text-red-500");
      }
    });
  }
  
  if (contenedorProductos && contenedorCategorias && inputBuscar) {
    cargarCategorias();
    cargarProductos();
    inputBuscar.addEventListener("input", filtrarProductos);
  }
});



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
    contenedorProductos.innerHTML = "<p>Error al cargar los productos</p>";
  }
};

const mostrarProductos = (productos) => {
  contenedorProductos.innerHTML = "";
  productos.forEach((producto, idx) => {
    const div = document.createElement("div");
    div.classList.add(
      "bg-blue-50",
      "rounded-lg",
      "shadow-md",
      "p-4",
      "flex",
      "flex-col",
      "items-center",
      "hover:shadow-lg",
      "transition-shadow",
      "duration-300",
      "relative"
    );
    div.innerHTML = `
      <h2 class="text-lg text-center font-bold mb-2">${producto.title}</h2>
      <img src="${producto.image}" alt="${producto.title}" loading="lazy" class="w-32 h-32 object-contain mb-4">
      <p>Precio: $${producto.price}</p>
      <button class="bg-green-200 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors duration-300">Agregar</button>
      <button id="verDetalle${idx}" class="bg-green-200 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700 transition">Mas Info</button>
      <div id="modalDetalle${idx}"
        class="
          hidden
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          sm:left-full sm:top-0 sm:ml-4 sm:translate-x-0 sm:translate-y-0
          z-50 bg-blue-50 rounded-lg shadow-lg p-6 w-80 border border-gray-200
        ">
        <button id="cerrarModal${idx}" class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">&times;</button>
        <h3 class="text-xl font-bold mb-2">${producto.title}</h3>
        <img src="${producto.image}" alt="${producto.title}" loading="lazy" class="w-32 h-32 object-contain mb-4 mx-auto block">
        <p class="mb-2 text-gray-700">${producto.description}</p>
        <p class="font-semibold text-blue-700 mb-1">Categoría: ${producto.category}</p>
        <p class="font-bold text-green-600">Precio: $${producto.price}</p>
      </div>
    `;

    setTimeout(() => {
      const btnVer = div.querySelector(`#verDetalle${idx}`);
      const modal = div.querySelector(`#modalDetalle${idx}`);
      const btnCerrar = div.querySelector(`#cerrarModal${idx}`);

      function handleClickOutside(e) {
        if (modal && !modal.contains(e.target) && e.target !== btnVer) {
          modal.classList.add("hidden");
          document.removeEventListener("mousedown", handleClickOutside);
        }
      }

      if (btnVer && modal && btnCerrar) {
        btnVer.onclick = () => {
          modal.classList.remove("hidden");
          setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
          }, 0);
        };
        btnCerrar.onclick = () => {
          modal.classList.add("hidden");
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, 0);

    contenedorProductos.append(div);
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
    contenedorCategorias.innerHTML = "<p>Error al cargar las categorias</p>";
  }
}

function filtrarProductos() {
  let filtrados = productos;

  if (categoriasSeleccionadas !== "all") {
    filtrados = filtrados.filter((p) => p.category === categoriasSeleccionadas);
  }

  const texto = inputBuscar.value.toLowerCase(); 
  if (texto.trim() !== "") {
    filtrados = filtrados.filter(
      (p) =>
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

function cerrarSesion() {
  localStorage.removeItem("token"); 
  window.location.href = "login.html"; 
}


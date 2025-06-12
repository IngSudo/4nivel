// Este script obtiene y muestra los productos desde la API Laravel

fetch('http://127.0.0.1:8000/api/productos')
  .then(response => response.json())
  .then(productos => {
    productos.forEach(producto => {
      console.log(`Título: ${producto.titulo}`);
      console.log(`Descripción: ${producto.descripcion}`);
      console.log(`Precio: $${producto.precio}`);
      console.log(`Stock: ${producto.stock}`);
      console.log(`Image: ${producto.imagen}`);
      console.log('-----------------------------');
    });
  })
  .catch(error => {
    console.error('Error al obtener los productos:', error);
  });
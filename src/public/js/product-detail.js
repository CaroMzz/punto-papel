const box = document.querySelector(".cart-box");
const button = document.querySelector("#addToCartBtn");
const cartInput = document.querySelector("#cartId");
const message = document.querySelector("#cartMessage");

const savedCartId = localStorage.getItem("cartId");

if (savedCartId) {
  cartInput.value = savedCartId;
}

button.addEventListener("click", async () => {
  const productId = box.dataset.productId;
  const cartId = cartInput.value.trim();

  if (!cartId) {
    message.textContent = "Ingresa un ID de carrito.";
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.error || "No se pudo agregar el producto.";
      return;
    }

    localStorage.setItem("cartId", cartId);
    message.textContent = "Producto agregado al carrito.";
  } catch (error) {
    message.textContent = "Error al conectar con el servidor.";
  }
});

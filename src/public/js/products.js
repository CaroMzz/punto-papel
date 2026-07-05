const createCartBtn = document.querySelector("#createCartBtn");
const currentCartLink = document.querySelector("#currentCartLink");
const cartStatus = document.querySelector("#cartStatus");

const savedCartId = localStorage.getItem("cartId");

if (savedCartId) {
  currentCartLink.href = `/carts/${savedCartId}`;
  currentCartLink.classList.remove("hidden");
  cartStatus.textContent = `Carrito actual: ${savedCartId}`;
}

createCartBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/carts", {
      method: "POST",
    });

    if (!response.ok) {
      cartStatus.textContent = "No se pudo crear el carrito.";
      return;
    }

    const cart = await response.json();

    localStorage.setItem("cartId", cart._id);

    currentCartLink.href = `/carts/${cart._id}`;
    currentCartLink.classList.remove("hidden");
    cartStatus.textContent = `Carrito creado: ${cart._id}`;
  } catch (error) {
    cartStatus.textContent = "Error al conectar con el servidor.";
  }
});
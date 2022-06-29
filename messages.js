const bot = require("./bot");
const {
  apiSearchProduct,
  apiGetProducts,
  apiPostUser,
  apiPostCart,
  apiGetCart,
} = require("./mongodbAPI");

const {
  mainMenu,
  productsMenu,
  productResultMenu,
  cartMenu,
} = require("./buttons");

// Request a la api para obtener 1 producto por su id
async function searchProduct(msg) {
  let id = msg.from.id;
  const replyMarkup = productResultMenu;
  bot.sendMessage(id, "buscando...");
  try {
    const text = await apiSearchProduct(msg);
    bot.sendMessage(id, text, { replyMarkup });
    waitUserInputSearch = false;
  } catch (error) {
    bot.sendMessage(id, "no se encontro el producto");
    waitUserInputSearch = false;
  }
}

// Request a la api para obtener el listado de productos e imprimirlos
async function getProducts(msg) {
  let id = msg.from.id;
  const replyMarkup = productsMenu;
  try {
    const text = await apiGetProducts();
    bot.sendMessage(id, text, { replyMarkup });
  } catch (error) {
    console.log(error);
  }
}

// Request para agregar el usuario a la base de datos y envia mensaje de bienvenida
async function postUser(msg) {
  const replyMarkup = mainMenu;
  await apiPostUser(msg);
  userId = msg.from.id;
  bot.sendMessage(
    userId,
    "Bienvenido a nuestra tienda!\nSeleccione una de las siguientes opciones:",
    {
      replyMarkup,
    }
  );
}

// Request a la api para añadir los item al carrito del ususario
async function addToCart(msg) {
  const replyMarkup = cartMenu;
  try {
    // agrega los ids de los items al carrito del usuario
    await apiPostCart(msg);
    bot.sendMessage(
      msg.from.id,
      "Productos agregados exitosamente al carrito",
      { replyMarkup }
    );
    waitUserInputCart = false;
  } catch (error) {
    bot.sendMessage(
      msg.from.id,
      "Error, no se agregaron los productos al carrito",
      { replyMarkup }
    );
    console.log(error);
  }
}

// imprime los items en el carrito del usuario
async function getCart(msg) {
  try {
    const text = await apiGetCart(msg);
    bot.sendMessage(msg.from.id, text);
  } catch (error) {
    console.log(error);
  }
}

function showMainMenu(msg) {
  const replyMarkup = mainMenu;
  bot.sendMessage(msg.from.id, "Seleccione una de las siguientes opciones:", {
    replyMarkup,
  });
}
module.exports = { searchProduct, getProducts, postUser, addToCart, getCart, showMainMenu };

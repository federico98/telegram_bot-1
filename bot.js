const TeleBot = require("telebot");
const axios = require("axios");
const token = require("./token");
const buttons = require("./buttons");
const bot = new TeleBot({
  token: token,
  usePlugins: ["commandButton"],
});

// menu principal
const mainMenu = bot.inlineKeyboard([
  [
    bot.inlineButton(buttons.showProducts.label, {
      callback: buttons.showProducts.command,
    }),
  ],
  [
    bot.inlineButton(buttons.delivery.label, {
      callback: buttons.delivery.command,
    }),
  ],
  [
    bot.inlineButton(buttons.payment.label, {
      callback: buttons.payment.command,
    }),
  ],
]);

// submenu de productos
const productsMenu = bot.inlineKeyboard([
  [
    bot.inlineButton(buttons.searchProduct.label, {
      callback: buttons.searchProduct.command,
    }),
    bot.inlineButton(buttons.addToCart.label, {
      callback: buttons.addToCart.command,
    }),
  ],
  [
    bot.inlineButton(buttons.back.label, {
      callback: buttons.back.command,
    }),
  ],
]);

// variable auxiliar para esperar input de usuario
let waitUserInput = false;

// funcion para buscar producto
async function searchProduct(msg) {
  if (waitUserInput) {
    let id = msg.from.id;
    bot.sendMessage(id, "buscando...");
    const response = await axios.get(
      `https://fakestoreapi.com/products/${msg.text}`
    );
    const text = `${response.data.title}\n\n${response.data.description}\n\n${response.data.price} $${response.data.image}`;
    bot.sendMessage(id, text);
    waitUserInput = false;
  }
}

// funcion para obterner los 20 productos
async function getProducts(msg) {
  let id = msg.from.id;
  const replyMarkup = productsMenu;
  try {
    const response = await axios.get(
      "https://fakestoreapi.com/products?limit=20"
    );
    const text = response.data
      .map((item) => {
        return `${item.id} ${item.title} ${item.price}`;
      })
      .join("\n");
    bot.sendMessage(id, text, { replyMarkup });
    console.log(text);
  } catch (error) {
    console.log(error);
  }
}
// mensaje de bienvenida
bot.on("/start", (msg) => {
  const replyMarkup = mainMenu;
  bot.sendMessage(
    msg.from.id,
    "Bienvenido a nuestra tienda!\nSeleccione una de las siguientes opciones:",
    {
      replyMarkup,
    }
  );
});

// mostrar el menu principal
bot.on(["/mainMenu"], (msg) => {
  const replyMarkup = mainMenu;
  bot.sendMessage(msg.from.id, "Seleccione una de las siguientes opciones:", {
    replyMarkup,
  });
});

// mostrar los 20 productos
bot.on("/showProducts", getProducts);

// esperar input de usuario para buscar el producto
bot.on("/searchProduct", (msg) => {
  let id = msg.from.id;
  bot.sendMessage(id, "introduzca el numero del producto que desea buscar");
  waitUserInput = true;
});

// buscar producto por id, explicacion y prueba del regex: https://regex101.com/r/MDTN6R/1
bot.on(/^1?\d$|^20$/, searchProduct);

bot.on("callbackQuery", (msg) => {
  console.log("callbackQuery data:", msg.data);
  bot.answerCallbackQuery(msg.id);
});

bot.connect();

const TeleBot = require("telebot");
require("dotenv").config();
const bot = new TeleBot({
  token: process.env.TOKEN,
  usePlugins: ["commandButton"],
});
module.exports = bot;

const {
  searchProduct,
  getProducts,
  postUser,
  addToCart,
  getCart,
  showMainMenu,
} = require("./messages");

// variable auxiliar para esperar input de usuario
let waitUserInputSearch = false;
let waitUserInputCart = false;

// mensaje de bienvenida
bot.on("/start", postUser);

// mostrar el menu principal
bot.on(["/mainMenu"], showMainMenu);

// mostrar los 20 productos
bot.on("/showProducts", getProducts);

// esperar input de usuario para buscar el producto
bot.on("/searchProduct", (msg) => {
  let id = msg.from.id;
  bot.sendMessage(id, "introduzca el numero del producto que desea buscar");
  waitUserInputSearch = true;
});

// buscar producto por id, explicacion y prueba del regex: https://regex101.com/r/MDTN6R/1
bot.on(/^1?\d$|^20$/, (msg) => {
  if (waitUserInputSearch) {
    searchProduct(msg);
  }
});

bot.on("/addToCart", (msg) => {
  let id = msg.from.id;
  bot.sendMessage(
    id,
    "introduzca los numeros de los items que desea agregar al carrito"
  );
  waitUserInputCart = true;
});

bot.on("text", (msg) => {
  if (waitUserInputCart) {
    addToCart(msg);
  }
});

bot.on("/goToCart", getCart);

bot.on("callbackQuery", (msg) => {
  console.log("callbackQuery data:", msg.data);
  bot.answerCallbackQuery(msg.id);
});

bot.connect();

const TeleBot = require("telebot");
const axios = require("axios");
const ENDPOINT = "https://fakestoreapi.com/products/1";
const buttons = require("./buttons");
const bot = new TeleBot({
  token: "5444295484:AAE_U7oTe17V1PrWNhDqHPoG1lf4tATrXHE",
  usePlugins: ["commandButton"],
});

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

bot.on("/start", (msg) => {
  const replyMarkup = mainMenu;
  msg.reply.text("Bienvenido a nuestra tienda");
  bot.sendMessage(msg.from.id, "Seleccione una de las siguientes opciones:", {
    replyMarkup,
  });
});

bot.on("/showProducts", getProducts);

bot.on("callbackQuery", (msg) => {
  console.log("callbackQuery data:", msg.data);
  bot.answerCallbackQuery(msg.id);
});

bot.connect();

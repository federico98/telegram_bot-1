const TeleBot = require("telebot");
const axios = require("axios");
const ENDPOINT = "https://fakestoreapi.com/products/1";
const buttons = require("./buttons");
const bot = new TeleBot({
  token: "5444295484:AAE_U7oTe17V1PrWNhDqHPoG1lf4tATrXHE",
  usePlugins: ["namedButtons"],
  pluginConfig: {
    namedButtons: {
      buttons: buttons,
    },
  },
});

let replyMarkup = bot.keyboard(
  [
    [buttons.showProducts.label, buttons.payment.label],
    [buttons.delivery.label],
  ],
  { resize: true }
);

bot.on("/start", (msg) => {
  // msg.reply.text("Bienvenido a nuestra tienda") ;
  bot.sendMessage(msg.from.id, "Seleccione un opcion", { replyMarkup });
});

bot.on("text", (msg) => {
  let id = msg.from.id;
  let text = msg.text;
  if (text === "hello") {
    bot.sendMessage(id, "hi");
  }

  if (text === "foo") {
    axios.get(ENDPOINT).then((response) => {
      textLength = response.data.title.length;
      bot.sendMessage(id, textLength);
    });
  }
});

bot.connect();

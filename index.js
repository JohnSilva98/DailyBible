const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
// dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Permite ao bot receber informações sobre servidores (guilds)
    GatewayIntentBits.GuildMessages, // Permite ao bot receber mensagens em servidores
    GatewayIntentBits.MessageContent, // Permite ao bot receber conteúdo de mensagens
  ],
});
const prefix = "!"; // Prefixo do bot

client.once("ready", () => {
  console.log("Bot está online!");
});

client.on("message", (message) => {
  if (message.content.startsWith(prefix) || message.author.bot) return;

  // Se quiser comandos adicionais, pode adicionar aqui
});

async function enviarVersiculoAleatorio(channel) {
  try {
    const response = await axios.get(
      "https://www.abibliadigital.com.br/api/verses/nvi/random",
      {}
    );

    const versiculo = response.data;
    console.log("Resposta da API:", versiculo);
    if (versiculo && versiculo.text) {
      channel.send(
        `**${versiculo.book.name} ${versiculo.chapter}:${versiculo.number}**\n${versiculo.text}`
      );
    } else {
      console.error("Versículo não encontrado na resposta da API.");
    }
  } catch (error) {
    console.error("Erro ao obter versículo bíblico:", error.message);
  }
}

client.on("ready", () => {
  console.log("Bot está online!");
  // Definir um intervalo para enviar o versículo todos os dias às 10h
  const horaDoEnvio = "10:00";
  const [hora, minutos] = horaDoEnvio.split(":");

  const agora = new Date();
  const proximoEnvio = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    parseInt(hora, 10),
    parseInt(minutos, 10),
    0
  );

  if (agora > proximoEnvio) {
    proximoEnvio.setDate(proximoEnvio.getDate() + 1);
  }

  const diferenca = proximoEnvio - agora;
  console.log(`Próximo envio em ${diferenca / Math.floor(60 * 1000)} minutos.`);

  setTimeout(() => {
    // Enviar versículo quando chegar a hora
    const canalPadrao = client.channels.cache.get("1199732280634122432"); // Substitua pelo ID do canal desejado
    enviarVersiculoAleatorio(canalPadrao);

    // Repetir a cada 24 horas
    setInterval(() => {
      enviarVersiculoAleatorio(canalPadrao);
    }, 24 * 60 * 60 * 1000);
  }, diferenca);
});

client.login(TOKEN);

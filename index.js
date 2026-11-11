const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const config = require('./config');
const banco = require('./respuestas.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Función para obtener un elemento aleatorio de cualquier lista
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generador inteligente de respuestas
function generarRespuesta(usuario) {
  const intro = randomItem(banco.intros);
  const sus = randomItem(banco.sustantivos);
  const adj = randomItem(banco.adjetivos);
  const acc = randomItem(banco.acciones);
  const lug = randomItem(banco.lugares);
  const cie = randomItem(banco.cierres);

  return `${intro} **${usuario}**, eres **${sus} ${adj}** que ${acc} ${lug}. ${cie}`;
}

client.once('ready', () => {
  console.log(`🔥 Bot optimizado y conectado como: ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase();
  const args = msg.slice(config.prefix.length);

  // Comprobar comandos mediante el archivo de configuración
  if (config.comandos.includes(args)) {
    const respuesta = generarRespuesta(message.author.username);
    
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🔥 Generador de Calor')
      .setDescription(respuesta)
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  // Detección automática de palabras clave
  if (config.palabrasClave.some(palabra => msg.includes(palabra))) {
    const respuesta = generarRespuesta(message.author.username);
    message.reply(respuesta);
  }
});

client.login(process.env.DISCORD_TOKEN);

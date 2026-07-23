require("dotenv").config({ quiet: true });

const { App } = require("@slack/bolt");
const axios = require("axios");

const missingTokens = ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN"].filter(
  (name) => !process.env[name]
);

if (missingTokens.length > 0) {
  console.error(`Missing ${missingTokens.join(" and ")} in your .env file.`);
  process.exit(1);
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/oliverueno-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();

  await respond(`Pong! That took ${Date.now() - start}ms.`);
});

app.command("/oliverueno-help", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text: [
      "*Ueno Bot commands*",
      "`/oliverueno-ping` - check if the bot is online",
      "`/oliverueno-catfact` - get a random cat fact",
      "`/oliverueno-joke` - get a random joke",
      "`/oliverueno-status` - see how long the bot has been running"
    ].join("\n")
  });
});

app.command("/oliverueno-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000
    });
    await respond(`*Cat fact:* ${response.data.fact}`);
  } catch (error) {
    console.error("Cat fact request failed:", error.message);
    await respond("I couldn't get a cat fact right now. Try again in a bit!");
  }
});

app.command("/oliverueno-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke",
      { timeout: 5000 }
    );

    await respond(`${response.data.setup}\n\n${response.data.punchline}`);
  } catch (error) {
    console.error("Joke request failed:", error.message);
    await respond("I couldn't get a joke right now. Try again in a bit!");
  }
});

app.command("/oliverueno-status", async ({ ack, respond }) => {
  await ack();

  const totalMinutes = Math.floor(process.uptime() / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  await respond(`I'm online! Uptime: ${hours}h ${minutes}m.`);
});

app.event("app_mention", async ({ event, say }) => {
  await say({
    text: "Hey! Try `/oliverueno-help` to see what I can do.",
    thread_ts: event.ts
  });
});

app.message(async ({ message, say }) => {
  if (message.subtype || message.bot_id) {
    return;
  }

  await say("Hey! Try `/oliverueno-help` to see what I can do.");
});

app.error(async (error) => {
  console.error("Slack error:", error);
});

(async () => {
  await app.start();
  console.log("Ueno Bot is running!");
})();

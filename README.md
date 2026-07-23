# Ueno Bot

Ueno Bot is a small Slack bot built with JavaScript, Slack Bolt, and Socket
Mode. It has ping, help, cat fact, joke, and status commands.

## Submission checklist

- **Responds to messages:** it replies to direct messages, mentions, and slash
  commands.
- **At least 3 functions:** it has five different slash commands.
- **No command collisions:** every command starts with `/oliverueno-`.
- **Online 24/7:** the included systemd service restarts the bot after crashes
  or server restarts.

Before submitting, start the service on Nest and run this:

```sh
systemctl status ueno-bot.service
```

It must show `active (running)`. Then stop the copy on your laptop, close the
laptop, and test a command from Slack. That proves the response came from Nest.

## 1. Create the Slack app

The quickest setup is to use the included manifest:

1. Open [Your Slack Apps](https://api.slack.com/apps).
2. Click **Create New App**, then **From an app manifest**.
3. Choose the Hack Club workspace.
4. Pick YAML and paste everything from `manifest.yml`.
5. Review it and click **Create**.

The manifest turns on Socket Mode, adds the bot scopes, and creates these
commands:

- `/oliverueno-ping`
- `/oliverueno-help`
- `/oliverueno-catfact`
- `/oliverueno-joke`
- `/oliverueno-status`

If one of those names is already taken in the Hack Club workspace, change the
same command in both `manifest.yml` and `index.js`.

## 2. Get the two Slack tokens

First create the Socket Mode token:

1. In the app settings, open **Basic Information**.
2. Find **App-Level Tokens** and choose **Generate Token and Scopes**.
3. Name it `ueno-bot-socket`.
4. Add the `connections:write` scope and generate it.
5. Copy the token beginning with `xapp-`.

Then install the bot:

1. Open **Install App**.
2. Click **Install to Workspace** and approve it.
3. Open **OAuth & Permissions**.
4. Copy the **Bot User OAuth Token** beginning with `xoxb-`.

Never paste either token into Slack, GitHub, `index.js`, or a screenshot.

## 3. Add the tokens locally

Install the packages:

```sh
npm install
```

Make your private environment file:

```sh
cp .env.example .env
```

Open `.env` and replace the example values with the real tokens:

```dotenv
SLACK_BOT_TOKEN=xoxb-your-real-token
SLACK_APP_TOKEN=xapp-your-real-token
```

The `.env` file is already ignored by Git.

## 4. Run and test it

Start the bot:

```sh
npm start
```

You should see `Ueno Bot is running!`. Test `/oliverueno-ping` in `#bot-spam`
or in a private test channel. You can also send the bot a direct message or
mention it in a channel. Stop it with `Control+C`.

For development, this command restarts the bot whenever a file changes:

```sh
npm run dev
```

## 5. Hackatime

This folder is a Git project named `Slack_Bot`. Hackatime uses the Git project
folder as its project name, so activity from this folder will appear under
`Slack_Bot`.

Your computer already has the Hackatime endpoint and API key in
`~/.wakatime.cfg`, plus the WakaTime command-line program. Make sure the
**WakaTime** VS Code extension is enabled, open this whole folder in VS Code,
and edit for a few minutes. Then check
[your Hackatime dashboard](https://hackatime.hackclub.com/).

Hackatime tracks actual editor activity, so simply running the bot does not add
coding time.

## 6. Put it on GitHub

The repository has already been initialized with the `main` branch. After you
make an empty GitHub repository, run:

```sh
git add .
git commit -m "Make my Slack bot"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Before pushing, run `git status` and make sure `.env` is not listed.

## 7. Keep it online on Nest

SSH into Nest, then install Node and Git if they are not installed:

```sh
apt update
apt install -y git curl ca-certificates
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
```

Clone and set up the project:

```sh
cd /root
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ueno-slack-bot
cd ueno-slack-bot
npm install --omit=dev
cp .env.example .env
nano .env
```

Paste the real Slack tokens into `.env`, save, and test with `npm start`. Once
it works, stop it with `Control+C`.

The service file assumes the repo is `/root/ueno-slack-bot` and Node is
`/usr/bin/node`. Check both with `pwd` and `which node`, then install it:

```sh
cp deploy/ueno-bot.service /etc/systemd/system/ueno-bot.service
systemctl daemon-reload
systemctl enable --now ueno-bot.service
systemctl status ueno-bot.service
```

To watch logs or restart after a new Git push:

```sh
journalctl -u ueno-bot.service -f
systemctl restart ueno-bot.service
```

If your Nest account uses user services instead of a root system service, put
the service in `~/.config/systemd/user/` and use `systemctl --user`.

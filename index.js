const { ShardingManager } = require('discord.js');
const chalk = require('chalk');
const { token } = require('./config.json');

const clearConsole = () => process.stdout.write('\x1Bc');

if (!token || typeof token !== 'string') {
  console.log(chalk.red('Token Invalid!!'));
  process.exit(1);
}

const manager = new ShardingManager('./bot.js', {
  token: token,
  totalShards: 14,
});

console.log(chalk.red(`
 /$$   /$$             /$$                     /$$                          
| $$  | $$            | $$                    | $$                          
| $$  | $$  /$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$$                          
| $$$$$$$$ |____  $$|_  $$_/   /$$__  $$ /$$__  $$                          
| $$__  $$  /$$$$$$$  | $$    | $$$$$$$$| $$  | $$                          
| $$  | $$ /$$__  $$  | $$ /$$| $$_____/| $$  | $$                          
| $$  | $$|  $$$$$$$  |  $$$$/|  $$$$$$$|  $$$$$$$                          
|__/  |__/ \\_______/   \\___/   \\_______/ \\_______/                          
                                                                            
                                                                            
                                                                            
 /$$                                 /$$ /$$                                
| $$                                | $$|__/                                
| $$        /$$$$$$   /$$$$$$   /$$$$$$$ /$$ /$$$$$$$   /$$$$$$             
| $$       /$$__  $$ |____  $$ /$$__  $$| $$| $$__  $$ /$$__  $$            
| $$      | $$  \\ $$  /$$$$$$$| $$  | $$| $$| $$  \\ $$| $$  \\ $$            
| $$      | $$  | $$ /$$__  $$| $$  | $$| $$| $$  | $$| $$  | $$            
| $$$$$$$$|  $$$$$$/|  $$$$$$$|  $$$$$$$| $$| $$  | $$|  $$$$$$$ /$$ /$$ /$$
|________/ \\______/  \\_______/ \\_______/|__/|__/  |__/ \\____  $$|__/|__/|__/
                                                       /$$  \\ $$            
                                                      |  $$$$$$/            
                                                       \\______/              
`));

manager.on('shardCreate', (shard) => {
  console.log(chalk.green(`Launched shard ${shard.id}`));
});

manager.spawn().then(() => {
  clearConsole();

  console.log(chalk.red(`
  ███▄    █  █    ██  ██ ▄█▀▓█████  ██▀███  
  ██ ▀█   █  ██  ▓██▒ ██▄█▒ ▓█   ▀ ▓██ ▒ ██▒
 ▓██  ▀█ ██▒▓██  ▒██░▓███▄░ ▒███   ▓██ ░▄█ ▒
 ▓██▒  ▐▌██▒▓▓█  ░██░▓██ █▄ ▒▓█  ▄ ▒██▀▀█▄  
 ▒██░   ▓██░▒▒█████▓ ▒██▒ █▄░▒████▒░██▓ ▒██▒
 ░ ▒░   ▒ ▒ ░▒▓▒ ▒ ▒ ▒ ▒▒ ▓▒░░ ▒░ ░░ ▒▓ ░▒▓░
 ░ ░░   ░ ▒░░░▒░ ░ ░ ░ ░▒ ▒░ ░ ░  ░  ░▒ ░ ▒░
    ░   ░ ░  ░░░ ░ ░ ░ ░░ ░    ░     ░░   ░ 
          ░    ░     ░  ░      ░  ░   ░     
  `));

  manager.broadcastEval(client => client.user?.tag).then((results) => {
    const username = results.find(tag => tag) || 'Unknown';

    console.log(chalk.green(`Logged in as ${username}`));
    console.log(chalk.red('Made by Omkar'));
  }).catch((err) => {
    console.log(chalk.red(`Error fetching bot username: ${err.message}`));
  });
}).catch((err) => {
  console.log(chalk.red(`Error spawning shards: ${err.message}`));
});

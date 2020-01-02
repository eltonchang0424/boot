const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const axios = require('axios');

// NO SWEAR
var bad_words = []; // fill in profane words here
var bad_words_2 = [];
var responses = ['Hey! Watch your mouth!', 'Don\'t make me ask you again!', 'Please don\'t swear!', 'You kiss your mother with that mouth?', 'No swearing on my christian discord server!'];

// TTT
var board = [
	[":one:", ":two:", ":three:"],
	[":four:", ":five:", ":six:"],
	[":seven:", ":eight:", ":nine:"]
];
var gameStart = false;
var foundPartner = false;
var possibleMoves = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var playerNames = [];
var players = [];
var playerGoing;

// 8BALL
var ballResponses = [
'It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.',
'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'
]

client.once('ready', () => {
	console.log('Ready!')
})

// JUGGLE
var juggle = false;

// MUSIC FILTER
var filter = false;
var songName = '';

client.on('message', async message => {
	// NO SWEAR
	var message_stripped = message.content.toLowerCase().replace(/(.)\1+/g, '$1');
	var message_stripped_arr = message_stripped.split(" ");
	var message_arr = message.content.toLowerCase().split(" ");
	for (var i = 0; i < bad_words.length; i++)
	{
		if(message_stripped_arr.includes(bad_words[i]) || message_arr.includes(bad_words[i]) || message_stripped.includes(bad_words_2[i]) || message.content.toLowerCase().includes(bad_words_2[i]))
		{
			message.delete().then(msg => console.log(`Deleted message from ${msg.author.username}`)).catch(console.error);
			var random = Math.floor(Math.random() * responses.length);
			message.author.send(responses[random]);
			break;
		}
	}

	if (!(message.content.startsWith(prefix) || message.content.startsWith('!')) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase(); // !ttt abc, ttt is command, abc is args[0]
	var startRoll = Math.floor(Math.random() * 2) + 1;

	// JUGGLE
	var guild = client.guilds.get('422231428558880780');
	var voiceChannels = guild.channels.array();
	var vcID = [];
	for (var i = 0; i < voiceChannels.length; i++)
	{
		if (voiceChannels[i].type == 'voice')
		{
			vcID.push(voiceChannels[i].id);
		}
	}

	if (command === 'juggle')
	{
		if (message.member.hasPermission(['MOVE_MEMBERS']))
		{
			let victim = message.mentions.members.first();
			var originalChannel = victim.voiceChannelID;
			var juggleTime = args[1];
			var prev = 0;

			while (juggleTime > 0)
			{
				var newPrev = prev;
				random = Math.floor(Math.random() * vcID.length);
				prev = random;
				if (newPrev == prev)
				{
					random = Math.floor(Math.random() * vcID.length);
				}
				//console.log(random);
				victim.setVoiceChannel(vcID[random]);
				//let move = setTimeout(() => {victim.setVoiceChannel(vcID[random])}, 500);
				juggleTime--;
			}

			victim.setVoiceChannel(originalChannel);
		}
	}

	// MUSIC FILTER
	if (command === 'filter')
	{
		if (args[0] == 'on')
		{
			if(filter)
			{
				message.channel.send('Music filter already on.');
			}
			else
			{
				message.channel.send('Music filter now on. Skipping all explicit content.');
				filter = true;
			}
		}
		else if (args[0] == 'off')
		{
			if(!filter)
			{
				message.channel.send('Music filter already off.');
			}
			else
			{
				message.channel.send('Music filter now off.');
				filter = false;
			}
		}
	}

	if(message.content.includes('!play'))
	{
		songName = message.content.slice(6);
		var base_url = "https://api.musixmatch.com/ws/1.1/";
		var api_key = "&apikey=685f1936dedd9de94a8d20094439f50f";
		var api_call = base_url + 'track.search?q=' + songName + '&s_track_rating=desc' + api_key;
		let get_data = async() => {
			let response = await axios.get(api_call);
			let data = response.data;
			return data;
		}
		let data = await get_data();
		let explicit = data.message.body.track_list[0].track.explicit;
		if(explicit && filter)
		{
			// do something to stop music
			//let sendMsg = setTimeout(() => {message.channel.send('!skip');}, 1000);
			var mem = message.guild.members.find(m => m.user.username.toLowerCase() === 'rythm');
			//console.log(mem);
			let kickRhythm = setTimeout(() => {mem.setVoiceChannel(null);}, 3000);
		}
		console.log(data.message.body.track_list[0].track);
	}

	// 8BALL
	if (command === '8ball')
	{
		random = Math.floor(Math.random() * 15) + 1;
		var ballPretext = ":8ball: says: "
		switch(random)
		{
			case 1:
				message.channel.send(ballPretext + ballResponses[0]);
				break;
			case 2:
				message.channel.send(ballPretext + ballResponses[1]);
				break;
			case 3:
				message.channel.send(ballPretext + ballResponses[2]);
				break;
			case 4:
				message.channel.send(ballPretext + ballResponses[3]);
				break;
			case 5:
				message.channel.send(ballPretext + ballResponses[4]);
				break;
			case 6:
				message.channel.send(ballPretext + ballResponses[5]);
				break;
			case 7:
				message.channel.send(ballPretext + ballResponses[6]);
				break;
			case 8:
				message.channel.send(ballPretext + ballResponses[7]);
				break;
			case 9:
				message.channel.send(ballPretext + ballResponses[8]);
				break;
			case 10:
				message.channel.send(ballPretext + ballResponses[9]);
				break;
			case 11:
				message.channel.send(ballPretext + ballResponses[10]);
				break;
			case 12:
				message.channel.send(ballPretext + ballResponses[11]);
				break;
			case 13:
				message.channel.send(ballPretext + ballResponses[12]);
				break;
			case 14:
				message.channel.send(ballPretext + ballResponses[13]);
				break;
			case 15:
				message.channel.send(ballPretext + ballResponses[14]);
				break;
		}
	}

	// TTT
	if (command === 'ttt')
	{
		if (args[0] == "start")
		{
			if (!gameStart)
			{
				if(!playerNames.includes(message.author.username))
				{
					playerNames.push(message.author.username);
				}
				if(!players.includes(message.author))
				{
					players.push(message.author);
				}

				//console.log(players.length);
				if(players.length == 2)
				{
					foundPartner = true;
					console.log('Initiating game')
					gameStart = true;
					message.channel.send('Starting game!');
					var startRoll = Math.floor(Math.random() * 2) + 1;
					if (startRoll == 1)
					{
						playerGoing = players[0];
					}
					else
					{
						playerGoing = players[1];
					}
					message.channel.send(playerGoing.username + " is going first!");
					message.channel.send(tttToString());
					return;
				}
				else
				{
					message.channel.send('Waiting for contenders...');
				}
			}
			else
			{
				message.channel.send('Game already in progress!');
			}
		}
		
		if(gameStart)
		{
			if(!isNaN(args[0]))
			{
				if (playerGoing == message.author)
				{
					if (possibleMoves.indexOf(args[0]) !== -1)
					{
						var indexOfNextPlayer = 0;
						for (var i = 0; i < players.length; i++)
						{
							if (players[i] == message.author)
							{
								indexOfNextPlayer = Math.abs(i - 1);
							}
						}
						playerGoing = players[indexOfNextPlayer];

						var marker = ":x:";
						if (indexOfNextPlayer == 1)
						{
							marker = ":o:";
						}
						placeMove(args[0], board, marker);

						removeItem(args[0], possibleMoves);
						message.channel.send(tttToString());

						//check for win here
						var gameState = checkWin();
						if(gameState != 3)
						{
							message.channel.send(message.author.username + " wins!");
							board = [
								[":one:", ":two:", ":three:"],
								[":four:", ":five:", ":six:"],
								[":seven:", ":eight:", ":nine:"]
							];
							gameStart = false;
							foundPartner = false;
							possibleMoves = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
							playerNames = [];
							players = [];
						}

						else if (possibleMoves.length == 0)
						{
							message.channel.send("It's a draw.");
							board = [
								[":one:", ":two:", ":three:"],
								[":four:", ":five:", ":six:"],
								[":seven:", ":eight:", ":nine:"]
							];
							gameStart = false;
							foundPartner = false;
							possibleMoves = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
							playerNames = [];
							players = [];
						}
					}
					else
					{
						message.channel.send('Invalid move.');
					}
				}
				else
				{
					message.channel.send(message.author.username + " , it is not your turn!");
				}
			}
		}
	}
})

function removeItem(item, arr)
{
	//removes item from array
	for (var i = 0; i < arr.length; i++)
	{
		if (item == arr[i])
		{
			arr.splice(i, 1);
		}
	}
}

function placeMove(move, board, marker)
{
	switch(move)
	{
		case "1":
			board[0][0] = marker;
			break;
		case "2":
			board[0][1] = marker;
			break;
		case "3":
			board[0][2] = marker;
			break;
		case "4":
			board[1][0] = marker;
			break;
		case "5":
			board[1][1] = marker;
			break;
		case "6":
			board[1][2] = marker;
			break;
		case "7":
			board[2][0] = marker;
			break;
		case "8":
			board[2][1] = marker;
			break;
		case "9":
			board[2][2] = marker;
			break;
	}
}

function tttToString()
{
	// prints out the board
	var boardString = "Tic Tac Toe match between " + playerNames[0] + " and " + playerNames[1] + "\n";
	for (var i = 0; i < board.length; i++)
	{
		for (var j = 0; j < board[i].length; j++)
		{
			boardString += board[i][j];
		}
		boardString += '\n';
	}
	return boardString;
}

function checkWin()
{
	// 1 = o win, 2 = x win, 3 = still going/tie
	var LDSum = 0;
	for (var i = 0; i < board.length; i++)
	{
		var rowSum = 0;
		for (var j = 0; j < board[i].length; j++)
		{
			if(i == j && board[i][j] == ":x:")
			{
				LDSum -= 1;
			}
			else if (i == j && board[i][j] == ":o:")
			{
				LDSum += 1;
			}

			if (board[i][j] == ":x:")
			{
				rowSum -= 1;
			}
			else if (board[i][j] == ":o:")
			{
				rowSum += 1;
			}

			if (rowSum == 3)
			{
				return 1;
			}
			else if (rowSum == -3)
			{
				return 2;
			}

			if (LDSum == 3)
			{
				return 1;
			}
			else if (LDSum == -3)
			{
				return 2;
			}
		}
	}

	var RDSum = 0;
	for (var i = 0; i < board.length; i++)
	{
		var colSum = 0;
		for (var j = 0; j < board[i].length; j++)
		{
			if(Math.abs(i - 2) == j && board[i][j] == ":x:")
			{
				RDSum -= 1;
			}
			else if(Math.abs(i - 2) == j && board[i][j] == ":0:")
			{
				RDSum += 1;
			}

			if (board[j][i] == ":x:")
			{
				colSum -= 1;
			}
			else if (board[j][i] == ":o:")
			{
				colSum += 1;
			}

			if (colSum == 3)
			{
				return 1;
			}
			else if (colSum == -3)
			{
				return 2;
			}

			if (RDSum == 3)
			{
				return 1;
			}
			else if (RDSum == -3)
			{
				return 2;
			}
		}
	}

	return 3;
}

// client.on('voiceStateUpdate', (oldMember, newMember) => {
//  	if(newMember.user.username.toLowerCase() === 'rythm')
 	// {
 	// 	console.log("rythm joined");
 	// 	var vc;
 	// 	if(newMember.voiceChannel !== undefined)
 	// 	{
 	// 		vc = newMember.voiceChannel;
 	// 		newMember.voiceChannel.join();
 	// 		console.log(vc.name);
 	// 	}
 	// 	else
 	// 	{
 	// 		console.log(vc.name);
 	// 		message.guild.voiceConnection.channel.leave();
 	// 	}
 	// }

	// if(oldUserChannel === undefined && newUserChannel !== undefined) {
	// 	console.log(newMember.user.username);
	// 	if(newMember )
	// }
// })

client.login(token);
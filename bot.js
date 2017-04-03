const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = 'token here';
const bot = new TelegramBot(token, { polling: true });

var shutup = false;
var replytimer;
var shutuptimer;
var murmurtimer;

var textlist = fs.readFileSync('./text').toString().split("\n");
textlist.splice(-1,1);

function RandomText(){
	return textlist[Math.floor(Math.random()*textlist.length)];
}

bot.onText(/\/start/,message => {
	const chatId = message.chat.id;

	text = `
歡迎使用句點Bot
有感每個群組都有人被句點實在太難過了
所以開發了這個小小的Bot
當有人回話後超過五分鐘沒有其他人回應
Bot就會隨機回覆一個訊息
	
/help 顯示使用說明`

	bot.sendMessage(chatId,text);
});

bot.onText(/\/help/,message => {
	const chatId = message.chat.id;

	text = `
Usage:
/help 顯示此說明
/shutup 安靜一小時
/murmur 碎碎念模式
`
	
	bot.sendMessage(chatId,text);
});

bot.onText(/^(?!\/)/,message => {
	if(shutup) return;
	const chatId = message.chat.id;
	clearTimeout(replytimer);
	replytimer = setTimeout(function(){
		bot.sendMessage(chatId,RandomText());
		console.log('reply.');
	},10*60*1000);
	console.log('reply timer start');
});

bot.onText(/\/shutup/,message => {
	const chatId = message.chat.id;
	clearTimeout(shutuptimer);
	shutup = true;
	setTimeout(function(){
		shutup = false;
		console.log('restart');
		bot.sendMessage(chatId,'安安我又復活囉 <3');
	},1*60*60*1000);
	bot.sendMessage(chatId,'對不起我閉嘴QQ');
	console.log('set mute mode');
});

bot.onText(/\/murmur/,message => {
	const chatId = message.chat.id;
	bot.sendMessage(chatId,'等等 還在開發呢!');
});

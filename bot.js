const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const token = require('./token');

const bot = new TelegramBot(token, { polling: true });

var map = {};

const textlist = fs.readFileSync('./text').toString().split("\n");
textlist.splice(-1,1);

function RandomText(){
	return textlist[Math.floor(Math.random()*textlist.length)];
}

function init(chatId){
	console.log("New user :"+chatId);
	map[chatId] = {
	shutup: false,
	replytimer: setTimeout(function(){},0),
	shutuptimer: setTimeout(function(){},0),
	murmurtimer: setInterval(function(){},1000*60*60*24)
	};
}

bot.onText(/\/start/,message => {
	const chatId = message.chat.id;

	if(!(chatId in map)){
		init(chatId);
	}

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

	if(!(chatId in map)){
		init(chatId);
	}

	text = `
Usage:
/help 顯示此說明
/shutup 安靜一小時
/murmur 碎碎念模式
`
	
	bot.sendMessage(chatId,text);
});

bot.onText(/^(?!\/)/,message => {
	const chatId = message.chat.id;

	if(!(chatId in map)){
		init(chatId);
	}

	if(map[chatId].shutup) return;
	clearTimeout(map[chatId].replytimer);
	map[chatId].replytimer = setTimeout(function(){
		bot.sendMessage(chatId,RandomText());
	},10*60*1000);
});

bot.onText(/\/shutup/,message => {
	const chatId = message.chat.id;

	if(!(chatId in map)){
		init(chatId);
	}
	
	clearTimeout(map[chatId].shutuptimer);
	clearInterval(map[chatId].murmurtimer);
	map[chatId].shutup = true;
	map[chatId].shutuptimer = setTimeout(function(){
		map[chatId].shutup = false;
		console.log('[Log] restart : '+chatId);
		bot.sendMessage(chatId,'安安我又復活囉 <3');
	},1*60*60*1000);
	bot.sendMessage(chatId,'對不起我閉嘴QQ');
	console.log('[Log] mute mode : '+chatId);
});

bot.onText(/\/murmur/,message => {
	const chatId = message.chat.id;

	if(!(chatId in map)){
		init(chatId);
	}

	if(map[chatId].shutup){
		bot.sendMessage(chatId,"恩...究竟要我閉嘴還是說話呢...臣妾不明白啊QAQ");
		return;
	}

	clearInterval(map[chatId].murmurtimer);
	map[chatId].murmurtimer = setInterval(function(){
		bot.sendMessage(chatId,RandomText());
	},1000*60*2);
	console.log('[Log] murmur mode : '+chatId);
});

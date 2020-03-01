var WordExtractor = require("word-extractor");
var TelegramBot = require('node-telegram-bot-api');
var token = '1142305571:AAHi21iolrFMTeXDCdrtB1gqkbJHPxT0fpo';
var bot = new TelegramBot(token, { polling: true });
var extractor = new WordExtractor();
var extracted = extractor.extract('zaminu.doc');
var students = [];
var zaminu,replase;

var https = require('https');
var fs = require('fs');
var file = fs.createWriteStream("Заміни.doc");
var request = https.get("https://www.stxt.com.ua/download/zam.php", function(response) {
response.pipe(file);
});

setTimeout(function(){
  extracted.then(function(doc) {
    zaminu = doc.getBody();
    replase = zaminu.match(/ 1 (.*) 2/);
  });
}, 1000);

bot.onText(/\/data/, function(msg,match){
  var userId = msg.from.id;
  bot.sendMessage(userId, 'Document =  '+ replase);
});

bot.onText(/\/getdata/, function(msg,match){
  var userId = msg.from.id;
  bot.sendDocument(userId, 'Заміни.doc');
})
bot.on('callback_query', query=>{
    bot.answerCallbackQuery(query.id, query.data)
});
bot.onText(/group (.+)/, function(msg,match){
var userId = msg.from.id;
var group = match[1];
bot.sendMessage(userId, 'Ты из группы '+group+'. Добро пожаловать!', {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Підписатись',
                    callback_data: 'autorization'
                }
            ],
            [
                {
                    text: 'Розклад',
                    callback_data: 'schedule'
                },
                {
                    text: 'Заміни',
                    callback_data: 'replacements'
                }
            ],
            [
                {
                   text: 'SKXT NUXT',
                   url: 'https://www.stxt.com.ua/' 
                }
            ]
        ]
    }
});
});
function getRandomQuestion(){
    return questions[Math.floor(Math.random()*questions.length)];
  }
  
  function newQuestion(msg){
    var arr = getRandomQuestion();
    var text = arr.title;
    var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: arr.buttons, 
      })
    };
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, text, options); 
  }
  bot.onText(/\/start_test/, function (msg, match) {
    newQuestion(msg);
  });
bot.on('callback_query', function (msg) {
    var answer = msg.data;
    console.log(answer);
  
    if (answer=='replacements') {
      bot.sendDocument(msg.from.id, 'Заміни.doc');
    } else {
      bot.sendMessage(msg.from.id, 'Ответ неверный ❌');
    }
    newQuestion(msg);
  });
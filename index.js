var WordExtractor = require("word-extractor");
var TelegramBot = require('node-telegram-bot-api');

var mongoose = require('mongoose');
const url = 'mongodb+srv://Admin:Admin@telegrambotbd-tz3ph.mongodb.net/test?retryWrites=true&w=majority'

const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: String,
  group: String
});

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const User = mongoose.model("User", userSchema);

var token = '1142305571:AAHi21iolrFMTeXDCdrtB1gqkbJHPxT0fpo';
var bot = new TelegramBot(token, { polling: true });


var grp;
var zaminu,replase;


// Отримання замін
var https = require('https');
var fs = require('fs');
var file = fs.createWriteStream("Заміни.doc");
var request = https.get("https://www.stxt.com.ua/download/zam.php", function(response) {
response.pipe(file);
});


// Відправка замін через деякий час
setTimeout(function(){}, 1000);


// Початок
bot.onText(/\/start/, function(msg){
  bot.sendMessage(msg.from.id,"Розклад та заміни\nЩоб авторизивуатися потрібно ввести /group [назва групи]\nПриклад: /group ПСК16\n");
})


bot.onText(/\/getdata/, function(msg,match){
  var userId = msg.from.id;
  bot.sendDocument(userId, 'Заміни.doc');
})
bot.on('callback_query', query=>{
    bot.answerCallbackQuery(query.id, query.data)
});


// Авторизація та отримання меню користувача
bot.onText(/group (.+)/, function(msg,match){
var userId = msg.from.id;
var group = match[1];
grp = group;
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


// Меню
bot.on('callback_query', function (msg) {
    var answer = msg.data;
    console.log(answer);
    var flag;
    //Заміни
    if (answer=='replacements') {
      bot.sendDocument(msg.from.id, 'Заміни.doc');
    }
    //Підписка
    if (answer=='autorization') {
      User.find({}, function(err, users){
        if(err) return console.log(err);
        users.forEach(element => {
          if(element.id != msg.from.id){
            flag = false;
          }
          else {flag = true};
        });
        if(flag == false){
          const user = new User({id: msg.from.id, group: grp});
          user.save(function(err){
            if(err) return console.log(err);
            console.log("Add user");
          });
        }
        else {
          bot.sendMessage(msg.from.id, "Ты уже подписан на меня!!!");
        }
        console.log(users);
      })
    }
    newQuestion(msg);
  });
const WordExtractor = require("word-extractor");
const TelegramBot = require('node-telegram-bot-api');
const funct = require('./fnct');
const lll = require('./lll')
const button = require('./buttons');
const keyboard = require('./keyboard');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
require('./model/user.model')


const url = 'mongodb+srv://Admin:Admin@telegrambotbd-tz3ph.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const User = mongoose.model("User");

var token = '1142305571:AAHi21iolrFMTeXDCdrtB1gqkbJHPxT0fpo';
var bot = new TelegramBot(token, { polling: true });

// Отримання замін
function refreshReplacement(){
  let file = fs.createWriteStream("Заміни.doc");
  let request = https.get("https://www.stxt.com.ua/download/zam.php", function(response) {
    response.pipe(file);
  });
}

setInterval(refreshReplacement, 300000)

// Початок
bot.onText(/\/start/, function(msg){
  const welcome = "Розклад та заміни\nВиберіть один з доступних режимів. Режим авторизації дозволить отримувати заміни та розклад для окремої групи. Режим анонімності дозволить отримувати заміни та розклад для усіх груп."
  bot.sendMessage(msg.from.id, welcome, {
    reply_markup: {
      keyboard: keyboard.start
    }
  })
})

//Два екрани
bot.on('message', function(msg){
  let flag,usertype;
  switch(msg.text){
    case button.start.user:
      User.find({}, function(err, users){
        if(err) return console.log(err);
        users.forEach(element => {
          if(element.id != msg.from.id){
            flag = false;
          }
          else {flag = true};
        });
        if(flag == false){
            bot.sendMessage(msg.from.id, "Щоб авторизивуатися потрібно ввести /group [назва групи]\nПриклад: /group ПСК16\n");
        }
        else {
          bot.sendMessage(msg.from.id, "Ви авторизувалися. За допомогою меню можете дізнатися заміни та розклад", {
            reply_markup: {
              keyboard: keyboard.main_user
            }
          });
        }
      })
      break
    case button.start.ghost:
      bot.sendMessage(msg.from.id, "Ви увійшли в анонімному режимі. За допомогою меню можете дізнатися заміни та розклад для усіх груп", {
        reply_markup: {
          keyboard: keyboard.main_ghost
        }
      })
      break
    case button.main_user.back_user:
      bot.sendMessage(msg.from.id, 'Виберіть режим входу', {
        reply_markup: {
          keyboard: keyboard.start
        }
      })
      break
    case button.main_ghost.back_ghost:
      bot.sendMessage(msg.from.id, 'Виберіть режим входу', {
        reply_markup: {
          keyboard: keyboard.start
        }
      })
      break
    case button.main_user.replacements_user:
      usertype='User';
      funct.dataUpdate(msg,bot,usertype)
      break
    case button.main_ghost.replacements_ghost:
      usertype='Anonim';
      funct.dataUpdate(msg,bot,usertype)
      break
    case button.main_user.schedule_user:
      usertype='User';
      lll.scheduleUpdate(msg,bot,usertype)
      break
    case button.main_ghost.schedule_ghost:
      bot.sendMessage(msg.from.id, "Щоб отримати розклад потрібно ввести /getSchedule [назва групи]\nПриклад: /getSchedule ПСК16\n");
      lll.scheduleUpdate(msg,bot,usertype)
      break
    case button.main_user.update_user:
      bot.sendMessage(msg.from.id, "Щоб змінити групу потрібно ввести /update [назва групи]\nПриклад: /update ПСК16\n");
      break
    case button.main_user.delete_user:
      User.findOneAndDelete({id: msg.from.id}, function(err){
        if(err) return console.log(err)
        bot.sendMessage(msg.from.id, "Вітаю. Ти видалив себе з бази даних. Виберіть режим входу", {
          reply_markup: {
            keyboard: keyboard.start
          }
        })
      })
      break
  }
})

bot.on('callback_query', query=>{
    bot.answerCallbackQuery(query.id, query.data)
});


// Авторизація та отримання меню користувача
bot.onText(/group (.+)/, function(msg,match){
var userId = msg.from.id;
var group = match[1];
const user = new User({id: msg.from.id, group: match[1]});
user.save(function(err){
  if(err) return console.log(err);
  bot.sendMessage(msg.from.id, "Вітаю. Ти зареєструвався. За допомогою меню можете дізнатися заміни та розклад", {
    reply_markup: {
      keyboard: keyboard.main_user
    }
  })
});

});

// Зміна групи
bot.onText(/update (.+)/, function(msg, match){
  User.findOneAndUpdate({id: msg.from.id}, {group: match[1]}, function(err){
    if(err) return console.log(err);
    bot.sendMessage(msg.from.id, "Вітаю. Ти змінив групу. За допомогою меню можете дізнатися заміни та розклад", {
      reply_markup: {
        keyboard: keyboard.main_user
      }
    })
  })
});


// Отримання розкладу для анонімного користувача
bot.onText(/getSchedule (.+)/, function(msg, match){
  usertype = 'Anonim';
  lll.scheduleUpdate(msg,bot,usertype,match[1]);
})

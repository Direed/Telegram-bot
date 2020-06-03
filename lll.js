const needle = require('needle');
var mongoose = require('mongoose');
require('./model/user.model');
const User = mongoose.model('User');
const TelegramBot = require('node-telegram-bot-api');


var URL = 'https://www.stxt.com.ua/schedule';

module.exports={
scheduleUpdate(msg,bot,usertype,grp){
needle.get(URL, function(err, res){
    if (err) throw err;
    let mas_schedule=[];
    let masdays = ['Понеділок','Вівторок','Середа','Четвер','П\'ятниця'];
    let maspairs = ['1 пара','2 пара','3 пара','4 пара']
    let count=0;
    let countcells = 0;
    let schedule = res.body;
    let sch = schedule.split('<div class="tab-content">')[1];
    sch = sch.split('</div> <!-- tab-content Групи кінець -->\n')[0];
    let rozklad = sch.split('class="tab-pane"');
    rozklad.map(block => {
      let group = block.split(/<h3>(.+)<\/h3>/gi);
      let gr = group[1];
      let day_of_week;
      let pair_of_day;
      if(gr!=undefined){
        countcells=0;
        mas_schedule[count] = [];
        mas_schedule[count][countcells] = gr;
        countcells++; 
      }

      let blockofdays = group[2];
      if(blockofdays!=undefined){
        daysofweek = blockofdays.split(/<div class="sched-item">/gi);
        daysofweek.map(day_s => {
          let days = day_s.split(/<div class="sched-item-heading">\n<h4>(.+)<\/h4>/gi);
          if(days[1]!=undefined){
            day_of_week = days[1];
            mas_schedule[count][countcells] = day_of_week;
            countcells++;

            blockofpairs = days[2];
            pairsofday = blockofpairs.split(/<div class="sched-item-con(.+)"> /gi);
            pairsofday.map(pair_s => {
              let pairs = pair_s.split(/<!-- (.+) -->/gi);
              if(pairs[1]!=undefined){
                pair_of_day = pairs[1];
                mas_schedule[count][countcells] = pair_of_day;
                countcells++;

                blockoflessons = pairs[2];
                lessonsofpair = blockoflessons.split(/<!-- (.+) -->\n(.+)\n((.+)<br>|<\/div>|<br>)/gi);
                lessonsofpair.map(lesson_s =>{
                  let lessons = lesson_s.match(/((.+)<br>\n(.+)<br>\n<\/div>|<br>\n<br>\n|(.+)<br>\n(.+)<br>\n(.+)\n|Виховна година)/gi);

                  for(var key in lessons){
                    let pred = lessons[key].split(/<br>\n/gi);
                    for(let i=0; i<pred.length;i++){
                      mas_schedule[count][countcells] = pred[i];
                      countcells++;
                    }
                  }
                })
              }
              
            })
            
          }
        })
      count++;
      }  
    })
if(usertype=='User'){
  User.find({id: msg.from.id}, function(err, users){
    if(err) return console.log(err);
    let strzam='Розклад:\n';
    users.forEach(user => {
      for(let i=0; i<mas_schedule.length; i++)
      {          
        if(mas_schedule[i][0]==user.group){
          for(let j=0; j<mas_schedule[i].length; j++){
            if(mas_schedule[i][j]==masdays[0]){strzam=strzam+'\n\n'+masdays[0]+'\n'}
            else if(mas_schedule[i][j]==masdays[1]){strzam=strzam+'\n\n'+masdays[1]+'\n'}
            else if(mas_schedule[i][j]==masdays[2]){strzam=strzam+'\n\n'+masdays[2]+'\n'}
            else if(mas_schedule[i][j]==masdays[3]){strzam=strzam+'\n\n'+masdays[3]+'\n'}
            else if(mas_schedule[i][j]==masdays[4]){strzam=strzam+'\n\n'+masdays[4]+'\n'}
            else if(mas_schedule[i][j]=='</div>'){}
            else if(mas_schedule[i][j]==''){strzam=strzam+'-'}
            else if(mas_schedule[i][j]==maspairs[0]){strzam=strzam+maspairs[0]+'\n'}
            else if(mas_schedule[i][j]==maspairs[1]){strzam=strzam+'\n'+maspairs[1]+'\n'}
            else if(mas_schedule[i][j]==maspairs[2]){strzam=strzam+'\n'+maspairs[2]+'\n'}
            else if(mas_schedule[i][j]==maspairs[3]){strzam=strzam+'\n'+maspairs[3]+'\n'}
            else{strzam=strzam+' '+mas_schedule[i][j]}
          }
        }
      }
      console.log();
      bot.sendMessage(msg.from.id, strzam);
    })
  })
}
else if(usertype=='Anonim'){
  let strzam='Розклад:\n';
  for(let i=0; i<mas_schedule.length; i++)
  {          
    if(mas_schedule[i][0]==grp){
      for(let j=0; j<mas_schedule[i].length; j++){
        if(mas_schedule[i][j]==masdays[0]){strzam=strzam+'\n\n'+masdays[0]+'\n'}
        else if(mas_schedule[i][j]==masdays[1]){strzam=strzam+'\n\n'+masdays[1]+'\n'}
        else if(mas_schedule[i][j]==masdays[2]){strzam=strzam+'\n\n'+masdays[2]+'\n'}
        else if(mas_schedule[i][j]==masdays[3]){strzam=strzam+'\n\n'+masdays[3]+'\n'}
        else if(mas_schedule[i][j]==masdays[4]){strzam=strzam+'\n\n'+masdays[4]+'\n'}
        else if(mas_schedule[i][j]=='</div>'){}
        else if(mas_schedule[i][j]==''){strzam=strzam+'-'}
        else if(mas_schedule[i][j]==maspairs[0]){strzam=strzam+maspairs[0]+'\n'}
        else if(mas_schedule[i][j]==maspairs[1]){strzam=strzam+'\n'+maspairs[1]+'\n'}
        else if(mas_schedule[i][j]==maspairs[2]){strzam=strzam+'\n'+maspairs[2]+'\n'}
        else if(mas_schedule[i][j]==maspairs[3]){strzam=strzam+'\n'+maspairs[3]+'\n'}
        else{strzam=strzam+' '+mas_schedule[i][j]}
      }
    }
  }
  bot.sendMessage(msg.from.id, strzam);
}

});
}
}

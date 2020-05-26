/*var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();
var extracted = extractor.extract("test32.doc");
const alf = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
extracted.then(function(doc) {
  var zam = doc.getBody().split("Кого замінити")[1];


  let lessonNumber = '';
  let zaminu = zam.split('\t\t\t')
      .map(line => {
        return line.replace(/\t\t/g, "").split('\t');
      })
      .map(cells => {
        console.log(cells);
          if (cells[0].length === 1 && cells[0]!=' ') {
            lessonNumber = cells[0];
          }

          if (cells[0].length > 1) {
            cells.unshift(lessonNumber);
          }

          if (cells[0].length === 0 || cells[0]==' ') {
            if(cells.length>1)
            {
              if(cells[1].length==1){
                cells[0]=cells[1];
                lessonNumber = cells[1];
                cells.splice(1, 1);
              }
              else{
                cells[0] = lessonNumber;
              }
            }
          }

          
          return cells;
      })
      .filter(cells => cells.length > 2);
      let maszaminu = zaminu;
      maszaminu.map(mas => {
        if(mas.length==3|| (mas.length==4 && (isNaN(parseInt(mas[3])))==true)){ 
          let newstr1="";
          let newstr2="";
          let flag;
          for(let i=1; i<mas[2].length; i++)
          {
            for(let j=0; j<alf.length; j++)
            {
              if(mas[2][i]===alf[j]){
                for(let g=0; g<alf.length; g++){
                  if(mas[2][i+1]===alf[g]){
                    flag=false;
                    break;
                  }
                  else{
                    flag=true;
                  }
                }
                if(flag==true){
                for(let n=0; n<=i-1; n++){
                  newstr1=newstr1+mas[2][n];
                }
                for(let m=i; m<mas[2].length; m++){
                  newstr2=newstr2+mas[2][m];
                }}
              }
              if(flag==true)
              {
                mas.splice(2,1, newstr1);
                mas.splice(3,0, newstr2);
                break;
              };
            }
            if(flag==true)
            {
              break;
            }
          }
          return mas;
        }
      });
      console.log(zaminu);
      console.log(lessonNumber);
});

var https = require('https');
var fs = require('fs');
let file1,file2,file,request;
  file1 = fs.readFileSync("Заміни.doc");
  file2 = fs.readFileSync("zaminu.doc");
  if(file1==file2)
  {console.log('gg')}
  else{console.log('ne gg')}
*/
const needle = require('needle');
var mongoose = require('mongoose');
require('./model/user.model');
const User = mongoose.model('User');
const TelegramBot = require('node-telegram-bot-api');


var URL = 'https://www.stxt.com.ua/schedule';

module.exports={
scheduleUpdate(msg,bot,usertype){
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
    console.log(rozklad.length);
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
            pairsofday = blockofpairs.split(/<div class="sched-item-content"> /gi);
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
  let strzam = 'gg';
  bot.sendMessage(msg.from.id, strzam);
}

});
}
}
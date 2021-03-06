var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();
var mongoose = require('mongoose');
require('./model/user.model');
const User = mongoose.model('User');
const TelegramBot = require('node-telegram-bot-api');

module.exports={
dataUpdate(msg,bot,usertype){
var extracted = extractor.extract("Заміни.doc");
const alf = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
extracted.then(function(doc) {
var zam = doc.getBody().split("Кого замінити")[1];

let lessonNumber = '';
let zaminu = zam.split('\t\t\t')
.map(line => {
return line.replace(/\t\t/g, "").split('\t');
})
.map(cells => {

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
          }
        }
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
if(usertype=='User'){
  User.find({id: msg.from.id}, function(err, users){
    if(err) return console.log(err);
    users.forEach(user => {
      let strzam='Заміни:\n';
      for(let i=0; i<maszaminu.length; i++)
      {
        if(maszaminu[i][1]==user.group){
          strzam = strzam + maszaminu[i].join(' - ') +'\n';
        }
      }
      if(strzam!='Заміни:\n'){
        bot.sendMessage(msg.from.id, strzam);
      }
      else{bot.sendMessage(msg.from.id, 'Для вас замін немає')}
    })
  })
}
else if(usertype=='Anonim'){
  let strzam='Заміни:\n'
  for(let i=0; i<maszaminu.length; i++){
    strzam = strzam + maszaminu[i].join(' - ') +'\n';
  }
  bot.sendMessage(msg.from.id, strzam);
}

})
}
}
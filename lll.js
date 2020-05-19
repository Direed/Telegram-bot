var WordExtractor = require("word-extractor");
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

/*var https = require('https');
var fs = require('fs');

let file1 = fs.readFileSync("Заміни.doc", "utf8");
let file2 = fs.readFileSync("zaminu.doc", "utf8");
if(file1==file2)
{
  console.log("==");
}
else{
  console.log("!=");
  let file = fs.createWriteStream("zaminu.doc");
  let fileupdate = fs.createWriteStream("Заміни.doc");
  let request = https.get("https://www.stxt.com.ua/download/zam.php", function(response) {
    response.pipe(file);
});
};*/

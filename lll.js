var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();
var mas;
var extracted = extractor.extract("zaminu.doc");
extracted.then(function(doc) {
  var zam = doc.getBody().split("Кого замінити")[1];


  let lessonNumber = '';
  let zaminu = zam.split('\t\t\t')
      .map(line => {
        return line.replace(/\t\t/g, "").split('\t');
      })
      .map(cells => {
        console.log(cells);
          if (cells[0].length === 1) {
            lessonNumber = cells[0];
          }

          if (cells[0].length > 1) {
            cells.unshift(lessonNumber);
          }

          if (cells[0].length === 0) {
            if(cells.length>1)
            {
              if(cells[1].length === 1){
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
      mas = zaminu;
      console.log(zaminu);
      console.log(lessonNumber);
      console.log(mas[3][2].replace(/[а-яёa-z][А-ЯЁA-Z]+/g, " "));
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

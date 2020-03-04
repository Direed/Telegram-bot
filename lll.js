var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();
var extracted = extractor.extract("zaminu.doc");
extracted.then(function(doc) {
  var zam = doc.getBody().split("Кого замінити")[1];


  let lessonNumber = '';

  let zaminu = zam.split('\t\t\t')
      .map(line => {
        return line.replace(/\t\t/g, "").split('\t');
      })
      .map(cells => {
          if (cells[0].length === 1) {
              lessonNumber = cells[0];
          }

          if (cells[0].length > 1) {
            cells.unshift(lessonNumber);
          }

          if (cells[0].length === 0) {
              cells[0] = lessonNumber;
          }


          return cells;
      })
      .filter(cells => cells.length > 2);
      console.log(zaminu);
});
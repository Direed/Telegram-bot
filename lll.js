var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();
var extracted = extractor.extract("zaminu.doc");
extracted.then(function(doc) {
  var zam = doc.getBody();
  var ft = doc.getFootnotes();
  console.log(zam);
  var rep = zam.split(/\t\t|\t|\t/);
  console.log(rep);
});
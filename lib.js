

// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
})

var kittySchema = mongoose.Schema({
  name: String,
  jobId: String
  port: Number,
});

var Kitten = mongoose.model('Kitten', kittySchema);

var silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'
silence.save();

Kitten.find({ name: 'Silence' }, function(err, res) {
  console.log(res);
});

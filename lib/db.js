var dbUri = process.env.DB_URI || 'mongodb://localhost/test';
var mongoose = require('mongoose');
mongoose.connect(dbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
})

var jobSchema = mongoose.Schema({
  jobId: String,
  port: Number,
  sourceDirectory: String,
  databaseName: String
});

class JobClass {

  get fullName() {
  }

  set fullName(value) {
  }

  static getByJobId(jobId, callback) {
    return this.findOne({ jobId: jobId }, callback);
  }

  static getJobByLastUsedPort(jobId, callback) {
    return this.findOne({ $query: {}, $order: { port: -1 } }, callback);
  }

}

jobSchema.loadClass(JobClass);
var JobModel = mongoose.model('Job', jobSchema);

module.exports = {
  mongoose: mongoose,
  jobSchema: jobSchema,
  JobModel: JobModel
}

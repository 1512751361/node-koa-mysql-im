const model = require('./bin/model');
model.sync();
console.log('init db ok.');
process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
});
//process.exit(0);
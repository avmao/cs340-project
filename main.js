/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var app = express();
app.engine('handlebars', exphbs.engine({defaultLayout: "main"}));


//app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use('/view_spell', require('./spell.js'));
app.use('/people', require('./people_certs.js'));
app.use('/planets', require('./planets.js'));
app.use('/', express.static('public'));

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log(
        'Express started on http://localhost:' +
            app.get('port') +
            '; press Ctrl-C to terminate.'
    );
});




/*
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
    });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use('/view_spell', require('./spell.js'));
/*app.use('/manage_spell', require('./spell.js'));
app.use('/view_class', require('./class.js'));
app.use('/manage_class', require('./class.js'));
app.use('/view_master', require('./master.js'));
app.use('/manage_master', require('./master.js'));
app.use('/view_student', require('./student.js'));
app.use('/manage_student', require('./student.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on ' + app.get('port') + '; press Ctrl-C to terminate.');
});
*/
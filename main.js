/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use('/spell', require('./spell.js'));
app.use('/class', require('./class.js'));
app.use('/master', require('./master.js'));
app.use('/student', require('./student.js'));

app.use('/master_spell', require('./master_spell.js'));
app.use('/student_spell', require('./student_spell.js'));

app.use('/update_spell', require('./update_spell.js'));

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
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
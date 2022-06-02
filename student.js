module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get data of all students
    function getStudents(res, mysql, context, complete) {
        mysql.pool.query('SELECT * FROM student', function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.student = [];
            for (var i = 0; i < results.length; i++) {
                context.student.push({ ...results[i] })
            }
            complete();
            }
        );
    }

    // Get class ids for dropdown
    function getClasses(res, mysql, context, complete){
        mysql.pool.query("SELECT class_id AS class_id, class_id FROM class", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.class = results;
            complete();
        });
    }

    // Get master ids for dropdown
    function getMasters(res, mysql, context, complete){
        mysql.pool.query("SELECT master_id AS master_id FROM master", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.master = results;
            complete();
        });
    }

    // Display all students
    router.get('/', function (req, res) {
        var context = {};
        var callbackCount = 0;

        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');

        getStudents(res, mysql, context, complete);
        getClasses(res, mysql, context, complete);
        getMasters(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if(callbackCount >= 3){
                res.render('student', context);
            }
        }
    });

    // Insert new entry
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO student (student_id, class_id, master_id, danger_level, date_born, registration, student_name, species) VALUES (?,?,?,?,?,?,?,?)";
        var inserts = [req.body.student_id, req.body.class_id, req.body.master_id, req.body.danger_level, req.body.date_born, req.body.registration, req.body.student_name, req.body.species];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                res.redirect('/student');
            } else {
                res.redirect('/student');
            }
        });
    });

    // Delete a student
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM student WHERE student_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();

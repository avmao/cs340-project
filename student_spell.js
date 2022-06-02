module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get spell ids 
    function getSpells(res, mysql, context, complete){
        mysql.pool.query("SELECT spell_id AS spell_id, spell_name FROM spell", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.spell = results;
            complete();
        });
    }

    // Get student ids
    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT student_id AS student_id FROM student", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.student = results;
            complete();
        });
    }

    // Get student-spell intersection id
    function getStudentRoster(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM student_spell", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.student_spell = results;
            complete();
        });
    }

    // Display all student-spell registrations
    router.get('/', function(req, res){         
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getSpells(res, mysql, context, complete);
        getStudents(res, mysql, context, complete);
        getStudentRoster(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('student_spell', context);
            }
        }
    });
     
    // Insert a new entry
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO student_spell (student_spell_id, student_id, spell_id) VALUES (?,?,?)";
        var inserts = [req.body.student_spell_id, req.body.student_id, req.body.spell_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                res.redirect('/student_spell');
            } else {
                res.redirect('/student_Spell');
            }
        });
    });

    // Delete a student-spell registration
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM student_spell WHERE student_spell_id=?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        });
    })

    return router;
}();
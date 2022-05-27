module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSpells(res, mysql, context, complete){
        mysql.pool.query("SELECT spell_id AS spell_id, spell_name FROM Spell", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.spell = results;
            complete();
        });
    }

    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT student_id AS student_id FROM Student", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.student = results;
            complete();
        });
    }

    function getStudentRoster(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Student_Spells", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.student_spell = results;
            complete();
        });
    }

    router.get('/', function(req, res){         
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
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
     
    return router;
}();
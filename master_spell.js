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

    function getMasters(res, mysql, context, complete){
        mysql.pool.query("SELECT master_id AS master_id FROM Master", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.master = results;
            complete();
        });
    }

    
    function getMasterRoster(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Master_Spells", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.master_spell = results;
            complete();
        });
    }

    router.get('/', function(req, res){         
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getSpells(res, mysql, context, complete);
        getMasters(res, mysql, context, complete);
        getMasterRoster(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('master_spell', context);
            }
        }
    });
     
    return router;
}();
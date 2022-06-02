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

    // Get master ids
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
    
    // Get master-spell intersection id
    function getMasterRoster(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM master_spell", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.master_spell = results;
            complete();
        });
    }

    // Display all master-spell registrations
    router.get('/', function(req, res){         
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
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
    
    // Insert a new entry
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO master_spell (master_spell_id, master_id, spell_id) VALUES (?,?,?)";
        var inserts = [req.body.master_spell_id, req.body.master_id, req.body.spell_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                res.redirect('/master_spell');
            } else {
                res.redirect('/master_spell');
            }
        });
    });

    // Delete a master-spell registration
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM master_spell WHERE master_spell_id=?";
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
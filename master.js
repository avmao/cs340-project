module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get data of all masters
    function getMasters(res, mysql, context, complete) {
        mysql.pool.query('SELECT * FROM master', function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.master = [];
            for (var i = 0; i < results.length; i++) {
                context.master.push({ ...results[i] })
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

    // Display all masters
    router.get('/', function (req, res) {
        var context = {};
        var callbackCount = 0;

        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');

        getMasters(res, mysql, context, complete);
        getClasses(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if(callbackCount >= 2){
                res.render('master', context);
            }
        }
    });

    // Insert new entry
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO master (master_id, class_id, master_name, danger_level, date_born, species) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.master_id, req.body.class_id, req.body.master_name, req.body.danger_level, req.body.date_born, req.body.species];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                res.redirect('/master');
            } else {
                res.redirect('/master');
            }
        });
    });

    // Delete a master
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM master WHERE master_id = ?";
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

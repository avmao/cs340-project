module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get the data of all classes
    function getClasses(res, mysql, context, complete) {
        mysql.pool.query(
            'SELECT * FROM class',
            function (error, results, fields) {
                if (error) {
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.class = [];
                for (var i = 0; i < results.length; i++) {
                    context.class.push({ ...results[i] })
                }
                complete();
            }
        );
    }

    // Display all classes
    router.get('/', function (req, res) {
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        function complete() {
            res.render('class', context);
        }
        getClasses(res, mysql, context, complete);
    });

    // Insert a new entry
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO class (class_id, title, danger_level, description) VALUES (?,?,?,?)";
        var inserts = [req.body.class_id, req.body.title, req.body.danger_level, req.body.description];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                res.redirect('/class');
            } else {
                res.redirect('/class');
            }
        });
    });

    // Delete a class
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM class WHERE class_id = ?";
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

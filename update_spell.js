module.exports = function(){
    var express = require("express");
    var router = express.Router();


    router.post("/", function(req, res) {
        var mysql = req.app.get("mysql");
        var sql = "UPDATE spell SET class_id=?, spell_name=?, element=?, cost=?, damage=? WHERE spell_id=?";
        var inserts = [req.body.class_id, req.body.spell_name, req.body.element, req.body.cost, req.body.damage, req.body.spell_id];
        
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect("/spell");
            }
        });
    });

    return router;
}();

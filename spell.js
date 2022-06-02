module.exports = function(){
    var express = require("express");
    var router = express.Router();

    function getSpells(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM spell", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.spell = [];
            for (var i = 0; i < results.length; i++) {
                context.spell.push({ ...results[i] })
            }
            complete();
            }
        );
    }

    function getClasses(res, mysql, context, complete){
        mysql.pool.query("SELECT class_id AS class_id FROM class", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.class = results;
            complete();
        });
    }

    /* Find a spell that starts with the given string */
    function findSpell(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
        var query = "SELECT * FROM spell WHERE spell_name LIKE " + mysql.pool.escape(req.params.s + "%");
        console.log(query);
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.spell = results;
            complete();
        });
    }
    
    function getSpell(res, mysql, context, id, complete) {
        var sql = "SELECT * FROM spell WHERE spell_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.spell = results[0];

            complete();
        });
    }
    

    /*Display all spells. Requires web based javascript to delete users with AJAX*/
    router.get("/", function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js", "delete.js", "search.js"];
        var mysql = req.app.get("mysql");
        getSpells(res, mysql, context, complete);
        getClasses(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if(callbackCount >= 2){
                res.render("spell", context);
            }
        }
    });

    router.post("/", function(req, res) {
        var mysql = req.app.get("mysql");
        var sql = "INSERT INTO spell (spell_id, class_id, spell_name, element, cost, damage) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.spell_id, req.body.class_id, req.body.spell_name, req.body.element, req.body.cost, req.body.damage];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                res.redirect("/spell");
            } else {
                res.redirect("/spell");
            }
        });
    });



    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get("/search/:s", function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js","update.js","search.js"];
        var mysql = req.app.get("mysql");

        findSpell(req, res, mysql, context, complete);
    
        function complete(){
            res.render("spell", context);
        }
    }); 

    router.get("/:id", function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js", "delete.js","search.js"];
        var mysql = req.app.get("mysql");

        getSpell(res, mysql, context, req.params.id, complete);
        getClasses(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render("update_spell", context);
            }
        }
      });

    // The URI that update data is sent to in order to update a person 
    router.put("/:id", function(req, res){
        var mysql = req.app.get("mysql");
        var sql = "UPDATE spell SET class_id=?, spell_name=?, element=?, cost=?, damage=? WHERE spell_id=?";
        var inserts = [req.body.class_id, req.body.spell_name, req.body.element, req.body.cost, req.body.damage, req.params.id];

        console.log("test1");

        /*if (!inserts[0] === true || !inserts[1] === true || !inserts[2] === true || !inserts[3] === true || !inserts[4] === true || !inserts[5] === true) {
            res.redirect(req.get("/spell"));
            console.log("Please fill in all input fields.");
        } */

        //else {
            sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                console.log("test");
                if (error) {
                    console.log(error)
                    res.write(JSON.stringify(error));
                    res.end();
                } else {
                    res.status(200);
                    res.end();
                }
            });
        //}
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete("/:id", function(req, res){
        var mysql = req.app.get("mysql");
        var sql = "DELETE FROM spell WHERE spell_id=?";
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

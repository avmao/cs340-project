module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSpells(res, mysql, context, complete) {
        mysql.pool.query('SELECT * FROM spell', function (error, results, fields) {
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
/*
    function getPeoplebyHomeworld(req, res, mysql, context, complete){
      var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.homeworld = ?";
      console.log(req.params)
      var inserts = [req.params.homeworld]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req 
    function getPeopleWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }
    */
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
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js", "delete.js"];
        var mysql = req.app.get('mysql');

        getSpells(res, mysql, context, complete);
        getClasses(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if(callbackCount >= 2){
                res.render('spell', context);
            }
        }
    });

    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO spell (spell_id, class_id, spell_name, element, cost, damage) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.spell_id, req.body.class_id, req.body.spell_name, req.body.element, req.body.cost, req.body.damage];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                res.redirect('/spell');
            } else {
                res.redirect('/spell');
            }
        });
    });

    /*Display all people from a given homeworld. Requires web based javascript to delete users with AJAX
    router.get('/filter/:homeworld', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeoplebyHomeworld(req,res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('people', context);
            }

        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX 
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeopleWithNameLike(req, res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('people', context);
            }
        }
    }); */

    router.get("/:id", function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js", "delete.js"];
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
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE spell SET spell_id=?, class_id=?, spell_name=?, element=?, cost=?, damage=? WHERE spell_id=?";
        var inserts = [req.body.spell_id, req.body.class_id, req.body.spell_name, req.body.element, req.body.cost, req.body.damage, req.params.id];

        if (!inserts[0] === true || !inserts[1] === true || !inserts[2] === true || !inserts[3] === true || !inserts[4] === true || !inserts[5] === true) {
            res.redirect(req.get("/spell"));
            console.log("Please fill in all input fields.");
        } 
        else {
            sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.write(JSON.stringify(error));
                    res.end();
                } else {
                    res.status(200);
                    res.end();
                }
            });
        }
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM spell WHERE spell_id=?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);everythings
                res.end();
            } else {
                res.status(202).end();
            }
        });
    })

    return router;
}();

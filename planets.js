module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function servePlanets(req, res){
        console.log("You asked me for some planets?")
        var query = 'SELECT planet_id, name, population FROM bsg_planets';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfPlanets(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.planets = results;
          //pass it to handlebars to put inside a file
          res.render('planets', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfPlanets)

        //res.send('Here you go!');
    }

    function serveOnePlanet(chicken, steak) {
      console.log(chicken.params.fancyId);
      console.log(chicken.params);
      fancyId = chicken.params.fancyId

      var queryString = "SELECT planet_id, name, population, language, capital FROM bsg_planets WHERE planet_id = ?"

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOnePlanet(error, results, fields){
          console.log("results are " + results)
          context.planet = results[0]
          console.log(context)

          if(error){
            console.log(error)
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverPlanet',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOnePlanet);

      //steak.send("Here's a good tasty well done steak");
    }

    router.get('/', servePlanets);
    router.get('/:fancyId', serveOnePlanet);
    return router;
}();

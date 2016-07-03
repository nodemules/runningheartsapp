module.exports = function(app){

	app.get('/', function(req, res) {
	    res.render('index.ejs');
	});

	app.get('/*', function(req, res) {
		res.render('index.ejs');
	})

}
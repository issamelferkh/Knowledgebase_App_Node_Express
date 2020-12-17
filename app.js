const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Init Expxress App
const app = express();

// Connect to Mongo
const db = require('./config/keys').mongoURI;
mongoose
		.connect(db)
		.then(() => console.log('MongoDB Connected'))
		.catch(err => console.log(err));

// Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// ################################# Routes Start ################################# //
// Home Route
app.get('/', (req, res) => {
		Article.find({}, (err, articles) => {
				if(err){
						console.log(err);
				} else {
						res.render('index', {
								title: 'Home Articles',
								articles: articles
						});
				}
		});
});

// Article Add Route - without submite
app.get('/articles/add', (req,res) => {
		res.render('article_add', {
				title: "Add Article"
		})
});

// Article Add Route - with submite
app.post('/articles/add', (req, res) => {
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save((err) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

// Article Detail Route
app.get('/articles/:id', (req,res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('article_detail', {
			article: article
		});
	});
});

// ################################# Routes End ################################# //

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The server run on the port ${PORT}`));

const tasks = require('./routes/tasks');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use('/api/tasks', tasks);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

//set the template engine ejs
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
    res.render('index');
});

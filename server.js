const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const items = require('./routes/items');
const { aggregate } = require('./models/Item');

const app = express();

app.use(express.json());

const db = require('./config/keys').mongoURI;
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));

app.use('/api/items', items);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

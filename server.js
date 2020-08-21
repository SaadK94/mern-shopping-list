const express = require('express');
const mongoose = require('mongoose');

const items = require('./routes/items');

const app = express();

app.use(express.json());

const db = require('./config/keys').mongoURI;
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));

app.use('/api/items', items);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./src/routes/User');
const storyRoutes = require('./src/routes/Story');

const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(storyRoutes);

app.get('/', (req, res) => {
    res.status(200).send({ status: "success", msg: "API is working well." });
})

app.use((req, res, next) => {
    const err = Object.assign(Error("Endpoint not found"), { code: 404 });
    next(err);
})

app.use(errorHandler);

const port = process.env.PORT || 1000
app.listen(port, () => {
    mongoose.connect(process.env.DB_URL).then(() => console.log('Server is running :)')).catch((error) => console.log(error))
})

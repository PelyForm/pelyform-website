require('dotenv').config();


const express = require('express');
const cors = require('cors');
const errHandler = require('./src/middleware/errHandler');


const morgan = require('morgan');
const { appConfig } = require('./src/constant');
const app = express();

app.use(cors());
app.use(
    express.json({
        verify: (req, res, buf, encoding) => {
            req.rawBody = buf.toString();
        },
    })
);
app.use(morgan('dev'));

app.use(express.static('public'));
app.set('views', './src/views');

// Set EJS as the view engine
app.set('view engine', 'ejs');


app.use( "/", require('./src/router'));



app.use(errHandler);


app.listen(appConfig.port, async () => {
    console.log(`Server is running on port ${appConfig.port}`);


});


process.on('SIGINT', async () => {
    process.exit(0);
});

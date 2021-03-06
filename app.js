const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure Sessions Middleware
app.use(session({
    secret: 's9q,-&1LM3)CD*zAGpx1xm{rrNeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Route to Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var counter = 0;

app.get('/sse', (req, res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        "connection": "keep-alive",
        "cache-control": "no-cache",
        "content-type": "text/event-stream",
    })

    const timer = setInterval(() => {
        const prog = {
            date: Date.now(),
            value: counter++
        }
        if (counter > 2) {
            res.write("event: completed\n");
            res.write('data: completed\n');
            res.write('\n');
            clearInterval(timer);
        }
        else {
            res.write("event: message\n")
            res.write('data: ' + JSON.stringify(prog) + '\n')
            res.write('\n');
        }
    }, 2000)
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('Error!');
});

// assign port
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));

module.exports = app;

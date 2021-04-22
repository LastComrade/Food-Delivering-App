require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const passport = require("passport");
const Emitter = require("events");

// Database Connections
const url = "mongodb://localhost/pizza";
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("we're connected with DB!");
});

// Session Store
const mongoStore = new MongoDbStore({
    mongooseConnection: db,
    collection: "sessions",
});

// Event Emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// Session Config
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        store: mongoStore,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 Hours
    })
);

// Configuration for passport
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Assets
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global Middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

// Set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// webRoutes(app);
require("./routes/web")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
    console.log(`Server is listening on port ${port}`)
);

// Socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
    // Join
    // console.log(socket.id);
    socket.on("join", (orderId) => {
        // console.log(orderId);
        socket.join(orderId);
    });
});

eventEmitter.on("orderUpdated", (data) => {
    io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
    io.to("adminRoom").emit("orderPlaced", data)
})
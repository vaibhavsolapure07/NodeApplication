const express = require('express');
const app = express();

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const authUser = (user, password, done) => {
    console.log(`Value of "user" in authUser function --> ${user}`);
    console.log(`Value of "password" in authUser function --> ${password}`);
    let authenticatedUser = { id: 123, name: "Kyle" };
    return done(null, authenticatedUser);
};

passport.use(new LocalStrategy(authUser));

passport.serializeUser((user, done) => {
    console.log("Serialize User");
    console.log(user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("Deserialize User");
    console.log(id);
    done(null, { name: "Kyle", id: 123 });
});

let count = 1;
const printData = (req, res, next) => {
    console.log(`req.body.username -->  ${req.body.username}`);
    console.log(`req.body.password -->  ${req.body.password}`);
    next();
};

app.use(printData);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("dashboard.ejs", { name: req.user.name });
    } else {
        res.redirect('/login');
    }
});

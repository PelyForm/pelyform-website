const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'home', title: 'Home', heroTitle: 'Welcome to the Home Page', heroSubtitle: 'This is the home page', heroImage: "home-hero.png"});
});


module.exports = router
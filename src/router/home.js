const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'home', title: 'Home', heroTitle: 'Unleashing Innovation with Pelyform', heroSubtitle: 'At Pelyform, we are committed to driving business success through innovative solutions. Our expertise enables businesses to achieve transformative results and thrive in a competitive landscape. Discover how our tailored strategies can elevate your operations and fuel your growth.', buttonTitle:'Book Now', heroImage: 'home-hero.png'});
});


module.exports = router
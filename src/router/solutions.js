const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'solutions', title: 'Solutions', heroTitle: 'We provide services', heroSubtitle: 'Pelyform harnesses technology to create innovative solutions. We empower businesses to thrive in a digital world. Discover how our products can transform your operations.', buttonTitle:'Learn more', heroImage: 'home-hero.png'});
});


module.exports = router
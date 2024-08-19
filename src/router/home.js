const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'home', title: 'Home', heroTitle: 'Unleashing Innovation with Pelyform', heroSubtitle: 'At Pelyform, we drive business success through cutting-edge automation and AI integration. Our expert team specializes in custom web applications, seamless API integrations, and cloud solutions designed to optimize your operations. Discover how our tailored strategies can transform your workflows and help your business thrive in today’s competitive landscape.', buttonTitle:'Book Now', heroImage: 'home-hero.png'});
});


module.exports = router
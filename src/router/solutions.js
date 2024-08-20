const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'solutions', title: 'Solutions', heroTitle: 'Unleashing Innovation with Pelyform', heroSubtitle: 'Empowering businesses with cutting-edge digital solutions that drive efficiency and growth, Pelyform specializes in custom web applications, seamless automation, and robust API and cloud integrations. In this new era, our advanced AI-driven strategies elevate automation to transform your workflows and position your business for success in today’s competitive, digital-first landscape. Ready to take the next step? Book a consultation now.', buttonTitle:'Book Now', heroImage: 'home-hero.png'});
});


module.exports = router
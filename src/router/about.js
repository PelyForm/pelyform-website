const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'about', title: "About Us"});
});


module.exports = router
const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'contact', title: "Contact Us"});
});


module.exports = router
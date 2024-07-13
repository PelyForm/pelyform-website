const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'portfolio', title: "Portfolio"});
});


module.exports = router
const router = require("express").Router()

router.get('/', (req, res) => {
    res.render('layout', { page: 'vision', title: "Vision"});
});


module.exports = router
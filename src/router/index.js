const router = require("express").Router()

router.use("/", require("./home"))
router.use("/solutions", require("./solutions"))
router.use("/contact", require("./contact"))
router.use("/about", require("./about"))
router.use("/vision", require("./vision"))


module.exports = router
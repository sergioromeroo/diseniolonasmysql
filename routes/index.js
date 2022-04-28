var express = require('express');
var router = express.Router();
const {index,quienessomos,admin} = require('../controllers/indexcontroller')

/* GET home page. */
router.get('/', index)
router.get('/quienessomos', quienessomos)
router.get('/admin', admin)
module.exports = router;

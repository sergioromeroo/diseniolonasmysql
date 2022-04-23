var express = require('express');
var router = express.Router();
const {index,quienessomos} = require('../controllers/indexcontroller')

/* GET home page. */
router.get('/', index)
router.get('/quienessomos', quienessomos)
module.exports = router;

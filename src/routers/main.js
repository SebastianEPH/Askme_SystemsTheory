const express =  require('express');
const router = express.Router();

const mainController = require('../controllers/mainController')

router.get('/',mainController.main)
router.get('/add',mainController.add)
router.post('/save',mainController.save)
router.get('/show',mainController.show)
router.get('/about',mainController.about)
//router.get('/save',addController.save)




// Export
module.exports = router;
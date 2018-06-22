const express = require('express');
const router = express.Router();
const storeController=require('../controllers/storeController');
const userController=require('../controllers/userController');
const {catchErrors}=require('../handlers/errorHandlers');
const authController=require('../controllers/authController');
const reviewController=require('../controllers/reviewController');
// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));


router.get('/add',authController.isLoggenIn, storeController.addStore);

router.post('/add',
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.createStore)
	);
router.post('/add/:id',authController.isLoggenIn,
    storeController.upload,
	catchErrors(storeController.resize),
 	catchErrors(storeController.updateStore)
 	);

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));


router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/stores/:id/edit',authController.isLoggenIn, catchErrors(storeController.editStore));
router.get('/login', userController.loginForm);
router.post('/login',authController.login);
router.get('/register', userController.registerForm);
router.get('/map', storeController.mapPage);
router.post('/reviews/:id',authController.isLoggenIn,catchErrors(reviewController.addReview));
router.get('/top',catchErrors(storeController.getTopStores));

router.post('/register',
	userController.validateRegister,
	userController.register,
	authController.login);
router.get('/logout',authController.logout);
router.get('/account',authController.isLoggenIn, userController.account);
router.post('/account',catchErrors(userController.updateAccount));
router.post('/account/forgot',catchErrors(authController.forgot));
router.get('/account/reset/:token',catchErrors(authController.reset));
router.post('/account/reset/:token',authController.confirmedPasswords ,catchErrors(authController.update));
router.get('/api/search',catchErrors(storeController.searchStores));
router.get('/api/stores/near',catchErrors(storeController.mapStores));
router.get('/hearts',authController.isLoggenIn,catchErrors(storeController.getHearts));

router.post('/api/stores/:id/heart',catchErrors(storeController.heartStore));
module.exports = router;
//Small change to test git
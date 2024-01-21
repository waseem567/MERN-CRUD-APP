const controllers = require("../controllers/controllers");
const { body } = require('express-validator');
const multer = require('multer');
const express = require("express");
const router = express.Router();
const upload = multer();
const jwt_auth_check = require("../auth-check-mw/auth");


router.post("/products",jwt_auth_check ,controllers.getAllProducts);

router.post("/product", jwt_auth_check, upload.single('image'),[ 
    body('title').notEmpty().withMessage('Title is required'),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price should be a number'),
    ],controllers.addNewProduct);

router.put("/product",jwt_auth_check,[ 
body('title').notEmpty().withMessage('Title is required'),
body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price should be a number'),
], controllers.updateProduct);

router.delete("/product/:pId", jwt_auth_check,controllers.deleteProduct);

module.exports = router;
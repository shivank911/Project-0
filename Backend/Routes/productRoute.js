const { Router } = require("express");
let express=require("express");
const { getAllproducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReviews } = require("../Controller/productController");
const { isAuthenticatedUser , authorizeRoles } = require("../Middleware/auth");
const router=express.Router()

router.route("/products").get(getAllproducts);

router.route("/admin/products/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);
router.route("/admin/products/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

router.route("/products/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReviews)

module.exports=router;
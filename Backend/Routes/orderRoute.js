const express = require("express");
const { 
    createOrder,
    getSingleOrder, 
    myOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require("../Controller/orderController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../Middleware/auth");

router.route("/order/new").post(isAuthenticatedUser,createOrder);

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);

router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrderStatus);
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);

module.exports = router;
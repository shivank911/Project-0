const Order = require("../Model/orderModel");
const Product = require("../Model/productModel");
const User = require("../Model/userModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError=require("../utils/catchAsyncError");

//create order
exports.createOrder = catchAsyncError(async (req,res,next) =>{
    const {
        shippingInfo,
        orderedItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    }=req.body;
    const order = await Order.create({
        shippingInfo,
        orderedItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success:true,
        order,
    });
});

//get single order
exports.getSingleOrder = catchAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }
    console.log("get single order");
    res.status(200).json({
        success:true,
        order,
    });
});

//get logged in user orders
exports.myOrders = catchAsyncError(async (req,res,next) =>{
    const orders = await Order.find({user : req.user._id});
    res.status(200).json({
        success:true,
        orders,
    });
});

//get all Orders --admin
exports.getAllOrders = catchAsyncError(async (req,res,next) =>{
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach( (order) =>{
        totalAmount = order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

//update order status --Admin
exports.updateOrderStatus = catchAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this Order",400));
    }
    order.orderedItems.forEach( async (o) =>{
        await updateStock(o.product,o.quantity);
    });
    order.orderStatus = req.body.status;
    if(req.body.status ==="Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    });
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave:false});
}

//delete order  --Admin
exports.deleteOrder = catchAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }
    await order.remove();
    res.status(200).json({
        success:true,
    });
});

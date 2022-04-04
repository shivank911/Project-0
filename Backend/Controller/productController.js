const { findByIdAndUpdate } = require("../Model/productModel");
let Product=require("../Model/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError=require("../utils/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");


//create a product --admin
module.exports.createProduct = catchAsyncError(async (req,res,next) => {
    req.body.user = req.user.id;

    const product=await Product.create(req.body);

    res.status(201).json({
        success:true,
        product:product
    });
});
//get all products 
module.exports.getAllproducts = catchAsyncError(async (req,res,next) => {
    const resultPerPage=5;
    const productCount=await Product.countDocuments();
    let apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter().pagenation(resultPerPage);
    let products=await apiFeature.query;
    res.status(200).send({
        message:"path successful",
        products:products,
        productCount
    });
});
//GET PRODUCT DETAILS
module.exports.getProductDetails = catchAsyncError(async (req,res,next) => {
    let product=await Product.findById(req.params.id);
    if(!product){
       return await next(new ErrorHandler("product not found",404));
    }
    else{
        return res.status(201).send({
            success:true.valueOf,
            product
        });
    }

});
//update product--ADMIN
module.exports.updateProduct = catchAsyncError(async (req,res,next) => {
    let product=await Product.findById(req.params.id);
    let data=req.body;
    if(!product){
        return res.status(500).send({
            success:false,
            messsage:"product not found"
        })
    }
   else{
    product=await Product.findByIdAndUpdate(req.params.id,data,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    return  res.status(200).json({
        success:true,
        product
    });
   }
});


//DELETE A PRODUCT
module.exports.deleteProduct = catchAsyncError(async (req,res,next) => {
    let product=await Product.findById(req.params.id);
    if(!product){
        res.status(500).send({
            success:false,
            message:"product not found",
        })
    }
    else{
        let deletedProduct=await Product.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success:true,
            deletedProduct
        });
    }
});

//Create product or Update the Review
exports.createProductReview = catchAsyncError( async (req,res,next) =>{
    let {rating,comment,productId} = req.body;

    let review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString()===req.user._id.toString());
    if(isReviewed){
        product.reviews.array.forEach(rev =>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating = rating,
                rev.comment = comment
            }
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach(rev =>{
        avg+=rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave:false});
    res.status(200).send({
        success:true,
    });
});

//GET ALL REVIEWS 
exports.getProductReviews = catchAsyncError(async (req,res,next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("product not found",404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    }); 
});

//delete reviews
exports.deleteReviews = catchAsyncError(async (req,res,next) => {
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("product not found",404));
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());
    let avg = 0;
    reviews.forEach((rev) =>{
        avg+=rev.rating;
    });
    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews,
    },{
        new : true,
        runValidators : true,
        useFindAndModify:true,
    },
    )
    res.status(200).json({
        success:true,
    })
});
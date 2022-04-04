const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const jwt=require("jsonwebtoken");
const User = require("../Model/userModels")
module.exports.isAuthenticatedUser = catchAsyncError(async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("please login to access",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();

});

module.exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
           return next( new ErrorHandler(`Roles : ${req.user.role} is not allowed to acccess this resource`,403));
        }
        next();
    }
}
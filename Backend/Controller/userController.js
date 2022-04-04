const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError=require("../utils/catchAsyncError");
const User = require("../Model/userModels");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { eq } = require("lodash");

//register a user
module.exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {email,name,password}=req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is sample",
            url:"localhost",
        },
    });
    sendToken(user,201,res);
});


//LOGIN

module.exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const{email,password} = req.body;
    if(!email || !password ){
        return next(new ErrorHandler("Please Enter Email and Password",400));
    }
    const user =await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const isPasswordMatched =await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }
    sendToken(user,200,res);
});

//LOGOUT
module.exports.logout = catchAsyncError (async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged out successful",
    });
});

module.exports.forgotPassword =  catchAsyncError (async (req,res,next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("user not found",404));
    }
    
    //get rESET TOKEN
   const resetToken = user.getResetPasswordToken();
   await user.save({validateBeforeSave:false});

   const resetPasswordUrl = `${req.protocol}://${req.get("Host")}/api/v1/password/reset/${resetToken}`;

   const message = `Your password reset Token is :-\n\n   ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it`;

   try{
       await sendEmail({
           email:user.email,
           subject:`Ecommerce password recovery`,
           message,
       });
       res.status(200).json({
           success:true.valueOf,
           message:`Email sent to ${user.email} successfully`,
       })

   }catch(error){
       user.resetPasswordToken = undefined;
       user.resetPasswordExpire = undefined;
       await user.save({validateBeforeSave:false});

       return next (new ErrorHandler(error.message,500));
   }
});

//reset PASSWORD
exports.resetPassword = catchAsyncError(async(req,res,next) => {
    const resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({resetPasswordToken:resetToken,resetPasswordExpire:{ $gt:Date.now() },
   });
   if(!user){
       return next(new ErrorHandler("reset password token has been expired",400));
   }
   if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match",400));
   }
   user.password = req.body.password;
   user.resetPasswordToken = undefined;
   user.resetPasswordExpire = undefined;
   await user.save();
   sendToken(user,200,res);
});



//get User Detail
exports.getUserDetail = catchAsyncError(async (req,res,next) =>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    });
});

//UPDATE USER password
exports.updatePassword = catchAsyncError(async (req,res,next) =>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched =await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password incorrect",401));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return new ErrorHandler("Password did not match",400);
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
});

//Update user Profile 
exports.updateProfile = catchAsyncError(async (req,res,next) =>{
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
    }
    if(req.body.avatar!==""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});

// Get all users(admin)
exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHander(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });


  // update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Delete User --Admin
  exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });
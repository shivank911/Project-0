const mongoose=require("mongoose");


let productScheme=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please enter product Description"]
    },
    price:{
        type:Number,
        required:[true,"please enter price of product"],
        maxlength:[8,"price cannot exceed 8 character"]
    },
    ratings:{
        type:Number,
        default:0,
    },
    images:[
        {
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"please eneter product category"]
    },
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxlength:[4,"product stock cannot inrease 4 char"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true,
            },
            name:{
            type:String,
            required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
});


let productModel=mongoose.model("Product",productScheme);

module.exports=productModel;
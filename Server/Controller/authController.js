const User = require('../Model/userModel')

exports.signUp = async (req,res,next) => {

  
    if(req.body){
        doc = await User.create(req.body)
        res.status(200).json({
            status:true,
            message:"user created successfully",
            user: doc
        })
    }else{
        res.status(400).json({status:false,message:'invalid request body.'})
    }

}

exports.login = async (req,res,next) => {

    const user = await User.findOne({mobileNo:req.body.mobileNo})

    if(user){
        res.status(200).json({
            status: true,
            message: "user successfully logged in!",
            data: user
        })
    } else {
        res.status(404).json({
            status: false,
            message: "user does not exist, signup first!!."
        })
    }

}
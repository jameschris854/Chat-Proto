const User = require('../Model/userModel')

exports.getAllUsers = async (req ,res ,next) => {
    let doc = {};
    try {
      doc = await User.find();
    } catch (err) {
        res.status(404).json({
            status: false,
            message: "users not found"
        })
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
}
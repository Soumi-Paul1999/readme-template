const { v4: uuidv4 } = require("uuid");

const User = require("../models/userSchema");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneUsers = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const CreateUsers = async (req, res) => {
  try {
    const newUser = new User({
      id: uuidv4(),
      name: req.body.name,
      age: req.body.age,
    });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const UpdateUsers =async (req, res) => {
  try {
    const user = await User.findOne({id : req.params.id})
      
      user.name= req.body.name,
     user.age= req.body.age,
  
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUsers = async(req, res) => {
  try {
    await User.deleteOne({id:req.params.id})
    res.status(200).json({
      message: "User is deleted",
    });
   } catch (error) {
    res.status(500).send(error.message)
  }
 
};



module.exports = {
  getAllUsers,
  getOneUsers,
  CreateUsers,
  UpdateUsers,
  deleteUsers,
};

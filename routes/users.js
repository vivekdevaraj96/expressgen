var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var {userModel}=require('../schema/userSchema.js')
const {dburl}=require('../common/dbConfig.js');
const { hashpassword, hashCompare, createtoken } = require('../auth.js');



mongoose.connect(dburl)


/* GET users listing. */
router.get('/',async function(req, res) {
  try {
    let users= await userModel.find();
    res.status(200).send({
      users,
      message:"users Data fetch successfull!"
    })
  } catch (error) {
    res.status(500).send({
      message:"internal server error",
      error
    })
  }
});

router.post('/signup',async function(req,res){
  try {
    let user= await userModel.findOne({email:req.body.email});
    if(!user){
      const hashedpassword=await hashpassword(req.body.password)

      req.body.password=hashedpassword;

      let user=await userModel.create(req.body)
      res.status(200).send({
        message:"user Signup successfull"
      })
    }else{
      res.status(400).send({message:"user already exist"})
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal server error",
      error
    })
  }
})

router.post('/login',async function(req,res){
  try {
    let user= await userModel.findOne({email:req.body.email});
    if(user){      
      if(await hashCompare(req.body.password, user.password)){
        let token=await createtoken({
          name:user.name,
          email:user.email,
          role:user.role,
          id:user._id
        })
       res.status(200).send({message:"user login successfull",token}) 
      }else{
        res.status(400).send({message:"Invalid credentials"})
      }

    }else{
      res.status(402).send({message:"user doesn't exist"})
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal server error",
      error
    })
  }
})

router.delete('/:id',async function(req,res){
  try {
    let user=await userModel.findOne({_id:req.params.id})
    if(user){
      let user=await userModel.deleteOne({_id:req.params.id})
      res.status(200).send("user deleted successfully")
    }else{
      res.status(400).send("user doesnt exists")
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal server error",
      error
    })
  }
})

router.put('/:id',async function(req,res){
  try {
    let user=await userModel.findOne({_id:req.params.id})
    if(user){
      user.name=req.body.name;
      user.email=req.body.email;
      user.mobile=req.body.mobile;
      user.password=req.body.password;

      await user.save()
      res.status(200).send("user edited successfully")

    }else{
      res.status(400).send("user doesnt exists")
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal server error",
      error
    })
  }
})


module.exports = router;

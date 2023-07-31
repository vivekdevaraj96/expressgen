const mongoose=require('mongoose')
const validator=require('validator')

const userSchema=new mongoose.Schema(
    {
        name:{type:String, required:true},
        mobile:{type:String, default:"000-000-0000"},
        password:{type:String,required:true},
        email:{
            type:String,
            required:true,
            lowercase:true,
            validator:(value)=>{
                return validator.isEmail(value)
            }
        },
        role:{type:String,default:"user"},
        createdAt:{type:Date,default:Date.now}
    }
)

const userModel= mongoose.model('user',userSchema)

module.exports={userModel}
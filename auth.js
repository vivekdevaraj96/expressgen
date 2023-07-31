const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const secretkey="hdvcildbcdabcla;l;"

const saltrounds=10

const hashpassword=async(password)=>{
    const salt=await bcrypt.genSalt(saltrounds)

    const hashedpassword=await bcrypt.hash(password,salt)
    return hashedpassword
}

const hashCompare=async(password,hashedpassword)=>{
    return await bcrypt.compare(password,hashedpassword)
}

const createtoken=async(payload)=>{
 let token=await jwt.sign(payload,secretkey,{expiresIn:"2m"})
 return token;
}

module.exports={hashpassword, hashCompare,createtoken}
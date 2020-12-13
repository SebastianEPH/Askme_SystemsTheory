const helpers = {}
const bcrypt = require('bcryptjs')

helpers.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10)
    return finalpassword = bcrypt.hash(password,salt )
}
helpers.matchPassword = async (password, savedPassword)=>{
    try{
        return await  bcrypt.compare(password, savedPassword);
    }catch (e){
        console.log(e)
    }
}



module.exports = helpers;
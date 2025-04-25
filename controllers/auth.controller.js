export const registerUser = async (req,res)=>{
    console.log("User registered")
    res.status(200).json({
        success:true,
        message:"You you honey singh"
    })
    
}
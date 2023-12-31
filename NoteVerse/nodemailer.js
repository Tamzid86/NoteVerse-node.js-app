const User = require("./dataModels/User.model");
const Token = require("./dataModels/Token.model");

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    
  });

const getForgotPass = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "forgotpassword.html");
  res.sendFile(filePath);
};

const forgotpassword = async(req, res) => {
    const {email} = req.body;

    try {
        const userfind = await User.findOne({email:email});

        

        // const userToken = await resettoken.findOne({ userId: userfind._id });
        //     if (userToken) await userToken.remove();

            const otp = crypto.randomBytes(2).toString("hex");
                    const rtoken = new Token({ userId: userfind._id, token: otp});
                    const setusertoken = await rtoken.save();

            console.log("here")

        if(setusertoken){
            const mailOptions = {
                from:process.env.AUTH_EMAIL,
                to:email,
                subject:"Password Reset",
                html:`<h2>Please use this OTP to reset your password</h2>
                <h1>${otp}</h1>`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("error",error);
                    res.send({message:"Could not send email"})
                }else{
                    console.log("Email sent",info.response);
                    res.redirect("/passreset")
                }
            })

        }

    } catch (error) {
        res.send({message:"Invalid user"})
    }
};

const getPassReset = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "passreset.html");
  res.sendFile(filePath);
};

const passreset = async(req,res)=>{

    const {otp, password} = req.body;

    try {
        const validtoken = await Token.findOne({token: otp});
        
        const validuser = await User.findOne({_id: validtoken.userId})

        if(validuser && validtoken){
            const newpassword = await bcrypt.hash(password,10);
            //const newpassword = password;
            // const setnewuserpass = await User.updateOne({_id:validuser._id},{password:newpassword});
            await User.updateOne({_id: validuser._id}, {$set: {password: newpassword}})

            // setnewuserpass.save();
            res.send({message:"Password has been reset"})

        }else{
            res.send({message:"User does not exist"})
        }
    } catch (error) {
        res.send({error})
    }
}
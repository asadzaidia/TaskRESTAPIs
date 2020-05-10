const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const welcomeEmail = require('../emails/account');

router.post("/user", async (req, res) => {
  const user = new User(req.body);
  
  try {
    await user.save();
    const token  = await user.getAuthToken();
    welcomeEmail(user.email,user.name);
    res.send({
      ok: true,
      message: "User account created successfully!",
      data: user,
      token : token
    });
  } catch (e) {
    res.status(400).send({
      ok: false,
      message: "Bad Request",
      error: e,
    });
  }
});
//not a valid scenario since user cannot see all users data only a 

// router.get("/user",auth,async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send({
//       ok: true,
//       message: "users found",
//       data: users,
//     });
//   } catch (e) {
//     res.status(500).send({
//       ok: 500,
//       message: "something went wrong",
//       error: e,
//     });
//   }
// });

router.get('/user/me',auth,async (req,res)=>{
    res.send({
        ok : true,
        data : req.user
    })
});

const upload = multer({
  fileFilter (req,file,cb) {
    if(!file.originalname.match(/\.(doc|docx|jpg|jpeg|png|PNG)$/)) {
      return cb(new Error('Please upload a valid file'))
    }
    cb(undefined,true);
  }
});

router.post('/user/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
  const buffer = await sharp(req.file.buffer).png().toBuffer();
  req.user.avatar = buffer;
  // req.user.avatar = req.file.buffer;
  await req.user.save();
  res.send({
    ok : true,
    message : 'User Avator Uploaded!'
  })
},(error,req,res,next)=>{
  res.status(400).send({
    ok : false,
    message : error.message
  })
});

router.delete('/user/me/avatar',auth,async(req,res)=>{
  req.user.avatar = undefined;
  try{
    await req.user.save();
    res.send({
      ok : true,
      message : 'User Image deleted'
    })
  }catch(e) {
    res.status(500).send({
      ok : false,
      message : 'Something Went Wrong!'
    })
  }
});

router.get('/user/:id/avatar',async(req,res)=>{
  try{
    const user = await User.findById(req.params.id);
    if(!user && !user.avatar) {
      throw new Error('Avatar not found')
    }

    res.set('Content-Type','image/jpg;image/jpeg;image/png;image/PNG');
    res.send(user.avatar)
  }catch(e) {
    res.status(404).send({
      ok : false,
      message : 'Not Found',
      error : e
    })
  }
})

// router.get("/user/:id", async (req, res) => {
//   try {
//     const user = await User.findById({ _id: req.params.id });
//     if (!user) {
//       return res.status(400).send({
//         ok: false,
//         message: "user not found",
//       });
//     }
//   } catch (e) {
//     res.status(500).send({
//       ok: false,
//       message: "something went wrong",
//       error: e,
//     });
//   }
// });

router.patch("/user/:id", async (req, res) => {
  const allowedKeysToUpdate = ["name", "email", "age", "password"];
  const getKeys = Object.keys(req.body);
  const isValidUpdation = getKeys.every((k) => allowedKeysToUpdate.includes(k));

  if (!isValidUpdation) {
    return res.status(400).send({
      ok: false,
      message: "Bad Request",
    });
  }

  try {
    const user = await User.findById(req.params.id);

    getKeys.map(k=>user[k] = req.body[k]);
    
    await user.save();
    // NOTE 
    ////// findOneByIdAndUpdate does not run middleware things so we have to change it
    
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      return res.status(404).send({
        ok: false,
        message: "User Not found",
      });
    }

    res.send({
      ok: true,
      message: "user updated successfully!",
      user: user,
    });
  } catch (e) {
    res.status(500).send({
      ok: false,
      message: "Invalid",
      error: e,
    });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({
        ok: false,
        message: "user not found",
      });
    }

    res.send({
      ok: true,
      message: "user deleted successfully!",
      user: user,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
      ok: false,
      message: "Something went wrong",
    });
  }
});

router.post("/user/login",async(req,res)=>{
    
    try {
        const user = await User.findUserByCrendentials(req.body.email,req.body.password);
        const token = await user.getAuthToken();

        res.send({
            ok : true,
            message : 'login Successfully',
            user : user,
            token : token
        })
    }catch(e){
        res.status(400).send({
            ok : false,
            message : 'Invalid Email or Credentials',
            error : e
        })
    }
})

module.exports = router;

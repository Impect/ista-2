const restutil = require('../../../utils/response.util');
const db = require('../../../configs/db.config');
var randomstring = require("randomstring");
var passwordHash = require('password-hash');
const { body, validationResult, check } = require('express-validator');

const jwtutil = require('../../../utils/jwt.util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { app } = require('firebase-admin');
const encyptionutil = require('../../../utils/encryption.util');
const encryptionkey = require('../../../configs/env/secret.env');
const imageutil = require('../../../utils/image.util');
const { sequelize } = require('../../../configs/db.config');
const querysources = require('../../../resource/query.resouces');
const logutil = require('../../../utils/log.util');
const nodemailer = require('nodemailer');
const { transported, transporter, mailOptions, resetpassword, sendEmail } = require('../../../utils/nodemailer.util');
const randtoken = require('rand-token');
const crypt = require('../../../utils/encryption.util');
const secretkey = require('../../../configs/env/secret.env');



exports.register = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            restutil.returnValidationResponse(res, errors.array());
            return;
        }

        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        let hashedpass = await bcrypt.hash(password,saltRounds);
        let profileImage = '/assets/profileimages/profile.png';

        db.customer.findOne({
            where : {
                email : email,
                username : username
            }
        }).then(oldcustomer => {
            if(oldcustomer != null){
                restutil.returnValidationResponse(res, 'Мэйл хаяг эсвэл хэрэглэгчийн нэр давхцаж байна. Та өөр хаягаар бүртгүүлнэ үү.')
            }else{
                db.customer.create({
                    email: email,
                    username : username,
                    password: hashedpass,
                    profileImage : profileImage
                    
                })
                .then(()=>
                {
                    restutil.returnActionSuccesResponse(res)
                }).catch(error => {
                    console.log(error);
                    next(error)
                });
            }
        })

    } catch (error) {
        next(error)
    }
}



exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            console.log(errors.array());
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        
        //Validation
        let email = req.body.email;
        let password = req.body.password;

        db.customer.findOne({
            attributes: ["id","username","profileImage","password"],
            where: {
                email: email
            },
            raw : true
        }).then((data) => {
            if(data != null){
                if(bcrypt.compareSync(password, data.password)){
                    let u_data = 
                    encyptionutil.encrypt(JSON.stringify(
                        {
                            id : data.id,
                            logindate : Date.now(),
                            type : "Customer"
                        }
                    ));
                    delete  data['password'];

                    let token = jwt.sign({data : u_data}, encryptionkey.tokenkey, {expiresIn: "12h"});

                        db.customer.update(
                        { token : token },
                        { where : { id : data.id }
                        }).then(()=>{
                            restutil.returnDataResponce(res, {userinfo : data, token : encyptionutil.encrypt(token)});
                        })
                    
                }else{
                    // Nuuts ug buruu baival
                    restutil.returnValidationResponse(res)
                }
            }else{
                // Hereglegch oldohgui baival
                restutil.returnValidationResponse(res);
            }
        }).catch(error => {
            console.log(error);
            next(error)
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        let { id } = req.params.id;

        

    } catch (error) {
        next(error);
    }
};

// forgot password mail shideh
exports.forgotpassword = async (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }

        let email = req.body.email;

        db.customer.findOne({
            where: { email : email }
        }).then((data)=>{
            if(data.email==null){
                restutil.returnValidationResponse(res, "Имэйл бүртгэлгүй байна.");
            }else{
                token = randtoken.generate(20);
                sent = sendEmail(email, token);
                
                if(sent !='0')
                {
                    db.forgot_password.create({
                        token : token,
                        customerId : data.id
                    }).then(()=>{
                        restutil.returnActionSuccesResponse(res, "Нууц үг сэргээх хүсэлт таны майлруу илгээгдлээ.");
                    })
                }
                else
                {
                    restutil.returnErrorResponse(res);
                }
            }
        })
        
    } catch (error) {
        next(error)
    }
}



// forgot password mail shidesnii daraa hiigdeh uildel
exports.updatepassword = async (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }

        let token = req.body.token;
        let password = req.body.password;
        let hashedpass = await bcrypt.hash(password,saltRounds);


        db.forgot_password.findOne({
            where : { token : token }
        }).then((data)=>{
            if(data !==null){
                db.customer.update({
                    password : hashedpass
                },{
                    where : { id : data.id }
                }).then(()=>{
                    restutil.returnActionSuccesResponse(res);
                })

            }else{
                restutil.returnValidationResponse(res,"Линк асуудалтай байна.");
            }
        })
        
    } catch (error) {
        next(error)
    }
}


/*
* profile aas nuuts ug solih
*/ 

exports.changepassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let id = jwtutil.userTokenData(req, 'id');
        let oldpassword = req.body.oldpassword;
        let password = req.body.password;
        let newhashedpass = await bcrypt.hash(password,saltRounds);

        db.customer.findOne({
            where: { id : id}
        }).then((data) => {
            if( data.password !=null){
                if(bcrypt.compareSync(oldpassword, data.password)){

                    db.customer.update({
                        password : newhashedpass
                    },{
                        where : { id : id }
                    })
                    restutil.returnActionSuccesResponse(res);
                }else{
                    restutil.returnValidationResponse(res, "Хуучин нууц үг таарахгүй байна.");
                }
            }else{
                restutil.returnValidationResponse(res, "Нууц үгээ оруулна уу.");
            }
        })
    }
    catch (error) {
        next(error);
    }
}

exports.customerinfo = async( req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }


       if(!jwtutil.ispublicuser(req)){

        let id = jwtutil.userTokenData(req, "id");
        let username = req.body.username;
        
        db.customer.findOne({
                attributes: [
                    "id",
                    "username",
                    "lastname",
                    "firstname",
                    "email",
                    "phonenumber",
                    "bio",
                    "link",
                    "profileImage",
                    "createdAt",
                    [db.Sequelize.literal(`(select customer.id = ${id}  from dual)`), 'owninfo']
                ],
                where: { username: username }
                }).then((data) => {
                if (data == null) {
                    restutil.retunrNoDataResponse(res);
                    return;
                } else {

                    //customer follow hiisn humuus
                    db.customer_follow.findAll({
                        attributes: ['followerId'],
                        where : { customerId : data.id },
                        include : [{
                            model : db.customer,
                            attributes : ['username', 'profileImage']
                        }] 
                    }).then((following)=>{
                        
                        //customeriig followdson humuus
                        db.customer_follow.findAll({
                            attributes : ['customerId'],
                            where : { followerId : data.id },
                            include : [{
                                model : db.customer,
                                attributes : ['username', 'profileImage']
                            }] 
                        }).then((followers)=>{
                        
                             restutil.returnDataResponce(res, {customerinfo :  data, followingcumstomer : following, followedcustomer : followers});
                        })
                    })
                }
            });
       }else{

        let username = req.body.username;

          db.customer
            .findOne({
              attributes: [
                "id",
                "username",
                "lastname",
                "firstname",
                "email",
                "phonenumber",
                "bio",
                "link",
                "profileImage",
                "createdAt",
                [db.Sequelize.literal(`(select 'false' from dual)`), 'ownInfo']
                //[db.Sequelize.literal(`(select customer.username = ${username}  from dual)`), 'owninfo']
              ],
              where: { username: username },
              }).then((data) => {

              console.log(JSON.stringify(data));
              if (data == null) {
                restutil.retunrNoDataResponse(res);
                return;
              } else {
                //customer follow hiisn humuus
                db.customer_follow.findAll({
                    attributes: ['followerId'],
                    where : { customerId : data.id },
                    include : [{
                        model : db.customer,
                        attributes : ['username', 'profileImage']
                    }] 
                }).then((following)=>{
                    
                    //customeriig followdson humuus
                    db.customer_follow.findAll({
                        attributes : ['customerId'],
                        where : { followerId : data.id },
                        include : [{
                            model : db.customer,
                            attributes : ['username', 'profileImage']
                        }] 
                    }).then((followers)=>{

                             restutil.returnDataResponce(res, {customerinfo :  data, followingcumstomer : following, followedcustomer : followers});
                    })
                })
              }
            });
        }

    } catch (error) {
        next(error)
    }
}

exports.customerinfofill = async( req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        
        let id = jwtutil.userTokenData(req, 'id');
        let lastname = req.body.lastname;
        let firstname = req.body.firstname;
        let email = req.body.email;
        let phonenumber = req.body.phonenumber;
        let bio = req.body.bio;
        let link = req.body.link;
        let username = req.body.username;
        

        db.customer.update(
        {   lastname : lastname,
            firstname : firstname,
            username : username,
            phonenumber : phonenumber,
            link : link,
            email : email,
            bio : bio,
        },
        { where :{
                id : id
            }
        }).then(() =>{
        restutil.returnActionSuccesResponse(res);
        })
    } catch (error) {
        next(error)
    }
}

exports.changeprofile = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let id = jwtutil.userTokenData(req, 'id');

        imageutil.imageupload(req,'/assets/profileimages/').then(imageaddress =>{
            if(imageaddress == ''){
                restutil.returnValidationResponse(res, 'Зургыг заавал хавсаргах шаардлагатай')
            }else{
                db.customer.update({
                    profileImage : imageaddress,}, {
                    where : {
                        id : id
                    }
                }).then(() => {
                    restutil.returnActionSuccesResponse(res)
                })
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.deleteprofile = async(req, res, next)  => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }

        let id = jwtutil.userTokenData(req, 'id');
        let profileImage = '/assets/profileimages/profile.png';

        db.customer.update({
            profileImage : profileImage,}, {
            where : {
                id : id
            }
        }).then(() => {
            restutil.returnActionSuccesResponse(res)
        })

    } catch (error) {
        next(error)
    }
}

exports.mypff = async(req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        
        let id = jwtutil.userTokenData(req, 'id');

        db.sequelize.query (querysources.pff_query.postfollowerfollowing,{
            replacements: { 
                p_customerId : id
            },
            type: db.sequelize.QueryTypes.SELECT
        } ).then(result => {
            restutil.returnDataResponce(res, result);
        }).catch(error => {
            logutil.writeLog(error);
        })

    } catch (error) {
        logutil.writeLog(error);
        next(error)
    }
}

exports.pff = async(req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {


            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        
        let { id, name, title  }= req.body;
        
        db.sequelize.query (querysources.pff_query.postfollowerfollowing,{
            replacements: { 
                p_customerId : id
            },
            type: db.sequelize.QueryTypes.SELECT
        } ).then(result => {
            restutil.returnDataResponce(res, result);
        }).catch(error => {
            console.log(error);
            next(error);
        })

    } catch (error) {


        next(error)
    }
}

exports.validate = (method) => {
    switch (method) {
        case 'register': {
            return [
                body('username','Нэр талбар дээр хоосон утга зөвшөөрөхгүй').notEmpty(),
                body('email','Майл хаягаа оруулна уу').notEmpty(),
                body('email','Майл хаяг оруулна уу.').isEmail(),
                body('password', 'Нууц үгээ оруулна уу.').notEmpty(),
                body('password', ' Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой.').isLength({ min: 6 }),
            ]
        }
        case 'login': {
            return [
                body('email','Майл хаягаа оруулна уу.').notEmpty(),
                body('email','Майл хаяг оруулна уу.').isEmail(),
                body('password', 'Нууц үгээ оруулна уу.').notEmpty(),
                body('password', ' Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой.').isLength({ min: 6 }),
            ]
        }
        case 'changepassword': {
            return [
                body('oldpassword', 'Нууц үгээ оруулна уу.').notEmpty(),
                body('oldpassword','Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой.').isLength({ min:6 }),
                body('password', 'Нууц үгээ оруулна уу.').notEmpty(),
                body('password','Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой.').isLength({ min:6 }),                
            ]
        }
        case  'customerinfo': {
            return [
                body('lastname','Овогоо оруулна уу.').notEmpty(),
                body('firstname','Нэрээ оруулна уу.').notEmpty(),
                body('phonenumber','Зөвхөн тоон утга орно.').isNumeric(),
                body('phonenumber','Утасны дугаараа оруулна уу.').notEmpty(),
            ]
        }
    }
}
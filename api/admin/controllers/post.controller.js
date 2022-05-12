const restutil = require('../../../utils/response.util');
const fileutil = require('../../../utils/file.util');
const fs = require("fs");
const db = require('../../../configs/db.config');
var randomstring = require("randomstring");
var passwordHash = require('password-hash');
const { body, validationResult, Result } = require('express-validator');
const jwtutil = require('../../../utils/jwt.util');
const imageutil = require('../../../utils/image.util');
const crypt = require('../../../utils/encryption.util');
const secretkey = require('../../../configs/env/secret.env');
const jwt = require('jsonwebtoken');


// post create
exports.createpost = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let customerId = jwtutil.userTokenData(req, 'id');
        let descr = req.body.descr;
        let qty = req.body.qty;
        let price = req.body.price;
        let categoryname = req.body.categoryname;
        
        
        db.post.create({
            where : {[db.Sequelize.Op.in] : [db.Sequelize.literal(`SELECT id from category where name = ${categoryname}`)]},
            descr : descr,
            qty : qty,
            price : price,
            customerId : customerId,
            //categoryId : categoryId,
            
        }).then(newPost => {
            imageutil.multifileupload(req,'/assets/post/image_videos/').then(fileaddress =>{
                if(fileaddress == ''){
                    restutil.returnValidationResponse(res, 'Файлыг заавал хавсаргах шаардлагатай')
                }else{
                    fileaddress.forEach(async element => {
                        await db.post_images.create({
                            image : element,
                            postId : newPost.id
                        })
                   });
                    restutil.returnActionSuccesResponse(res);
                }
            })
        })
    } catch (error) {
        next(error)
    }
}

exports.updatepost = async(req,res,next) =>{
        try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
            let customerid = jwtutil.userTokenData(req, 'id');
            let descr = req.body.descr;
            let qty = req.body.qty;
            let price = req.body.price;
            let order = req.body.order;
            let id = req.body.id;

            db.post.update(
                {
                    descr : descr,
                    qty : qty,
                    price :price,
                    order : order,
                },
                {where : {                    
                    id: id,
                    customerid : customerid
                }}).then(()=>{
                imageutil.multiimageupload(req , '/assets/post/image_videos/').then(imageaddress =>{
               
                    db.post_images.destroy({
                        where : { postId : id }
                    }).then(() => {
                        imageaddress.forEach(async element => {
                            await db.post_images.create({
                                image : element,
                                postId : id
                            })
                       });
                       restutil.returnActionSuccesResponse(res);
                    })
               

                })

            })
        } catch (error) {
            next(error)
        }
}

exports.deletepost = async(req, res, next) => {
    try {
        let id = req.body.postId;

        db.post_images.destroy({
            where : { postId : id }
        }).then(()=>{
            db.post.destroy({
                where : { id : id}
            }).then(()=>{
                restutil.returnActionSuccesResponse(res);
            })
        })
    } catch (error) {
        next(error)
    }
}

//post myposts listFindAll
exports.myposts = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let customerid = jwtutil.userTokenData(req, 'id');
        
        db.post.findAll({
            where : { customerid: customerid },
            attributes : ['id','descr','qty','price','order'],

            include : [{
                model: db.post_comment,
                attributes : ['id', 'text','customerId','createdAt','updatedAt'],
                include :  [{
                    model: db.customer,
                    attributes : ['lastname','firstname','username','profileImage']
                }]
            },
            {
                model: db.post_like, 
                attributes : ['id'],
                include: [{model: db.customer,
                attributes : ['username']}]
                
            },
            {
                model : db.post_images,
                attributes : ['image'],
            },
            {
                model : db.customer,
                attributes : ['id','username','email','profileImage']
            }
        ]
        }).then(data => {
            restutil.returnDataResponce(res, data);
        })
    } catch (error) { 
        next(error)
    }
} 

exports.customerpost = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }

            if(!jwtutil.ispublicuser(req)){
                let customerId = jwtutil.userTokenData(req, 'id');
                let username = req.body.username;
                
                db.customer.findOne({
                    attributes : ["id","username", 'lastname', 'firstname', 'email', 'phonenumber', 'profileImage', 'createdAt'],
    
                   where : {[db.Sequelize.Op.or] : [ { username : username }, { id : customerId }] },
                    //where : {  username : username ,  id : customerId  },
                    raw: true,
                }).then((data)=>{
                    db.post.findAll({
                        attributes : ['id','descr','qty','price','order','createdAt','updatedAt', [db.Sequelize.literal(`(select post.customerId = ${customerId} from dual)`), 'ownPost']],
                        where : { customerId : data.id }, 
                        include : [{
                            model: db.post_comment,
                            attributes : ['id', 'text','customerId','createdAt','updatedAt'],
                            include :  [{
                                model: db.customer,
                                attributes : ['username','profileImage']
                            }]
                        },
                        {
                            model: db.post_like, 
                            attributes : ['id','customerId'],
                            include : [{
                                model: db.customer,
                                attributes : ['username']
                            }]
                        },
                        {
                            model : db.post_images,
                            attributes : ['image'],
                        },
                        {
                            model : db.customer,
                            attributes : ['username','email','profileImage']
                        }]}).then(posts=>{
                            console.log("id customer", data.id);
    
                             if(posts == null)
                             {
                                 restutil.retunrNoDataResponse(res);
                                 return;
                            }else{
                                restutil.returnDataResponce(res, posts);
    
                            }
                        })
                        
                })
            }else
            {
                let username = req.body.username;
                
                db.customer.findOne({
                    attributes : ['id','username', 'lastname', 'firstname', 'email', 'phonenumber', 'profileImage', 'createdAt'
                ],
                    where : { username : username}
                }).then((data)=>{
                    db.post.findAll({
                        attributes : ['id','descr','qty','price','order','createdAt','updatedAt', [db.Sequelize.literal(`(select 'false' from dual)`), 'ownPost']],
                        where : { customerId : data.id},
                        include : [{
                            model: db.post_comment,
                            attributes : ['id', 'text','customerId','createdAt','updatedAt'],
                            include :  [{
                                model: db.customer,
                                attributes : ['username','profileImage']
                            }]
                        },
                        {
                            model: db.post_like, 
                            attributes : ['id','customerId'],
                            include : [{
                                model: db.customer,
                                attributes : ['username']
                            }]
                        },
                        {
                            model : db.post_images,
                            attributes : ['image'],
                        },
                        {
                            model : db.customer,
                            attributes : ['username','email','profileImage']
                        }]
                    }).then((posts)=>{
                            if(posts == null)
                            {
                                restutil.retunrNoDataResponse(res);
                                return;
                            }else{
                                restutil.returnDataResponce(res, posts);
                            }
                        })
                        
                })
            }
        
        } catch (error) { 
        next(error)
    }
}

exports.postlistrandom = async(req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        db.post.findAll(
            {
            attributes : ['id', 'descr','qty','price','order','createdAt','updatedAt'],
            
            
            include : [{
                model: db.post_comment,
                attributes : ['id', 'text','customerId','createdAt','updatedAt'],
                include :  [{
                    model: db.customer,
                    attributes : ['username','profileImage']
                }]
            },
            {
                model: db.post_like, 
                attributes : ['id','customerId'],
                include : [{ model : db.customer,
                attributes : ['username']}]
            },
            {
                model : db.post_images,
                attributes : ['image'],
            },
            {
                model : db.customer,
                attributes : ['username','email','profileImage']
            },
            

        ] ,
        order : db.Sequelize.literal('RAND()'),
        limit : 10
    },
        
        
        ).then(data => {
            restutil.returnDataResponce(res, data);
        })

    } catch (error) {
        next(error)
    }
}



exports.postsearch = async(req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let filterdata = req.body.username;
        db.customer.findAll({
            attributes : ['username', 'profileImage','bio'],
            where : {
                username : {[db.Sequelize.Op.like] : `%${filterdata}%`}
            }
        }).then((data)=>{
            restutil.returnDataResponce(res, data);
        }) 
    } catch (error) {
        next(error);
    }
}


exports.followedcustomerposts = async (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let customerId = jwtutil.userTokenData(req, 'id');
        let postnumber = req.body.postnumber;
        db.post.findAll({
            where : {
                customerId : {[db.Sequelize.Op.in] : [db.Sequelize.literal(`SELECT followerId from customer_follow where customerId = ${customerId}`)]}
               },
               limit : postnumber,
               order : [['createdAt', 'DESC']],
               include : [{
                   model: db.post_comment,
                   attributes : ['id', 'text','customerId','createdAt','updatedAt'],
                   include :  [{
                       model: db.customer,
                       attributes : ['username','profileImage']
                   }]
               },
               {
                   model: db.post_like, 
                   attributes : ['id','customerId']
               },
               {
                   model : db.post_images,
                   attributes : ['image'],
               },
               {
                   model : db.customer,
                   attributes : ['id','username','email','profileImage']
               }]}).then((data) => {
               if(data == ''){
                
                db.post.findAll({
                    attributes : ['id', 'title','descr','qty','price','order','createdAt','updatedAt'],

                include : [{
                    model: db.post_comment,
                    attributes : ['id', 'text','customerId','createdAt','updatedAt'],
                    include :  [{
                        model: db.customer,
                        attributes : ['username','profileImage']
                    }]
                },
                {
                    model: db.post_like, 
                    attributes : ['id','customerId']
                },
                {
                    model : db.post_images,
                    attributes : ['image'],
                },
                {
                    model : db.customer,
                    attributes : ['username','email','profileImage']
                },
                ] ,
                order : db.Sequelize.literal('RAND()'),
                limit : postnumber
                })
               }else{
                restutil.returnDataResponce(res, data);
               }
               
           })
    } catch (error) {
        next(error)
    }
}

exports.validate = (method) => {
    switch (method) {
        case 'createpost': {
            return [

                body('descr','Тайлбараа оруулна уу.').notEmpty(),
                body('qty','Тоо ширхэгээ оруулна уу.').notEmpty(),
                body('qty','Тоо оруулна уу.').isNumeric(),
                body('price', 'Үнэ оруулна уу.').notEmpty(),
                body('price','Тоо оруулна уу.').isNumeric(),
                
            ]
        }
        case 'updatepost': {
            return [
                body('descr','Тайлбараа оруулна уу.').notEmpty(),
                body('qty','Тоо ширхэгээ оруулна уу.').notEmpty(),
                body('qty','Тоо оруулна уу.').isNumeric(),
                body('price', 'Үнэ оруулна уу.').notEmpty(),
                body('price','Тоо оруулна уу.').isNumeric(),
                body('id','Постны Id-г оруулна уу.')

            ]
        }
    }
}
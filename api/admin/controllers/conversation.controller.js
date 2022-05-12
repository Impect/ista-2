const restutil = require('../../../utils/response.util');
const db = require('../../../configs/db.config');
var randomstring = require("randomstring");
var passwordHash = require('password-hash');
const { body, validationResult } = require('express-validator');
// const mailutil = require('../../../utils/mail.util');
const jwtutil = require('../../../utils/jwt.util');


exports.newconversation = async(req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let customerId = jwtutil.userTokenData(req, 'id');
        let chatterId = req.body.chatterId;

        db.conversation.create({
            customerId : customerId,
            customerId1 : chatterId   
        },{
            where : {
                customerId1 : chatterId,
                customerId : customerId
            }
        }).then((data)=>{
            restutil.returnActionSuccesResponse(res, data);
        })

    } catch (error) {
        next(error)
    }
}
exports.deleteconversation = async(req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            restutil.returnValidationResponse(res, errors.array());
            return;
        }
        let customerId = jwtutil.userTokenData(req, 'id');
        let chatterId = req.body.chatterId;
        db.conversation.destroy({
            where : { customerId : customerId, customerId1 : chatterId }
        }).then((data)=>{
            db.conversation_detail.destroy({
                where : { conversationId :  data.id}
            }).then(()=>{
                restutil.returnActionSuccesResponse(res);
            })
        })
    } catch (error) {
        next(error)
    }
}
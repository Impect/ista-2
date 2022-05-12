const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/conversation_detail.controller')

    /**
    *  @api {get} /api/admin/conver_detail/text Conversation text
    *  @apiGroup CONVERSATION_DETAIL
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *   {
    *       "text" : "text",
    *       "conversationId" : "conversationId"
    *   }
    **/

    app.get('/api/admin/conver_detail/text', jwtutil.verifyCustomer , controller.textconversation);

    /**
    *  @api {delete} /api/admin/conver_detail/text Delete conversation text
    *  @apiGroup CONVERSATION_DETAIL
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *   {
    *       "id" : "textId",
    *       "conversationId" : "conversationId"
    *   }
    **/

    app.delete('/api/admin/conver_detail/delete', jwtutil.verifyCustomer , controller.textdeleteconversation);

}
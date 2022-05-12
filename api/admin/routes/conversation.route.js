const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/conversation.controller')

    /**
    *  @api {post} /api/admin/conversation/new Create a conversation 
    *  @apiGroup CONVERSATION
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "ChatterId" : "ChatterId"
    *  }
    **/

    app.post('/api/admin/conversation/new', jwtutil.verifyCustomer , controller.newconversation);

    /**
    *  @api {delete} /api/admin/conversation/delete Delete a conversation 
    *  @apiGroup CONVERSATION
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "ChatterId" : "ChatterId"
    *  }
    **/

    app.delete('/api/admin/conversation/delete', jwtutil.verifyCustomer , controller.deleteconversation);

}
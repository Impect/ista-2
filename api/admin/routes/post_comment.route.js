const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/post_comment.controller')

    /**
    *  @api {post} /api/admin/post/comment Create comment
    *  @apiGroup POST_COMMENT
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "text" : "text",
    *       "postId" : "Id"
    *  }
    **/

    app.post('/api/admin/post/comment', jwtutil.verifyCustomer, controller.comment);
    
    /**
    *  @api {get} /api/admin/post/commentlist Get all comment
    *  @apiGroup POST_COMMENT
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "text" : "text",
    *       "postId" : "Id"
    *  }
    **/

    app.get('/api/admin/post/commentlist', controller.commentlist);

    /**
    *  @api {put} /api/admin/post/commentlist Update comment
    *  @apiGroup POST_COMMENT
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "text" : "text",
    *       "postId" : "Id"
    *  }
    **/

    app.put('/api/admin/post/commentupdate', jwtutil.verifyCustomer, controller.commentupdate);

    /**
    *  @api {put} /api/admin/commentdelete Delete comment
    *  @apiGroup POST_COMMENT
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *    "Id" : "Id"
    *  }
    **/

    app.get('/api/admin/post/commentdelete', controller.commentdelete);

}
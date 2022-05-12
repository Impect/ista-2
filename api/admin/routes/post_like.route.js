const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/post_like.controller')

    /**
    *  @api {post} /api/admin/post/like Post like 
    *  @apiGroup POST_LIKE
    *  @apiPermission users
    **/

    app.post('/api/admin/post/like', jwtutil.verifyCustomer, controller.like);

    /**
    *  @api {get} /api/admin/post/likelist Post like 
    *  @apiGroup POST_LIKE
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "postId" : "postId"
    *  }
    **/

    app.get('/api/admin/post/likelist', jwtutil.verifyCustomer, controller.likelist);

    /**
    *  @api {post} /api/admin/post/unlike Post unlike 
    *  @apiGroup POST_LIKE
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "postId" : "postId"
    *  }
    **/

    app.post('/api/admin/post/unlike',  jwtutil.verifyCustomer, controller.unlike);

}
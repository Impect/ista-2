const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/customer_follow.controller')

    /**
    *  @api {post} /api/admin/follower/follow Follow customer 
    *  @apiGroup CUSTOMER_FOLLOW
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "customerId" : "customerId"
    *  }
    **/

    app.post('/api/admin/follower/follow', jwtutil.verifyCustomer , controller.follow);

    /**
    *  @api {get} /api/admin/follower/myfollowers My followers 
    *  @apiGroup CUSTOMER_FOLLOW
    *  @apiPermission users
    **/

    app.get('/api/admin/follower/myfollowers', jwtutil.verifyCustomer , controller.myfollowerlist);

    /**
    *  @api {get} /api/admin/follower/customerfollowers Customer followers 
    *  @apiGroup CUSTOMER_FOLLOW
    *  @apiPermission users
    **/

    app.get('/api/admin/follower/customerfollowers', controller.customerfollowerlist);

    /**
    *  @api {post} /api/admin/follower/unfollow Unfollow 
    *  @apiGroup CUSTOMER_FOLLOW
    *  @apiPermission users
    **/

    app.post('/api/admin/follower/unfollow', jwtutil.verifyCustomer , controller.unfollow);

}
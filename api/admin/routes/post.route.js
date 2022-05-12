const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/post.controller')

    /**
    *  @api {post} /api/admin/post/create Create post 
    *  @apiGroup POST
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "descr" : "string",
    *       "qty" : "string",
    *       "price" : "number",
    *       "order" : "number",
    *       "categoryId" = "categoryId"
    *  }
    **/

    app.post('/api/admin/post/create', jwtutil.verifyCustomer , controller.validate('createpost') , controller.createpost);

    /**
    *  @api {post} /api/admin/post/mypost MyPosts 
    *  @apiGroup POST
    *  @apiPermission users
    **/

    app.post('/api/admin/post/mypost', jwtutil.verifyCustomer , controller.myposts); 

    /**
    *  @api {get} /api/admin/post/customerpost MyPosts 
    *  @apiGroup POST
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "customerId" : "customerId",
    *  }
    **/

    app.get('/api/admin/post/customerpost', controller.customerpost); 

    /**
    *  @api {get} /api/admin/post/followedcustomerposts Followed customer posts
    *  @apiGroup POST
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "postnumber" : "postnumber",
    *  }
    **/

    app.get('/api/admin/post/followedcustomerposts',jwtutil.verifyCustomer, controller.followedcustomerposts); 
    
    /**
    *  @api {get} /api/admin/post/listrandom Random posts
    *  @apiGroup POST
    *  @apiPermission users
    **/

    app.get('/api/admin/post/listrandom', controller.postlistrandom); 

    /**
    *  @api {put} /api/admin/post/update Update post 
    *  @apiGroup POST
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "descr" : "string",
    *       "qty" : "string",
    *       "price" : "number",
    *       "order" : "number",
    *       "Id" = "PostId"
    *  }
    **/

    app.put('/api/admin/post/update', jwtutil.verifyCustomer, controller.validate('createpost'), controller.updatepost);

    /**
    *  @api {post} /api/admin/post/search Search post
    *  @apiGroup POST
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "username" : "username",
    *  }
    **/

    app.post('/api/admin/post/search', controller.postsearch); 

    /**
    *  @api {post} /api/admin/post/delete Delete post
    *  @apiGroup POST
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "id" : "postId",
    *  }
    **/

    app.post('/api/admin/post/delete',jwtutil.verifyCustomer, controller.deletepost);

}
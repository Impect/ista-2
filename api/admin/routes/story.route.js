const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/story.controller')

    /**
    *  @api {post} /api/admin/story/create Story create 
    *  @apiGroup STORY
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *      "title" : "title",
    *       "file" : "file" 
    *  }
    **/

    app.post('/api/admin/story/create', jwtutil.verifyCustomer, controller.createstory);

    /**
    *  @api {get} /api/admin/story/list Story list 
    *  @apiGroup STORY
    *  @apiPermission users
    **/

    app.get('/api/admin/story/list', controller.storylist);

    /**
    *  @api {put} /api/admin/story/update Story update 
    *  @apiGroup STORY
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "Id" : "Id",
    *       "title" : "title",
    *       "image" : "image"
    *  }
    **/

    app.put('/api/admin/story/update', jwtutil.verifyCustomer, controller.updatestory);

    /**
    *  @api {delete} /api/admin/story/delete Story delete 
    *  @apiGroup STORY
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *       "Id" : "Id"
    *  }
    **/

     app.delete('/api/admin/story/delete', jwtutil.verifyCustomer, controller.deletestory);


}
const { oneOf, check, body } = require('express-validator');
const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/customer.controller')

    /**
    *  @api {get} /api/admin/customer/register register customer 
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    *  @apiParamExample {json} Input
    * {
    *    "email" : "email",
    *    "username" : "username"
    *    "password" : "password"
    * }
    **/

    app.post('/api/admin/customer/register', controller.validate('register'), controller.register);

    /**
    *  @api {post} /api/admin/customer/login Login
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    *  @apiParamExample {json} Input
    * {
    *    "email" : "email",
    *    "password" : "password"
    * }
    **/

    app.post('/api/admin/customer/login' , controller.validate('login'), controller.login);

    /**
    *  @api {get} /api/admin/customer/customerinfo Customer info 
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    *  @apiParamExample {json} Input
    * {
    *    "username" : "username"
    * }
    **/
    
    app.post('/api/admin/customer/customerinfo', controller.customerinfo);


    /**
    *  @api {post} /api/admin/customer/fillinfo fillinfo 
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    *  @apiParamExample {json} Input
    * {
    *    "lastname" : "lastname",
    *    "firstname" : "firstname",
    *    "phonenumber" : "phonenumber",
    *    "profileimage" : "profileimage"
    * }
    **/


    app.post('/api/admin/customer/infofill',jwtutil.verifyCustomer , controller.customerinfofill);

    /**
    *  @api {post} /api/admin/customer/changepassword changepassword
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    *  @apiParamExample {json} Input
    * {
    *    "oldpassword" : "oldpassword",
    *    "password" : "password"
    * }
    **/

    app.post('/api/admin/customer/changepassword',jwtutil.verifyCustomer , controller.validate('changepassword') , controller.changepassword);

    /**
    *  @api {get} /api/admin/customer/mypff My post, followers, following
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    **/

    app.get('/api/admin/customer/mypff',jwtutil.verifyCustomer , controller.mypff);

    /**
    *  @api {get} /api/admin/customer/pff Customer post, followers, following
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    *  @apiParamExample {json} Input
    *  {
    *     "id" : "id"
    *  }
    **/

     app.get('/api/admin/customer/pff', controller.pff);

    /**
    *  @api {post} /api/admin/customer/cpi Change profile image
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    **/

     app.post('/api/admin/customer/cpi',jwtutil.verifyCustomer , controller.changeprofile);

     /**
    *  @api {post} /api/admin/customer/dpi Delete profile image
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    **/

    app.delete('/api/admin/customer/dpi',jwtutil.verifyCustomer , controller.deleteprofile);

    /**
    *  @api {get} /api/admin/customer/forgotpassword Forgotpassword
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    **/

    app.get('/api/admin/customer/forgotpassword', controller.forgotpassword);

    /**
    *  @api {post} /api/admin/customer/updatepassword Updatepassword
    *  @apiGroup CUSTOMER
    *  @apiPermission users
    **/

     app.post('/api/admin/customer/updatepassword', controller.updatepassword);

}
const { oneOf, check } = require('express-validator');
const jwtutil = require('../../../utils/jwt.util');

module.exports = function (app) {
    const controller = require('../controllers/customer_profile.controller')

    /**
    *  @api {get} /api/admin/customer test GET ALL 
    *  @apiGroup CUSTOMER_PROFILE
    *  @apiPermission users
    **/

    app.get('/api/admin/customer_info', controller.customerprofileinfo);


}
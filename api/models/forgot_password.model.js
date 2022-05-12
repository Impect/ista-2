module.exports = (sequelize, Sequelize) => {
    const customer = sequelize.define('forgot_password', {
        id: {
            type : Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status : {
            type : Sequelize.STRING,
            allowNull : true
        },
        token : {
            type : Sequelize.STRING(1000),
            allowNull : false
        }
    });

    return customer;
}
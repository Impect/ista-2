module.exports = (sequelize, Sequelize) => {
    const post = sequelize.define('post', {
        id: {
            type : Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descr : {
            type : Sequelize.STRING,
            allowNull : false
        },
        qty : {
            type : Sequelize.INTEGER,
            allowNull : false,
            defaultValue: 0
        },
        price : {
            type : Sequelize.INTEGER,
            allowNull : false,
            defaultValue: 0
        },
        order : {
            type : Sequelize.INTEGER,
            allowNull : false,
            defaultValue: 0
        },
    });

    return post;
}
module.exports = (sequelize, Sequelize) => {

    const story = sequelize.define('story', {
        id: {
            type : Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type : Sequelize.STRING,
            allowNull : false
        },
        seen: {
            type : Sequelize.INTEGER,
            allowNull : true
        }
    });

    return story;
    
}
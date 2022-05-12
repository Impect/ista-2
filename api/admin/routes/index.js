function initAdminRouters(app) {
    require('./category.route')(app);
    require('./customer.route')(app);
    require('./customer.route')(app);
    require('./post.route')(app);
    require('./post_comment.route')(app);
    require('./post_like.route')(app);
    require('./customer_follow.route')(app);
    require('./conversation.route')(app);
    require('./conversation_detail.route')(app);
    require('./story.route')(app);
    require('./customer_profile.route')(app);
    
}

module.exports = initAdminRouters;

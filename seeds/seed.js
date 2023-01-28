const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const userInfo = require('./userInfo.json');
const blogData = require('./blogData.json');
const commentData = require('./comment.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userInfo, {
        individualHooks: true,
        returning: true,
    });

    for (const blog of blogData) {
        await Blog.create({
            ... blog,
            user_id: users[Math.floor(Math.random() * users.length)].id,
        });
    }

    await Comment.bulkCreate(commentData);

    console.log('----- Database is seeded! -----');

    process.exit(0);
}

seedDatabase();
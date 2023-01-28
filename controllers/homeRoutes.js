const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withLogin = require('../utils/auth');

router.get('/', async (req,res) => {
    try {
        const blogData = await Blog.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in,
        });
    }catch(err) {
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
      const blogData = await Blog.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: { include: ['username'] },
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: { include: ['username'] },
              },
            ],
          },
        ],
      });
  
      const blogs = blogData.get({ plain: true });
      blogs.comments.forEach((comment) => {
        console.log(comment);
      });
      res.render('blog', {
        ...blogs,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/profile', withLogin, async (req,res) => {
    try {
        const userInfo = await User.findByPk(req.session.user_id, {
            attributes: {exclude: ['password']},
            include: [{ model : Blog }],
        });

        const user = userInfo.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
  });
  
  router.get('/login', (req,res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
  });

  module.exports = router; 
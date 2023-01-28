const router = require('express').Router();
const {Comment} = require ('../../models');
const withLogin = require('../../utils/auth');

router.delete('/:id', withLogin, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment found'});
            return;
        }

        res.status(200).json(commentData);
        }catch (err) {
            res.status(500).json(err);
        }
});

module.exports = router;
module.exports = {
    index: (req, res) => {
        if (req.session.msg) {
            let msg = req.session.msg;
            req.session.msg = undefined;
            res.render('home/index', msg);
        } else {
            res.render('home/index');
        }
    }
};
const userValidator = (req, res) => {
    res.json(req.user); 
};

module.exports = userValidator ;

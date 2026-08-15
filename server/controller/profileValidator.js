export const userValidator = (req, res) => {
  res.json(req.user);
};

export default userValidator;

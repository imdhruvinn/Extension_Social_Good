const validateCookies = (req, res, next) => {
  const cookiesAccepted = req.cookies.accepted;
  if (!cookiesAccepted) {
    return res.status(400).json({ message: "Cookies not accepted" });
  }
  next();
};

module.exports = validateCookies;

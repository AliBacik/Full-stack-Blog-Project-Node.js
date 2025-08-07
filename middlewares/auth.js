module.exports = (req,res,next)=>{
    if (!req.session.isAuth) {
    return res.status(401).json({ message: "Yetkisiz" });
  }
  next();
}
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // check for file time or mime time
    const allowedFiletype = ["image/jpg", "image/png", "image/jpeg"];
    if (!allowedFiletype.includes(file.mimetype)) {
      cb(new Error("this type of ile is npt allowed"));
      return;
    }
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  multer,
  storage,
};

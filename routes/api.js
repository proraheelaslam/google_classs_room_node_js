const express = require('express');
const router = express.Router();
const multer  = require('multer');
const auth = require('../middleware/auth');
const classRoom = require('../controllers/classRoom');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
            cb(null, 'public/upload/categories');

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +file.originalname);
    }
});

const upload = multer({ storage:storage });


/* API Routes */

router.post('/auth/courses', upload.none(), async (req, res, next)=> {
         classRoom.authGoogleClassRoom(req, res);

});

router.post('/auth/courses/add', upload.none(), async (req, res, next)=> {
    classRoom.addCourse(req, res);

});




module.exports = router;

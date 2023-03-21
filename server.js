const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let filename = file.originalname;
        console.log(filename);
        let arr = filename.split('.');
        let newFileName = arr[0] + '_' + Date.now()+'.'+ arr[1];
        cb(null, newFileName)
    }
})

var upload = multer({ storage: storage})

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    const size = parseInt(req.headers["content-length"]); 
    if(size > 1*1024*1024){
        const error = new Error('kich thuoc file qua lon')
        error.httpStatusCode = 400
        return next(error)
    }
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})
var storageImge = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.mimetype === "image/jpeg"){
            cb(null, 'uploads')
        }
        else{
            cb(new Error('chi dc chon file.jpeg'), null)
        }
    },
    filename: function (req, file, cb) {
        let filename = file.originalname;
        console.log(filename);
        let arr = filename.split('.');
        let newFileName = arr[0] + '_' + Date.now()+'.'+ arr[1];
        cb(null, newFileName)
    }
})



var uploadImage = multer({ storage: storageImge })
app.post('/uploadphoto', uploadImage.single('myImage'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

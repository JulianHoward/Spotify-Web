const path = require('path');
const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;

//body parser para leer los datos del formulario
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//console.log("Ruta absoluta del directorio estático:", path.resolve('./pu4/songs'));

app.use(express.static('public'));
app.use(express.static('pu2'));
app.use(express.static('pu3'));
app.use('/pu4/songs', express.static(path.join(__dirname, 'pu4', 'songs')));



app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({message: "Invalid data" })
    }

    next();
});

//base de datos
const db = require("./models");
db.sequelize.sync(/*{ force: true }*/).then(() => {
    console.log("db resync");
});

require("./routes")(app);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/generos');
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id + '.png');
    }
});

const st = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './pu2/images/artistas');
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id + '.png');
    }
});

const storageAlbum = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './pu3/images/albumes');
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id + '.png');
    }
});

const storageSong = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './pu4/songs');
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id + '.mp3');
    }
});


const upload = multer({ storage: storage }).single('imagenUrl');
const up = multer({ storage: st }).single('imagenUrl');
const uploadAlbums = multer({ storage: storageAlbum }).single('imagenUrl');
const uploadSong = multer({ storage: storageSong }).single('link');

module.exports = { upload, up, uploadAlbums, uploadSong };


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

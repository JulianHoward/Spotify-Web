
const multer = require("multer");
const db = require("../models");
const { sendError500, checkRequiredFields } = require("../utils/request.utils");


exports.listArtistas = async (req, res) => {
    try{
        const artistas = await db.artistas.findAll();
        res.send(artistas);
    } catch (error) {
        sendError500(res);
    }
}

exports.getArtista = async (req, res) => {
    const id = req.params.id;
    try {
        const artista = await db.artistas.findByPk(id);
        if(!artista) {
            res.status(404).send({ message: "Artista no encontrado" });
            return;
        }
        res.send(artista);
    } catch (error) {
        sendError500(res);
    }
}

exports.createArtista = async (req, res) => {
    const requiredFields = ["nombre"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    try {
        const artista = await db.artistas.create(req.body);
        res.send(artista);
    } catch (error) {
        sendError500(res);
    }
}


exports.updateArtista = async (req, res) => {
    const id = req.params.id;
    try {
        const artista = await db.artistas.findByPk(id);
        if (!artista) {
            res.status(404).send({ message: "Artista no encontrado" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["nombre"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message:
                        `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
                });
                return;
            }
        }
        await db.artistas.update(req.body, {
            where: {
                id: id
            }
        
        });
        res.send(artista);
    } catch (error) {
        sendError500(res);
    }
}

exports.deleteArtista = async (req, res) => {
    const id = req.params.id;
    try {
        const artista = await db.artistas.findByPk(id);
        if (!artista) {
            res.status(404).send({ message: "Artista no encontrado" });
            return;
        }
        await db.artistas.destroy({
            where: {
                id: id
            }
        });
        res.send({ message: "Artista eliminado" });
    } catch (error) {
        sendError500(res);
    }
}

exports.uploadPictureArtist = async (req, res) => {
    const id = req.params.id;
    try {
        console.log("ID del artista:", id); // Verifica el ID del artista
        const artista = await db.artistas.findByPk(id);
        if (!artista) {
            res.status(404).send({ message: "Artista no encontrado" });
            return;
        }
        console.log("Artista encontrado:", artista); // Verifica el objeto del artista encontrado

        const st = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./pu2/images/artistas");
            },
            filename: function (req, file, cb) {
                cb(null, req.params.id + ".png");
            },
        });

        const up = multer({ storage: st }).single("imagenUrl");
        up(req, res, async function (err) {
            if (err) {
                console.error("Error al subir la imagen:", err); // Imprime el error si ocurre
                res.status(500).send({ message: "Error al subir la imagen" });
                return;
            }
            console.log("Imagen subida:", req.file); // Verifica la información de la imagen subida
            await db.artistas.update(
                { imagenUrl: req.file.path },
                { where: { id: id } }
            );
            res.send({ message: "Imagen subida" });
        });
    } catch (error) {
        console.error("Error:", error); // Imprime cualquier error que ocurra
        sendError500(res);
    }
};


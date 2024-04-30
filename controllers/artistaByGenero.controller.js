
const db = require("../models");
const { sendError500, checkRequiredFields } = require("../utils/request.utils");

exports.listArtistasByGenero = async (req, res) => {
    try {
        const artistasByGenero = await db.artistasByGeneros.findAll({
            include: ["genero","artista"]
        });
        res.send(artistasByGenero);
    } catch (error) {
        sendError500(res);
        console.error(error);
    }
}


exports.getArtistasByGenero = async (req, res) => {
    const generoId = req.query.genero_id;
    console.log(generoId);
    try {
        const artistasPorGenero = await db.artistasByGeneros.findAll({
            where: {
                genero_id: generoId
            },
            attributes: ['artist_id']
        });
        console.log(artistasPorGenero);
        res.send(artistasPorGenero);
    } catch (error) {
        sendError500(res);
    }
}




exports.createArtistaByGenero = async (req, res) => {
    const requiredFields = ["genero_id", "artist_id"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    try {
        // Comprueba si el artista y el género existen antes de crear la relación
        const generoExists = await db.generos.findByPk(req.body.genero_id);
        const artistExists = await db.artistas.findByPk(req.body.artist_id);
        if (!artistExists || !generoExists) {
            res.status(400).send({
                message: `El artista con ID ${req.body.artista_id} o el género con ID ${req.body.genero_id} no existen.`
            });
            return;
        }

        const artistaByGenero = await db.artistasByGeneros.create(req.body);
        res.send(artistaByGenero);
    } catch (error) {
        sendError500(res);
    }
}

exports.updateArtistaByGenero = async (req, res) => {
    const id = req.params.id;
    try {
        const artistasByGenero = await db.artistasByGeneros.findByPk(id);
        if (!artistasByGenero) {
            res.status(404).send({ message: "Género o Artista no encontrado" });
            return;
        }
        if(req.method === "PUT"){
            const requiredFields = ["genero_id", "artist_id"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message:
                        `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
                });
                return;
            }
            const generoExists = await db.generos.findByPk(req.body.genero_id);
            const artistExists = await db.artistas.findByPk(req.body.artist_id);
            if(!artistExists || !generoExists){
                res.status(400).send({
                    message: `El artista con ID ${req.body.artist_id} o el género con ID ${req.body.genero_id} no existen.`
                });
                return;
            }
        }
        await db.artistasByGeneros.update(req.body, {
            where: {
                id: id
            }
        });
        res.send(artistasByGenero)
    } catch (error){
        sendError500(res);
    }
}

exports.deleteArtistaByGenero = async (req, res) => {
    const id = req.params.id;
    try {
        const artistasByGenero = await db.artistasByGeneros.findByPk(id);
        if (!artistasByGenero) {
            res.status(404).send({ message: "Género o Artista no encontrado" });
            return;
        }
        await db.artistasByGeneros.destroy({
            where: {
                id: id
            }
        });
        res.send({ message: "Artista y género eliminados" });
    } catch (error) {
        sendError500(res);
    }
}

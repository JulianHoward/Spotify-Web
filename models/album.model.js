
module.exports = (sequelize, Sequelize) => {
    const Album = sequelize.define("album", {
        nombre: {
            type: Sequelize.STRING
        },
        artista_id: {
            type: Sequelize.INTEGER
        },
        imagenUrl: {
            type: Sequelize.VIRTUAL,
            get: function () {
                return `http://localhost:3000/images/albums/${this.id}.png`
            }
        }
    });
    return Album;
}

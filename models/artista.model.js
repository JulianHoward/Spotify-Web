
module.exports = (sequelize, Sequelize) => {
    const Artista = sequelize.define("artista", {
        nombre: {
            type: Sequelize.STRING
        },
        imagenUrl: {
            type: Sequelize.VIRTUAL,
            get: function () {
                return `http://localhost:3000/images/artistas/${this.id}.png`
            }
        }
    });
    return Artista;
}

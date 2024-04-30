
module.exports = (sequelize, Sequelize) => {
    const Genero = sequelize.define("genero", {
        nombre: {
            type: Sequelize.STRING
        },
        imagenUrl: {
            type: Sequelize.VIRTUAL,
            get: function () {
                return `http://localhost:3000/images/generos/${this.id}.png`
            }
        }
    });
    return Genero;
}
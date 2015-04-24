"use strict";
module.exports = function(sequelize, DataTypes) {
  var FaoriteMovie = sequelize.define("FaoriteMovie", {
    imdbId: DataTypes.STRING,
    UserId: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.User);
      }
    }
  });
  return FaoriteMovie;
};
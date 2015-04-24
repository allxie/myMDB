"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("FaoriteMovies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      imdbId: {
        type: DataTypes.STRING
      },
      UserId: {
        type: DataTypes.STRING
      },
      rating: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("FaoriteMovies").done(done);
  }
};
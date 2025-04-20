import Sequelize from 'sequelize';

class Song extends Sequelize.Model {
  static initModel(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(100), 
        allowNull: false, 
        unique: true, 
      },
      coverUrl: {
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      audioUrl: {
        type: Sequelize.STRING, 
        allowNull: false, 
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false, 
      },
    }, {
      sequelize,
      modelName: 'Song',
      tableName: 'songs',
      timestamps: true,
      collate: 'utf8_general_ci',
      charset: 'utf8',
      underscored: false,
    });
  }

  static associate(db) {
    this.belongsTo(db.User, { foreignKey: 'UploaderId' });
    this.belongsToMany(db.User, { through: 'likes', foreignKey: 'SongId', as: 'Likers', });
    this.belongsToMany(db.User, { through: 'RecentPlays', foreignKey: 'SongId', as: 'RecentListeners' });
  }
}

export default Song;

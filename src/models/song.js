import Sequelize from 'sequelize';

class Song extends Sequelize.Model {
  static initModel(sequelize) {
    return super.init(
      {
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
      },
      {
        sequelize,
        modelName: 'Song',
        tableName: 'songs',
        timestamps: true,
        collate: 'utf8_general_ci',
        charset: 'utf8',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.User, {
      foreignKey: 'UploaderId',
    });

    this.belongsToMany(db.User, {
      through: db.RecentPlay,
      foreignKey: 'SongId',
      otherKey: 'UserId',
      as: 'RecentListeners',
    });

    this.belongsToMany(db.User, {
      through: 'likes',
      foreignKey: 'SongId',
      as: 'Likers',
    });
  }
}

export default Song;

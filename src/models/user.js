import Sequelize from 'sequelize';

class User extends Sequelize.Model {
  static initModel(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      username: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      profileImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      signupToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signupTokenExpiration: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      underscored: false,
    });
  }

  static associate(db) {
    this.hasMany(db.Song);
    this.belongsToMany(db.Song, { through: 'likes', foreignKey: 'UserId', as: 'LikedSongs' });
    this.belongsToMany(db.Song, { through: 'RecentPlays', foreignKey: 'UserId', as: 'RecentlyPlayedSongs' });
  }
}

export default User;
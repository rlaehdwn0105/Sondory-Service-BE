import Sequelize from 'sequelize';

class RecentPlays extends Sequelize.Model {
  static initModel(sequelize) {
    return super.init(
      {
        playedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        modelName: 'RecentPlay',
        tableName: 'recentPlays',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.User);
    this.belongsTo(db.Song);
    }
}

export default RecentPlays;
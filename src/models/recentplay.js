import Sequelize from 'sequelize';

class RecentPlay extends Sequelize.Model {
	  static initModel(sequelize) {
		      return super.init(
			            {
					            playedAt: {
							              type: Sequelize.DATE,
							              allowNull: false,
							              defaultValue: Sequelize.NOW,
							            },
					            UserId: {
							              type: Sequelize.INTEGER,
							              allowNull: false,
							            },
					            SongId: {
							              type: Sequelize.INTEGER,
							              allowNull: false,
							            },
					          },
			            {
					            sequelize,
					            modelName: 'RecentPlay',
					            tableName: 'recent_plays',
					            charset: 'utf8',
					            collate: 'utf8_general_ci',
					            timestamps: true,
					          }
			          );
		    }

	  static associate(db) {
		      this.belongsTo(db.User, {
			            foreignKey: 'UserId',
			            onDelete: 'CASCADE',
			          });

		      this.belongsTo(db.Song, {
			            foreignKey: 'SongId',
			            onDelete: 'CASCADE',
			          });
		    }
}

export default RecentPlay;


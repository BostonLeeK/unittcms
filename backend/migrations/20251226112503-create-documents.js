export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        folderId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'documentFolders',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable('documents');
}


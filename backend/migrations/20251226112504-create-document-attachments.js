export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('documentAttachments', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        documentId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'documents',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        attachmentId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'attachments',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    });

    await queryInterface.addIndex('documentAttachments', ['documentId', 'attachmentId'], {
        unique: true,
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable('documentAttachments');
}


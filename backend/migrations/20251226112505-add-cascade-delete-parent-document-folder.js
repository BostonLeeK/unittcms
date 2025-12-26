export async function up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('documentFolders', {
        fields: ['parentFolderId'],
        type: 'foreign key',
        name: 'documentFolders_parentFolderId_fkey',
        references: {
            table: 'documentFolders',
            field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
}

export async function down(queryInterface) {
    await queryInterface.removeConstraint('documentFolders', 'documentFolders_parentFolderId_fkey');
}


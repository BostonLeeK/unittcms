'use client';
import { useState, useEffect, useContext } from 'react';
import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import { Tree } from 'react-arborist';
import DocumentFolderDialog from './DocumentFolderDialog';
import DocumentFolderItem from './DocumentFolderItem';
import { fetchDocumentFolders, createDocumentFolder, updateDocumentFolder, deleteDocumentFolder } from './documentFoldersControl';
import { usePathname, useRouter } from '@/src/i18n/routing';
import { TokenContext } from '@/utils/TokenProvider';
import useGetCurrentIds from '@/utils/useGetCurrentIds';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { DocumentFolderType, DocumentFolderMessages, DocumentTreeNodeData } from '@/types/document';
import { logError } from '@/utils/errorHandler';
import { buildDocumentFolderTree } from '@/utils/buildDocumentFolderTree';

type Props = {
  projectId: string;
  messages: DocumentFolderMessages;
  locale: string;
};

export default function DocumentFoldersPane({ projectId, messages, locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const context = useContext(TokenContext);
  const [treeData, setTreeData] = useState<DocumentTreeNodeData[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolderType | null>(null);
  const { folderId } = useGetCurrentIds();
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<DocumentFolderType | null>(null);
  const [parentFolderId, setParentFolderId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDataEffect() {
      if (!context.isSignedIn()) {
        return;
      }
      try {
        const fetchedFolders: DocumentFolderType[] = await fetchDocumentFolders(context.token.access_token, Number(projectId));
        const tree = buildDocumentFolderTree(fetchedFolders);
        setTreeData(tree);

        if (tree.length === 0) {
          return;
        }

        const selectedFolderFromUrl = fetchedFolders.find((folder) => folder.id === folderId);
        setSelectedFolder(selectedFolderFromUrl ? selectedFolderFromUrl : null);
      } catch (error: unknown) {
        logError('Error fetching document folders:', error);
      }
    }

    fetchDataEffect();
  }, [context, folderId, locale, pathname, projectId, router]);

  const openDialogForCreate = (folderId: number | null = null) => {
    setParentFolderId(folderId);
    setIsFolderDialogOpen(true);
    setEditingFolder(null);
  };

  const closeDialog = () => {
    setIsFolderDialogOpen(false);
    setEditingFolder(null);
    setParentFolderId(null);
  };

  const onSubmit = async (name: string, detail: string) => {
    if (editingFolder) {
      await updateDocumentFolder(context.token.access_token, editingFolder.id, name, detail, projectId, parentFolderId);
    } else {
      await createDocumentFolder(context.token.access_token, name, detail, projectId, parentFolderId);
    }
    const fetchedFolders: DocumentFolderType[] = await fetchDocumentFolders(context.token.access_token, Number(projectId));
    const tree = buildDocumentFolderTree(fetchedFolders);
    setTreeData(tree);
    closeDialog();
  };

  const onEditClick = (folder: DocumentFolderType) => {
    setEditingFolder(folder);
    setParentFolderId(folder.parentFolderId);
    setIsFolderDialogOpen(true);
  };

  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<number | null>(null);

  const closeDeleteConfirmDialog = () => {
    setIsDeleteConfirmDialogOpen(false);
    setDeleteFolderId(null);
  };

  const onDeleteClick = (deleteFolderId: number) => {
    setDeleteFolderId(deleteFolderId);
    setIsDeleteConfirmDialogOpen(true);
  };

  const onConfirm = async () => {
    if (deleteFolderId) {
      await deleteDocumentFolder(context.token.access_token, deleteFolderId);
      const fetchedFolders: DocumentFolderType[] = await fetchDocumentFolders(context.token.access_token, Number(projectId));
      const tree = buildDocumentFolderTree(fetchedFolders);
      setTreeData(tree);
      router.push(`/projects/${projectId}/documentFolders`, { locale });
      closeDeleteConfirmDialog();
    }
  };

  return (
    <>
      <div className="w-80 min-h-[calc(100vh-64px)] border-r-1 dark:border-neutral-700">
        <Button
          startContent={<Plus size={16} />}
          size="sm"
          variant="bordered"
          className="m-2"
          isDisabled={!context.isProjectDeveloper(Number(projectId))}
          onPress={() => openDialogForCreate()}
        >
          {messages.newFolder}
        </Button>

        {treeData.length > 0 && (
          <Tree
            data={treeData}
            className="w-full"
            indent={16}
            rowHeight={42}
            overscanCount={5}
            paddingTop={20}
            paddingBottom={20}
            padding={20}
            width="100%"
            openByDefault={false}
            disableDrop={true}
            disableDrag={true}
          >
            {(props) => (
              <DocumentFolderItem
                {...props}
                projectId={projectId}
                selectedFolder={selectedFolder}
                locale={locale}
                messages={messages}
                openDialogForCreate={openDialogForCreate}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
              />
            )}
          </Tree>
        )}
      </div>

      <DocumentFolderDialog
        isOpen={isFolderDialogOpen}
        editingFolder={editingFolder}
        onCancel={closeDialog}
        onSubmit={onSubmit}
        messages={messages}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmDialogOpen}
        onCancel={closeDeleteConfirmDialog}
        onConfirm={onConfirm}
        closeText={messages.close}
        confirmText={messages.areYouSure}
        deleteText={messages.delete}
      />
    </>
  );
}


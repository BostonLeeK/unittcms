'use client';
import { useState, useEffect, useContext, useCallback } from 'react';
import { addToast } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/src/i18n/routing';
import DocumentTable from './DocumentTable';
import DocumentDialog from './DocumentDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { TokenContext } from '@/utils/TokenProvider';
import { fetchDocuments, createDocument, deleteDocument } from '@/utils/documentsControl';
import { DocumentType, DocumentMessages } from '@/types/document';
import { LocaleCodeType } from '@/types/locale';
import { logError } from '@/utils/errorHandler';

type Props = {
  projectId: string;
  folderId: string;
  messages: DocumentMessages;
  locale: LocaleCodeType;
};

export default function DocumentsPane({ projectId, folderId, messages, locale }: Props) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
  const [deleteDocumentId, setDeleteDocumentId] = useState<number | null>(null);

  const context = useContext(TokenContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const refreshDocuments = useCallback(async () => {
    if (!context.isSignedIn()) return;

    const searchParam = searchParams.get('search') || '';

    setSearchFilter(searchParam);

    try {
      const data = await fetchDocuments(context.token.access_token, Number(folderId), searchParam || undefined);
      setDocuments(data);
    } catch (error: unknown) {
      logError('Error fetching documents:', error);
    }
  }, [context, folderId, searchParams]);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const closeDialog = () => setIsDocumentDialogOpen(false);

  const onSubmit = async (title: string) => {
    try {
      const newDocument = await createDocument(context.token.access_token, folderId, title, '');
      setDocuments([...documents, newDocument]);
      closeDialog();
      router.push(`/projects/${projectId}/documentFolders/${folderId}/documents/${newDocument.id}`, { locale });
    } catch (error: unknown) {
      logError('Error creating document:', error);
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Failed to create document',
      });
    }
  };

  const closeDeleteConfirmDialog = () => {
    setIsDeleteConfirmDialogOpen(false);
    setDeleteDocumentId(null);
  };

  const onDeleteDocument = (deleteDocumentId: number) => {
    setDeleteDocumentId(deleteDocumentId);
    setIsDeleteConfirmDialogOpen(true);
  };

  const onConfirm = async () => {
    if (deleteDocumentId) {
      try {
        await deleteDocument(context.token.access_token, deleteDocumentId);
        setDocuments(documents.filter((entry) => entry.id !== deleteDocumentId));
        closeDeleteConfirmDialog();
      } catch (error: unknown) {
        logError('Error deleting document:', error);
        addToast({
          title: 'Error',
          color: 'danger',
          description: 'Failed to delete document',
        });
      }
    }
  };

  return (
    <>
      <DocumentTable
        projectId={projectId}
        folderId={folderId}
        isDisabled={!context.isProjectDeveloper(Number(projectId))}
        documents={documents}
        onCreateDocument={() => setIsDocumentDialogOpen(true)}
        onDeleteDocument={onDeleteDocument}
        activeSearchFilter={searchFilter}
        messages={messages}
        locale={locale}
        showBackButton={true}
      />

      <DocumentDialog isOpen={isDocumentDialogOpen} onCancel={closeDialog} onSubmit={onSubmit} messages={messages} />

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


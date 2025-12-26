'use client';
import { useState, useEffect, useContext, useCallback } from 'react';
import { addToast } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import DocumentTable from './[folderId]/documents/DocumentTable';
import DocumentDialog from './[folderId]/documents/DocumentDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { TokenContext } from '@/utils/TokenProvider';
import { fetchDocumentsByProjectId, deleteDocument } from '@/utils/documentsControl';
import { DocumentType, DocumentMessages } from '@/types/document';
import { LocaleCodeType } from '@/types/locale';
import { logError } from '@/utils/errorHandler';

type Props = {
  projectId: string;
  messages: DocumentMessages;
  locale: LocaleCodeType;
};

export default function DocumentsRootPane({ projectId, messages, locale }: Props) {
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
      const data = await fetchDocumentsByProjectId(context.token.access_token, Number(projectId), searchParam || undefined);
      setDocuments(data);
    } catch (error: unknown) {
      logError('Error fetching documents:', error);
    }
  }, [context, projectId, searchParams]);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const closeDialog = () => setIsDocumentDialogOpen(false);

  const onSubmit = async (title: string) => {
    addToast({
      title: messages.document,
      color: 'warning',
      description: 'Please select a folder from the left sidebar to create a document',
    });
    closeDialog();
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
        folderId="0"
        isDisabled={true}
        documents={documents}
        onCreateDocument={() => {}}
        onDeleteDocument={onDeleteDocument}
        activeSearchFilter={searchFilter}
        messages={messages}
        locale={locale}
        showCreateButton={false}
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


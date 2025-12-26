import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import DocumentEditor from './DocumentEditor';
import { LocaleCodeType } from '@/types/locale';
import { DocumentMessages } from '@/types/document';

export async function generateMetadata({ params: { locale } }: { params: { locale: LocaleCodeType } }) {
  const t = await getTranslations({ locale, namespace: 'Documents' });
  return {
    title: `${t('document')} | UnitTCMS`,
    robots: { index: false, follow: false },
  };
}

export default function Page({
  params,
}: {
  params: {
    projectId: string;
    folderId: string;
    documentId: string;
    locale: string;
  };
}) {
  const t = useTranslations('Documents');
  const messages: DocumentMessages = {
    documents: t('documents'),
    document: t('document'),
    newDocument: t('new_document'),
    editDocument: t('edit_document'),
    deleteDocument: t('delete_document'),
    documentTitle: t('document_title'),
    documentContent: t('document_content'),
    close: t('close'),
    create: t('create'),
    update: t('update'),
    pleaseEnter: t('please_enter'),
    delete: t('delete'),
    areYouSure: t('are_you_sure'),
    areYouSureLeave: t('are_you_sure_leave'),
    save: t('save'),
    cancel: t('cancel'),
    attachments: t('attachments'),
    clickToUpload: t('click_to_upload'),
    orDragAndDrop: t('or_drag_and_drop'),
    maxFileSize: t('max_file_size'),
    noDocumentsFound: t('no_documents_found'),
    search: t('search'),
    actions: t('actions'),
    backToDocuments: t('back_to_documents'),
    updating: t('updating'),
    updatedDocument: t('updated_document'),
  };

  return (
    <>
      <DocumentEditor
        projectId={params.projectId}
        folderId={params.folderId}
        documentId={params.documentId}
        messages={messages}
        locale={params.locale}
      />
    </>
  );
}


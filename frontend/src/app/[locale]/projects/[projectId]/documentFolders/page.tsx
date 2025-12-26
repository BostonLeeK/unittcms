import { useTranslations } from 'next-intl';
import DocumentsRootPane from './DocumentsRootPane';
import { DocumentMessages } from '@/types/document';
import { LocaleCodeType } from '@/types/locale';

export default function Page({ params }: { params: { projectId: string; locale: string } }) {
  const tDocuments = useTranslations('Documents');

  const documentMessages: DocumentMessages = {
    documents: tDocuments('documents'),
    document: tDocuments('document'),
    newDocument: tDocuments('new_document'),
    editDocument: tDocuments('edit_document'),
    deleteDocument: tDocuments('delete_document'),
    documentTitle: tDocuments('document_title'),
    documentContent: tDocuments('document_content'),
    close: tDocuments('close'),
    create: tDocuments('create'),
    update: tDocuments('update'),
    pleaseEnter: tDocuments('please_enter'),
    delete: tDocuments('delete'),
    areYouSure: tDocuments('are_you_sure'),
    areYouSureLeave: tDocuments('are_you_sure_leave'),
    save: tDocuments('save'),
    cancel: tDocuments('cancel'),
    attachments: tDocuments('attachments'),
    clickToUpload: tDocuments('click_to_upload'),
    orDragAndDrop: tDocuments('or_drag_and_drop'),
    maxFileSize: tDocuments('max_file_size'),
    noDocumentsFound: tDocuments('no_documents_found'),
    search: tDocuments('search'),
    actions: tDocuments('actions'),
    backToDocuments: tDocuments('back_to_documents'),
    updating: tDocuments('updating'),
    updatedDocument: tDocuments('updated_document'),
  };

  return (
    <DocumentsRootPane projectId={params.projectId} messages={documentMessages} locale={params.locale as LocaleCodeType} />
  );
}


import { useTranslations } from 'next-intl';
import DocumentFoldersPane from './DocumentFoldersPane';
import { DocumentFolderMessages } from '@/types/document';

export default function DocumentFoldersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string; locale: string };
}) {
  const t = useTranslations('DocumentFolders');
  const messages: DocumentFolderMessages = {
    folder: t('folder'),
    newFolder: t('new_folder'),
    editFolder: t('edit_folder'),
    deleteFolder: t('delete_folder'),
    folderName: t('folder_name'),
    folderDetail: t('folder_detail'),
    close: t('close'),
    create: t('create'),
    update: t('update'),
    pleaseEnter: t('please_enter'),
    delete: t('delete'),
    areYouSure: t('are_you_sure'),
    noFoldersFound: t('no_folders_found'),
  };

  return (
    <div className="flex w-full">
      <DocumentFoldersPane projectId={params.projectId} messages={messages} locale={params.locale} />
      <div className="flex-grow w-full">{children}</div>
    </div>
  );
}


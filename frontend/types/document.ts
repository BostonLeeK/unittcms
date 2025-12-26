import { AttachmentType } from './case';

export type { AttachmentType };

export type DocumentType = {
  id: number;
  title: string;
  content: string;
  folderId: number;
  createdAt: string;
  updatedAt: string;
  Attachments?: AttachmentType[];
  DocumentFolder?: {
    id: number;
    name: string;
  };
};

export type DocumentFolderType = {
  id: number;
  name: string;
  detail: string;
  projectId: number;
  parentFolderId: number | null;
  createdAt: string;
  updatedAt: string;
  Documents: DocumentType[];
};

export type DocumentMessages = {
  documents: string;
  document: string;
  newDocument: string;
  editDocument: string;
  deleteDocument: string;
  documentTitle: string;
  documentContent: string;
  close: string;
  create: string;
  update: string;
  pleaseEnter: string;
  delete: string;
  areYouSure: string;
  areYouSureLeave: string;
  save: string;
  cancel: string;
  attachments: string;
  clickToUpload: string;
  orDragAndDrop: string;
  maxFileSize: string;
  noDocumentsFound: string;
  search: string;
  actions: string;
  backToDocuments: string;
  updating: string;
  updatedDocument: string;
};

export type DocumentFolderMessages = {
  folder: string;
  newFolder: string;
  editFolder: string;
  deleteFolder: string;
  folderName: string;
  folderDetail: string;
  close: string;
  create: string;
  update: string;
  pleaseEnter: string;
  delete: string;
  areYouSure: string;
  noFoldersFound: string;
};

export type DocumentTreeNodeData = {
  id: string;
  name: string;
  detail: string;
  parentFolderId: number | null;
  projectId: number;
  folderData: DocumentFolderType;
  children?: DocumentTreeNodeData[];
};


'use client';
import { useState, useEffect, useContext, ChangeEvent, DragEvent, useRef } from 'react';
import { Input, Button, Divider, addToast } from '@heroui/react';
import { Save, ArrowLeft, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import DocumentAttachmentsEditor from './DocumentAttachmentsEditor';
import { fetchCreateAttachments, fetchDownloadAttachment, fetchDeleteAttachment } from './documentAttachmentControl';
import { fetchDocument, updateDocument } from '@/utils/documentsControl';
import { useRouter } from '@/src/i18n/routing';
import { TokenContext } from '@/utils/TokenProvider';
import { useFormGuard } from '@/utils/formGuard';
import { DocumentType, AttachmentType, DocumentMessages } from '@/types/document';
import { logError } from '@/utils/errorHandler';

const defaultDocument = {
  id: 0,
  title: '',
  content: '',
  folderId: 0,
  createdAt: '',
  updatedAt: '',
  Attachments: [],
};

type Props = {
  projectId: string;
  folderId: string;
  documentId: string;
  messages: DocumentMessages;
  locale: string;
};

export default function DocumentEditor({ projectId, folderId, documentId, messages, locale }: Props) {
  const tokenContext = useContext(TokenContext);
  const [document, setDocument] = useState<DocumentType>(defaultDocument);
  const [isTitleInvalid] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  useFormGuard(isDirty, messages.areYouSureLeave);

  useEffect(() => {
    async function fetchDataEffect() {
      if (!tokenContext.isSignedIn()) {
        return;
      }
      try {
        const fetchedDocument: DocumentType = await fetchDocument(tokenContext.token.access_token, Number(documentId));
        setDocument(fetchedDocument);
        if (contentEditableRef.current) {
          contentEditableRef.current.innerHTML = fetchedDocument.content || '';
        }
      } catch (error: unknown) {
        logError('Error fetching document:', error);
      }
    }

    fetchDataEffect();
  }, [tokenContext, documentId]);

  const handleSave = async () => {
    if (!document.title) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: messages.pleaseEnter,
      });
      return;
    }

    setIsUpdating(true);
    try {
      const content = contentEditableRef.current?.innerHTML || '';
      await updateDocument(tokenContext.token.access_token, Number(documentId), document.title, content);
      setIsDirty(false);
      addToast({
        title: 'Success',
        color: 'success',
        description: messages.updatedDocument,
      });
    } catch (error: unknown) {
      logError('Error updating document:', error);
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Failed to update document',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContentChange = () => {
    setIsDirty(true);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
    setIsDirty(true);
  };

  const handleDrop = async (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    try {
      const newAttachments = await fetchCreateAttachments(Number(documentId), files, tokenContext.token.access_token);
      if (newAttachments && document.Attachments) {
        setDocument({
          ...document,
          Attachments: [...document.Attachments, ...newAttachments],
        });
      } else if (newAttachments) {
        setDocument({
          ...document,
          Attachments: newAttachments,
        });
      }
    } catch (error: unknown) {
      logError('Error uploading files:', error);
    }
  };

  const onAttachmentDelete = async (attachmentId: number) => {
    try {
      await fetchDeleteAttachment(attachmentId, tokenContext.token.access_token);
      if (document.Attachments) {
        setDocument({
          ...document,
          Attachments: document.Attachments.filter((att) => att.id !== attachmentId),
        });
      }
    } catch (error: unknown) {
      logError('Error deleting attachment:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-5xl pt-6 px-6 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <Button
            startContent={<ArrowLeft size={16} />}
            size="sm"
            variant="light"
            onPress={() => router.push(`/projects/${projectId}/documentFolders/${folderId}/documents`, { locale })}
          >
            {messages.backToDocuments}
          </Button>
          <Button
            startContent={<Save size={16} />}
            size="sm"
            color="primary"
            isDisabled={!tokenContext.isProjectDeveloper(Number(projectId)) || isUpdating}
            onPress={handleSave}
          >
            {isUpdating ? messages.updating : messages.save}
          </Button>
        </div>

        <Input
          size="lg"
          variant="bordered"
          label={messages.documentTitle}
          value={document.title}
          isInvalid={isTitleInvalid}
          errorMessage={isTitleInvalid ? messages.pleaseEnter : ''}
          onValueChange={(changeValue) => {
            setDocument({ ...document, title: changeValue });
            setIsDirty(true);
          }}
          className="mb-4"
        />

        <Divider className="my-6" />

        <h6 className="font-bold mb-2">{messages.documentContent}</h6>
        <div className="border-1 border-divider rounded-lg p-2 mb-2">
          <div className="flex gap-2 mb-2">
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onPress={() => formatText('bold')}
              title="Bold"
            >
              <Bold size={16} />
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onPress={() => formatText('italic')}
              title="Italic"
            >
              <Italic size={16} />
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onPress={() => formatText('underline')}
              title="Underline"
            >
              <Underline size={16} />
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onPress={() => formatText('insertUnorderedList')}
              title="Bullet List"
            >
              <List size={16} />
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onPress={() => formatText('insertOrderedList')}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </Button>
          </div>
          <div
            ref={contentEditableRef}
            contentEditable
            onInput={handleContentChange}
            className="min-h-[400px] p-4 border-1 border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>

        <Divider className="my-6" />
        <h6 className="font-bold">{messages.attachments}</h6>
        {document.Attachments && (
          <DocumentAttachmentsEditor
            isDisabled={!tokenContext.isProjectDeveloper(Number(projectId))}
            attachments={document.Attachments}
            onAttachmentDownload={(attachmentId: number, downloadFileName: string) =>
              fetchDownloadAttachment(attachmentId, downloadFileName, tokenContext.token.access_token)
            }
            onAttachmentDelete={onAttachmentDelete}
            onFilesDrop={handleDrop}
            onFilesInput={handleInput}
            messages={messages}
          />
        )}
      </div>
    </>
  );
}


import { useState, useMemo, useCallback, ReactNode } from 'react';
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip } from '@heroui/react';
import { Plus, MoreVertical, Trash, ArrowLeft } from 'lucide-react';
import { Link, NextUiLinkClasses, useRouter } from '@/src/i18n/routing';
import { DocumentType, DocumentMessages } from '@/types/document';
import { LocaleCodeType } from '@/types/locale';
import { highlightSearchTerm } from '@/utils/highlightSearchTerm';

type Props = {
  projectId: string;
  folderId: string;
  isDisabled: boolean;
  documents: DocumentType[];
  onCreateDocument: () => void;
  onDeleteDocument: (documentId: number) => void;
  activeSearchFilter: string;
  messages: DocumentMessages;
  locale: LocaleCodeType;
  showCreateButton?: boolean;
  showBackButton?: boolean;
};

export default function DocumentTable({
  projectId,
  folderId,
  isDisabled,
  documents,
  onCreateDocument,
  onDeleteDocument,
  activeSearchFilter,
  messages,
  locale,
  showCreateButton = true,
  showBackButton = false,
}: Props) {
  const router = useRouter();
  const headerColumns = [
    { name: messages.documentTitle, uid: 'title', sortable: true },
    { name: messages.actions, uid: 'actions' },
  ];

  const renderCell = useCallback(
    (document: DocumentType, columnKey: string): ReactNode => {
      const cellValue = document[columnKey as keyof DocumentType];

      switch (columnKey) {
        case 'title':
          return (
            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${projectId}/documentFolders/${document.folderId}/documents/${document.id}`}
                locale={locale}
                className={NextUiLinkClasses}
              >
                {highlightSearchTerm({
                  text: cellValue as string,
                  searchTerm: activeSearchFilter,
                })}
              </Link>
              {document.DocumentFolder && (
                <Chip size="sm" variant="flat" className="text-xs">
                  {document.DocumentFolder.name}
                </Chip>
              )}
            </div>
          );
        case 'actions':
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <MoreVertical size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onPress={() => onDeleteDocument(document.id)}
                  isDisabled={isDisabled}
                >
                  <div className="flex items-center gap-2">
                    <Trash size={16} />
                    <span>{messages.delete}</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    [projectId, locale, activeSearchFilter, messages, onDeleteDocument, isDisabled]
  );

  return (
    <div className="container mx-auto max-w-7xl pt-6 px-6 flex-grow">
      <div className="w-full p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              startContent={<ArrowLeft size={16} />}
              size="sm"
              variant="light"
              onPress={() => router.push(`/projects/${projectId}/documentFolders`, { locale })}
            >
              {messages.backToDocuments}
            </Button>
          )}
          <h3 className="font-bold">{messages.documents}</h3>
        </div>
        {showCreateButton && (
          <Button
            startContent={<Plus size={16} />}
            size="sm"
            color="primary"
            isDisabled={isDisabled}
            onPress={onCreateDocument}
          >
            {messages.newDocument}
          </Button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="w-full p-3 flex items-center justify-center">
          <h3 className="font-bold">{messages.noDocumentsFound}</h3>
        </div>
      ) : (
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr>
                {headerColumns.map((column) => (
                  <th key={column.uid} className="text-left p-3 border-b border-divider">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id} className="hover:bg-default-100">
                  {headerColumns.map((column) => (
                    <td key={column.uid} className="p-3">
                      {renderCell(document, column.uid)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


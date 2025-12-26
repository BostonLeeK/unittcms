'use client';
import { useState } from 'react';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { DocumentMessages } from '@/types/document';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (title: string) => void;
  messages: DocumentMessages;
};

export default function DocumentDialog({ isOpen, onCancel, onSubmit, messages }: Props) {
  const [documentTitle, setDocumentTitle] = useState({
    text: '',
    isValid: false,
    errorMessage: '',
  });

  const clear = () => {
    setDocumentTitle({
      isValid: false,
      text: '',
      errorMessage: '',
    });
  };

  const validate = () => {
    if (!documentTitle.text) {
      setDocumentTitle({
        text: '',
        isValid: true,
        errorMessage: messages.pleaseEnter,
      });
      return;
    }

    onSubmit(documentTitle.text);
    clear();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onCancel();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{messages.newDocument}</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label={messages.documentTitle}
            value={documentTitle.text}
            isInvalid={documentTitle.isValid}
            errorMessage={documentTitle.errorMessage}
            onChange={(e) => {
              setDocumentTitle({
                ...documentTitle,
                text: e.target.value,
              });
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onCancel}>
            {messages.close}
          </Button>
          <Button color="primary" onPress={validate}>
            {messages.create}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


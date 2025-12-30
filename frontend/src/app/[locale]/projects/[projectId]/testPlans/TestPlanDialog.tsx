'use client';
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@heroui/react';
import { TestPlanMessages } from '@/types/testPlan';

type Props = {
    isOpen: boolean;
    onCancel: () => void;
    onSubmit: (name: string, description: string) => void;
    messages: TestPlanMessages;
};

export default function TestPlanDialog({ isOpen, onCancel, onSubmit, messages }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            return;
        }
        onSubmit(name, description);
        setName('');
        setDescription('');
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        onCancel();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalContent>
                <ModalHeader>{messages.newTestPlan}</ModalHeader>
                <ModalBody>
                    <Input
                        label={messages.testPlanName}
                        value={name}
                        onValueChange={setName}
                        placeholder={messages.pleaseEnter}
                        isRequired
                    />
                    <Textarea
                        label={messages.testPlanDescription}
                        value={description}
                        onValueChange={setDescription}
                        placeholder="Enter test plan description (optional)"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={handleClose}>
                        {messages.close}
                    </Button>
                    <Button color="primary" onPress={handleSubmit} isDisabled={!name.trim()}>
                        {messages.create}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}





"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { useState } from "react";

interface TopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (topic: string) => void;
    prompt: string;
}

export function TopicModal({ isOpen, onClose, onSubmit, prompt }: TopicModalProps) {
    const [topic, setTopic] = useState(prompt);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-2xl">
                            What would you like to improve?
                        </ModalHeader>
                        <ModalBody>
                            <Textarea
                                placeholder="e.g. Quantum mechanics, specifically about wave-particle duality"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                minRows={4}
                                size="lg"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button 
                                color="primary" 
                                onPress={() => {
                                    if (topic.trim()) {
                                        onSubmit(topic);
                                        onClose();
                                    }
                                }}
                            >
                                Generate Questions
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
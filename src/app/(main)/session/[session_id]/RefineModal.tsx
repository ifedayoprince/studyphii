"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { useGlobalStore } from "./globalStore";

interface RefineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (topic: string) => void;
}

export function RefineModal({ isOpen, onClose, onSubmit }: RefineModalProps) {
    const {refinePrompt, setRefinePrompt} = useGlobalStore();


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
                                value={refinePrompt}
                                onChange={(e) => setRefinePrompt(e.target.value)}
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
                                    if (refinePrompt.trim()) {
                                        onSubmit(refinePrompt);
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
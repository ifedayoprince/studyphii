"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

interface EndSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function EndSessionModal({ isOpen, onClose, onConfirm }: EndSessionModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            End Session
                        </ModalHeader>
                        <ModalBody>
                            Are you sure you want to end this session? Your progress will be saved.
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button 
                                color="danger" 
                                onPress={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                End Session
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
} 
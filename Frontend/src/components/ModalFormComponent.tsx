import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'

interface ModalFormComponentProps<T> {
  isOpen: boolean;
  onOpenChange: () => void;
  initialData?: T;
  renderFormFields: () => JSX.Element;
  renderButtons: (onClose: () => void) => JSX.Element;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ModalFormComponent = <T, >({ isOpen, onOpenChange, renderFormFields, renderButtons, submit }: ModalFormComponentProps<T>) => {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside' backdrop='blur' className='w-full max-w-lg'>
      <form onSubmit={submit}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h1 className='text-xl font-semibold'> Nueva factura </h1>
              </ModalHeader>
              <ModalBody className='m-1'>
                {renderFormFields()}
              </ModalBody>
              <ModalFooter>
                {renderButtons(onClose)}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </form>
    </Modal>
  )
}

export default ModalFormComponent

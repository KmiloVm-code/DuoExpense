import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/react'

interface ModalErrorProps {
  isOpen: boolean
  handleErrors: (value: boolean) => void
}

const ModalErrorComponent = ({ isOpen, handleErrors }: ModalErrorProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={handleErrors}>
      <ModalContent>
        <ModalHeader>
          <h1 className="text-xl font-semibold">Error</h1>
        </ModalHeader>
        <ModalBody>
          <p>Ha ocurrido un error, por favor intente nuevamente</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="bordered"
            onPress={() => handleErrors(false)}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalErrorComponent

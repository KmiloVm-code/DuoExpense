import { Key, useCallback, useState } from 'react'
import { Button } from '@nextui-org/react'

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from '@nextui-org/table'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'

type TableProps<T extends { concepto: string }> = {
  toggleModal: (item: T) => void
  data: T[]
  dataDelete: (id: number) => void
  columns: { key: keyof T | string; label: string }[]
  formatDate?: (value: string) => string
  formatValue?: (value: number) => string
  getId: (item: T) => number
  renderActions?: (item: T) => JSX.Element
  renderItems?: (item: T, columnKey: Key) => JSX.Element
}

const TableComponent = <T extends { concepto: string }>({
  toggleModal,
  data,
  dataDelete,
  columns,
  formatDate = (value) => value,
  formatValue = (value) => value.toString(),
  getId,
  renderItems,
  renderActions
}: TableProps<T>) => {
  const [, setError] = useState<unknown | null>(null)

  const handleEdit = useCallback(
    (item: T) => () => {
      toggleModal(item)
    },
    [toggleModal]
  )

  const handleDelete = (item: T) => {
    const id = getId(item)
    try {
      dataDelete(id)
    } catch (error) {
      setError(error)
      throw new Error('Error al eliminar el item')
    }
  }

  const dataCell = (item: T, columnKey: Key) => {
    const value = item[columnKey as keyof T]

    switch (columnKey) {
      case 'valor':
        return <span>{formatValue(value as unknown as number)}</span>
      case 'fecha':
        return <span>{formatDate(value as unknown as string)}</span>
      case 'actions':
        return renderActions ? (
          renderActions(item)
        ) : (
          <div className="flex gap-2 justify-center">
            <Button color="secondary" variant="flat" onPress={handleEdit(item)}>
              Editar
            </Button>
            <Button
              color="danger"
              variant="light"
              onPress={() => handleDelete(item)}
            >
              Eliminar
            </Button>
          </div>
        )
      default:
        return renderItems ? (
          renderItems(item, columnKey)
        ) : (
          <span>{String(value)}</span>
        )
    }
  }

  return (
    <>
      <Table
        className="hidden md:block w-full"
        aria-label="Data Table"
        isHeaderSticky
        isStriped
        fullWidth
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key as string} align="center">
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody<T> emptyContent={<p>No Hay Items</p>} items={data}>
          {(item) => (
            <TableRow key={getId(item)}>
              {(columnKey) => (
                <TableCell>{dataCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="md:hidden w-full">
        {data.map((item) => (
          <Card key={getId(item)} className="mb-3">
            <CardHeader>
              <h1 className="text-lg font-bold">{item.concepto}</h1>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              {columns.map(
                (column) =>
                  column.key !== 'actions' && (
                    <p key={column.key as string}>
                      <span className="font-bold">{column.label}:</span>{' '}
                      {dataCell(item, column.key as Key)}
                    </p>
                  )
              )}
            </CardBody>
            <CardFooter>{dataCell(item, 'actions')}</CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

export default TableComponent

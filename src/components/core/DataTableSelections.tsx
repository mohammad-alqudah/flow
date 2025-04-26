import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, Button, Flex, HStack, Text, Icon } from "@chakra-ui/react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: any[];
  showPagination?: boolean;
}

export function DataTableSelections<T>({
  data,
  columns,
  showPagination = true,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Flex direction="column" w="full">
      <Table.Root colorScheme="gray" variant="outline" rounded="lg">
        <Table.Header bg="gray.50">
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader
                  key={header.id}
                  colSpan={header.colSpan}
                  textTransform="uppercase"
                  fontSize="xs"
                  color="gray.500"
                  py={3}
                  px={6}
                >
                  {header.isPlaceholder ? null : (
                    <HStack
                      {...{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                        userSelect: header.column.getCanSort()
                          ? "none"
                          : "auto",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <Text>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Text>
                      {header.column.getCanSort() &&
                      {
                        asc: <Icon as={ChevronUp} boxSize={4} />,
                        desc: <Icon as={ChevronDown} boxSize={4} />,
                      }[header.column.getIsSorted() as string] ? (
                        {
                          asc: <Icon as={ChevronUp} boxSize={4} />,
                          desc: <Icon as={ChevronDown} boxSize={4} />,
                        }[header.column.getIsSorted() as string]
                      ) : (
                        <Icon as={ChevronsUpDown} boxSize={4} />
                      )}
                    </HStack>
                  )}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id} _hover={{ bg: "gray.50" }}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell
                  key={cell.id}
                  fontSize="sm"
                  color="gray.900"
                  py={4}
                  px={6}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {showPagination && (
        <Flex
          align="center"
          justify="space-between"
          borderTop="1px"
          borderColor="gray.200"
          py={3}
          px={6}
        >
          {/* إصدار الهاتف */}
          <Flex
            flex={1}
            justify="space-between"
            display={{ base: "flex", sm: "none" }}
          >
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              size="sm"
              colorScheme="gray"
            >
              السابق
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
              size="sm"
              colorScheme="gray"
            >
              التالي
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

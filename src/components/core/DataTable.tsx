import { Box, Center, HStack, Icon, Table, Text } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { InfoIcon } from "lucide-react";

const DataTable = ({
  data,
  columns,
  sorting,
  setSorting,
}: {
  data: any[];
  columns: any;
  sorting?: SortingState;
  setSorting?: any;
}) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  return (
    <Box mt="8" overflow="scroll">
      <Table.Root
        size="md"
        variant="outline"
        rounded="md"
        bg="white"
        shadow="sm"
      >
        <Table.Header bg="#f9fafb">
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader key={header.id}>
                  {header.isPlaceholder ? null : (
                    <HStack
                      cursor={header.column.getCanSort() ? "pointer" : "auto"}
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                          : undefined
                      }
                      color="#6b7280"
                      fontWeight="normal"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </HStack>
                  )}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {data.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} textAlign="center">
                <Center py="4" flexDir="column" gap="2">
                  <Icon as={InfoIcon} boxSize="6" color="gray.500" />
                  <Text fontSize="lg" color="gray.500">
                    No data available
                  </Text>
                </Center>
              </Table.Cell>
            </Table.Row>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default DataTable;

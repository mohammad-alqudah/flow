import DataTable from "@/components/core/DataTable";
import PageHeader from "@/components/core/PageHeader";
import Pagination from "@/components/core/Pagination";
import SkeletonLoader from "@/components/core/SkeletonTable";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import {
  Box,
  Button,
  Container,
  Field,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowUpRight03Icon, FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "react-router";
import DatePicker from "react-date-picker";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Invoices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Value>();
  const [dateTo, setDateTo] = useState<Value>();
  const columnHelper = createColumnHelper<any>();
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("number", {
      header: () => "Invoice Number",
      cell: (info) => (
        <Button
          variant="plain"
          rounded="full"
          onClick={() => {
            navigate(`/invoices/${info?.row?.original?.id}/view`);
          }}
        >
          {info.getValue()}
        </Button>
      ),
    }),
    columnHelper.accessor("date_issued", {
      header: () => "Date issued",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("date", {
      header: () => "date",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("amount", {
      header: () => "amount",
      cell: (info) => info.getValue() ?? "",
    }),
    columnHelper.accessor("client_name", {
      header: () => "Client name",
      cell: (info) => info?.row?.original?.file?.client?.name ?? "",
    }),
    columnHelper.accessor("client_email", {
      header: () => "Client email",
      cell: (info) => info?.row?.original?.file?.client?.email ?? "",
    }),
    columnHelper.accessor("client_mobile", {
      header: () => "Client mobile",
      cell: (info) => info?.row?.original?.file?.client?.mobile_number ?? "",
    }),
    columnHelper.accessor("tax", {
      header: () => "Tax",
      cell: (info) => info?.row?.original?.file?.client?.tax ?? "",
    }),
    columnHelper.accessor("settings", {
      header: () => "Settings",
      cell: (info) => (
        <IconButton
          variant="ghost"
          rounded="full"
          onClick={() => {
            navigate(`/invoices/${info?.row?.original?.id}/view`);
          }}
        >
          <HugeiconsIcon
            icon={ArrowUpRight03Icon}
            size="20px"
            color="GrayText"
          />
        </IconButton>
      ),
    }),
  ];

  const params = new URLSearchParams({
    ...(currentPage > 1 && { page: currentPage.toString() }),
    ...(search && { search }),
    ...(dateFrom && { date_issued_after: formatDate(dateFrom.toString()) }),
    ...(dateTo && { date_issued_before: formatDate(dateTo.toString()) }),
  });

  const { data, isPending } = useCustomQuery(
    `invoice/invoices/?${params.toString()}`,
    ["invoices", `invoices-${params}`]
  );

  JSON.parse(localStorage.getItem("user") || "{}")?.permissions
    ?.can_view_invoices === false && navigate("/");

  return (
    <Container maxW="container.xl" py={6}>
      {/* page header */}
      <PageHeader
        title="Invoices"
        description="Manage and track all billing information"
        buttonTitle="New Bill"
      />
      {/* page header */}

      {/* filter */}
      <Box shadow="xs" bg="white" p={4} mb={4} rounded="md">
        <HStack>
          <HugeiconsIcon icon={FilterIcon} size="20px" color="GrayText" />
          <Box>Filter:</Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4" mt="4">
          {/* number */}
          <Box>
            <Field.Root>
              <Field.Label>
                Search <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="search by number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field.Root>
          </Box>
          {/* number */}

          <Box></Box>

          {/* date_issued */}
          <Box>
            <Field.Root>
              <Field.Label>
                Date From <Field.RequiredIndicator />
              </Field.Label>
              {/* <Input
                type="date"
                value={formatDate(dateFrom)}
                onChange={(e) => setDateFrom(formatDate(e.target.value))}
                // defaultValue={new Date().toISOString().split("T")[0]}
                placeholder="mm/dd/yyyy"
              /> */}
              <Box
                asChild
                w="full"
                border="1px solid #e4e4e7 !important"
                outline="none"
                rounded="0.25rem !important"
                py="1.5"
                px="2"
              >
                <DatePicker
                  onChange={setDateFrom}
                  value={dateFrom}
                  format="MM/dd/yyyy"
                  dayPlaceholder="d"
                  monthPlaceholder="m"
                  yearPlaceholder="y"
                />
              </Box>
            </Field.Root>
          </Box>
          {/* date_issued */}

          {/* date  */}
          <Box>
            <Field.Root>
              <Field.Label>
                Date to <Field.RequiredIndicator />
              </Field.Label>
              {/* <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                // defaultValue={new Date().toISOString().split("T")[0]}
              /> */}

              <Box
                asChild
                w="full"
                border="1px solid #e4e4e7 !important"
                outline="none"
                rounded="0.25rem !important"
                py="1.5"
                px="2"
              >
                <DatePicker
                  onChange={setDateTo}
                  value={dateTo}
                  format="MM/dd/yyyy"
                  dayPlaceholder="d"
                  monthPlaceholder="m"
                  yearPlaceholder="y"
                />
              </Box>
            </Field.Root>
          </Box>
          {/* date  */}
        </SimpleGrid>
      </Box>
      {/* filter */}

      {/* table */}
      <Box shadow="xs" bg="white" p={4} mb={4} rounded="md">
        {isPending ? (
          <SkeletonLoader />
        ) : (
          <>
            <DataTable data={data?.data} columns={columns} />
            <Pagination
              currentPage={currentPage}
              hasNext={data?.next}
              hasPrevious={data?.previous}
              onPageChange={setCurrentPage}
              count={data?.count}
            />
          </>
        )}
      </Box>

      {/* table */}
    </Container>
  );
};

export default Invoices;

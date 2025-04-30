import CustomModal from "@/components/core/CustomModal";
import DataTable from "@/components/core/DataTable";
import PageHeader from "@/components/core/PageHeader";
import Pagination from "@/components/core/Pagination";
import SkeletonLoader from "@/components/core/SkeletonTable";
import { useCustomPost } from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import {
  Box,
  Container,
  Field,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import {
  ArrowUpRight03Icon,
  FilterIcon,
  GoogleDocIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/core/CustomInput";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";

type Inputs = {
  date_issued: string;
};

const schema = yup
  .object({
    date_issued: yup.string().required(),
  })
  .required();

const Bills = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const columnHelper = createColumnHelper<any>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const columns = [
    columnHelper.accessor("id", {
      header: () => "id",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.row.original.file.id,
    }),
    columnHelper.accessor("number", {
      header: () => "Invoice Number",
      cell: (info) => info.getValue(),
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
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client_name", {
      header: () => "Client name",
      cell: (info) => info.row.original.file.client.name,
    }),
    columnHelper.accessor("client_email", {
      header: () => "Client email",
      cell: (info) => info.row.original.file.client.email,
    }),
    columnHelper.accessor("client_mobile", {
      header: () => "Client mobile",
      cell: (info) => info.row.original.file.client.mobile_number,
    }),
    columnHelper.accessor("tax", {
      header: () => "Tax",
      cell: (info) => info.row.original.file.client.tax,
    }),
    columnHelper.accessor("settings", {
      header: () => "Settings",
      cell: (info) => (
        <IconButton
          variant="ghost"
          rounded="full"
          onClick={() => {
            navigate(`/invoices/${info.row.original.id}/view`);
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
    ...(dateFrom && { date: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
  });

  const { data, isPending } = useCustomQuery(
    `invoice/invoices/?${params.toString()}`,
    ["invoices", `invoices-${params}`]
  );

  const addInvoice = useCustomPost("invoice/invoices/", ["invoices"]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addInvoice
      .mutateAsync(data)
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("invoice created successflly") && setOpen(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
      });
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* page header */}
      <PageHeader
        title="Bills"
        description="Manage and track all billing information"
        buttonTitle="New Bill"
        buttonIcon={GoogleDocIcon}
        buttonClick={() => setOpen(true)}
        buttonLoading={addInvoice.isPending}
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

          {/* date_issued */}
          <Box>
            <Field.Root>
              <Field.Label>
                Date From <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                // defaultValue={new Date().toISOString().split("T")[0]}
              />
            </Field.Root>
          </Box>
          {/* date_issued */}

          {/* date  */}
          <Box>
            <Field.Root>
              <Field.Label>
                Date <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                // defaultValue={new Date().toISOString().split("T")[0]}
              />
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

      {/* add bill modal */}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Create bill"
        loading={addInvoice.isPending}
        formNameId="add_invoice"
        actionButtonTitle="add invoice"
        // actionButtonFunction={() => handleSubmit(onSubmit)}
      >
        <VStack
          id="add_invoice"
          as="form"
          w="full"
          gap={4}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* date */}
          <CustomInput
            type="date"
            label="Date"
            {...register("date_issued")}
            errorMeassage={
              errors.date_issued?.message
                ? String(errors.date_issued?.message)
                : ""
            }
          />

          {/* date */}
        </VStack>
      </CustomModal>
      {/* add bill modal */}
    </Container>
  );
};

export default Bills;

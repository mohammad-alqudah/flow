import CustomInput from "@/components/core/CustomInput";
import CustomModal from "@/components/core/CustomModal";
import CustomSelect from "@/components/core/CustomSelect";
import { DataTableSelections } from "@/components/core/DataTableSelections";
import Pagination from "@/components/core/Pagination";
import SkeletonLoader from "@/components/core/SkeletonTable";
import { FilterBar } from "@/components/orders/FilterBar";
import { useCustomPost } from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowUpRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createColumnHelper } from "@tanstack/react-table";

import { Filter, Package, Settings2 } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as yup from "yup";

type Inputs = {
  type: string[];
  freight_type: string[];
  date: string;
};
const schema = yup.object({
  type: yup.array().required(),
  freight_type: yup.array().required(),
  date: yup.string().required(),
});

const Orders = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [openCreateOrderDialog, setOpenCreateOrderDialog] = useState(false);
  const {
    open: isColumnSettingsOpen,
    onOpen: onColumnSettingsOpen,
    onClose: onColumnSettingsClose,
  } = useDisclosure();
  const {
    open: isFilterSettingsOpen,
    onOpen: onFilterSettingsOpen,
    onClose: onFilterSettingsClose,
  } = useDisclosure();

  const [filters, setFilters] = useState<any>({
    search: "",
    type: "",
    mode: "",
    declaration_number: "",
    reference_number: "",
    client: "",
    shipper: "",
    consignee: "",
    notify: "",
    pol: "",
    pod: "",
    pol_country: "",
    pod_country: "",
    final_destination: "",
    etd: null,
    eta: null,
    created_at_range: [null, null],
    mbl_number: "",
    hbl_number: "",
    shipping_line: "",
    mawb_number: "",
    hawb_number: "",
    airline: "",
    clearing_agent: "",
    agent: "",
    network: "",
  });

  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>(
    {
      type: true,
      mode: true,
      declaration_number: true,
      reference_number: true,
      client: true,
      shipper: true,
      consignee: true,
      notify: true,
      pol: true,
      pod: true,
      pol_country: true,
      pod_country: true,
      final_destination: true,
      etd: true,
      eta: true,
      created_at_range: true,
      mbl_number: true,
      hbl_number: true,
      shipping_line: true,
      mawb_number: true,
      hawb_number: true,
      airline: true,
      clearing_agent: true,
      agent: true,
      network: true,
    }
  );

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      name: true,
      // bill_status: true,
      client: true,
      client_mobile_number: true,
      client_email: true,
      client_tax: true,
      client_address: true,
      shipper: true,
      shipper_mobile_number: true,
      shipper_email: true,
      shipper_tax: true,
      shipper_address: true,
      final_destination: true,
      etd: true,
      eta: true,
      clearing_agent: true,
      description_of_goods: true,
      agent: true,
      network: true,
      mbl_number: true,
      hbl_number: true,
      teus: true,
      seal_number: true,
      pol: true,
      pod: true,
      pol_country: true,
      pod_country: true,
      mawb_number: true,
      haqb_number: true,
      airline: true,
      created_at: true,
      actions: true,
    }
  );

  const columnHelper = createColumnHelper<any>();

  const params = new URLSearchParams({
    ...(page > 1 && { page: page.toString() }),
  });

  const ordersData = useCustomQuery(`file/files/?${params.toString()}`, [
    "orders",
    `files-${page}`,
  ]);

  const newColumns = [
    { id: "name" },
    // { id: "bill_status" },
    { id: "client" },
    { id: "client_mobile_number" },
    { id: "client_email" },
    { id: "client_tax" },
    { id: "client_address" },
    { id: "shipper" },
    { id: "shipper_mobile_number" },
    { id: "shipper_email" },
    { id: "shipper_tax" },
    { id: "shipper_address" },
    { id: "final_destination" },
    { id: "etd" },
    { id: "eta" },
    { id: "clearing_agent" },
    { id: "description_of_goods" },
    { id: "agent" },
    { id: "network" },
    { id: "mbl_number" },
    { id: "hbl_number" },
    { id: "teus" },
    { id: "seal_number" },
    { id: "pol" },
    { id: "pod" },
    { id: "pol_country" },
    { id: "pod_country" },
    { id: "mawb_number" },
    { id: "haqb_number" },
    { id: "airline" },
    { id: "created_at" },
    { id: "actions" },
  ];

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => "Name",
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor("bill_status", {
    //   id: "bill_status",
    //   header: () => "Bill Status",
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("client.name", {
      id: "client",
      header: () => "Client Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client.mobile_number", {
      id: "client_mobile_number",
      header: () => "Client Mobile",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client.email", {
      id: "client_email",
      header: () => "Client Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client.tax", {
      id: "client_tax",
      header: () => "Client Tax",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client.address", {
      id: "client_address",
      header: () => "Client Address",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("shipper.name", {
      id: "shipper",
      header: () => "Shipper Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("shipper.mobile_number", {
      id: "shipper_mobile_number",
      header: () => "Shipper Mobile",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("shipper.email", {
      id: "shipper_email",
      header: () => "Shipper Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("shipper.tax", {
      id: "shipper_tax",
      header: () => "Shipper Tax",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("shipper.address", {
      id: "shipper_address",
      header: () => "Shipper Address",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("final_destination", {
      id: "final_destination",
      header: () => "Final Destination",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("etd", {
      id: "etd",
      header: () => "ETD",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("eta", {
      id: "eta",
      header: () => "ETA",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("clearing_agent.name", {
      id: "clearing_agent",
      header: () => "Clearing Agent",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description_of_goods", {
      id: "description_of_goods",
      header: () => "Description of Goods",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("agent.name", {
      id: "agent",
      header: () => "Agent",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("network.name", {
      id: "network",
      header: () => "Network",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("mbl_number", {
      id: "mbl_number",
      header: () => "MBL Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("hbl_number", {
      id: "hbl_number",
      header: () => "HBL Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("teus", {
      id: "teus",
      header: () => "TEUS",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("seal_number", {
      id: "seal_number",
      header: () => "Seal Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("pol.name", {
      id: "pol",
      header: () => "POL",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("pod.name", {
      id: "pod",
      header: () => "POD",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("pol_country.name", {
      id: "pol_country",
      header: () => "POL Country",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("pod_country.name", {
      id: "pod_country",
      header: () => "POD Country",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("mawb_number", {
      id: "mawb_number",
      header: () => "MAWB Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("haqb_number", {
      id: "haqb_number",
      header: () => "HAQB Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("airline.name", {
      id: "airline",
      header: () => "Airline",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("created_at", {
      id: "created_at",
      header: () => "Created At",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("settings", {
      id: "actions",
      header: () => "Action",
      cell: (info) => (
        <IconButton
          variant="ghost"
          rounded="full"
          onClick={() => {
            navigate({
              pathname: `/orders/${info.row.original.id}/view`,
              search: `?name=${info.row.original.name}&type=${info.row.original.type}&freight_type=${info.row.original.mode}&date=${info.row.original.date}`,
            });
          }}
        >
          <HugeiconsIcon icon={ArrowUpRight02Icon} />
        </IconButton>
      ),
      enableSorting: false,
    }),
  ].filter((col: any) => col.id === "actions" || visibleColumns[col.id]);

  const filterOptions = {
    type: ["import", "export"],
    mode: ["SeaFreight", "AirFreight", "LandTransport", "Logistics"],
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });
  console.log("errors", errors);
  const createOrder = useCustomPost("file/files/", ["files"]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    createOrder.mutateAsync(
      {
        type: data.type[0],
        mode: data.freight_type[0],
        date: data.date,
      },
      {
        onSuccess: (res) => {
          if (res.status) {
            console.log("res", res);
            toast.success("Order created successfully");
            setOpenCreateOrderDialog(false);
            // navigate to the order page
            navigate({
              pathname: `/orders/${res?.data?.id}/create`,
              search: `?name=${res?.data?.name}&type=${res?.data?.type}&freight_type=${res?.data?.mode}&date=${res?.data?.created_at}`,
            });
          }
        },
        onError: (err) => {
          console.log("err", err);
          toast.error("Error creating order");
        },
      }
    );
  };

  return (
    <Container maxW="container.xl" py={6}>
      <VStack gap={6} align="stretch">
        {/* page header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">Orders</Heading>
            <Text color="gray.600" mt={1}>
              Manage and track all your shipment orders
            </Text>
          </Box>
          <Flex gap={3}>
            <Button variant="outline" onClick={onFilterSettingsOpen}>
              <Filter />
              Filters
            </Button>
            <Button variant="outline" onClick={onColumnSettingsOpen}>
              <Settings2 />
              Columns
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                setOpenCreateOrderDialog(true);
              }}
            >
              <Package />
              New Order
            </Button>
          </Flex>
        </Flex>
        {/* page header */}

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          visibleFilters={visibleFilters}
          filterOptions={filterOptions}
        />

        <Box bg="white" rounded="lg" shadow="sm" overflow="scroll">
          {ordersData.isPending ? (
            <SkeletonLoader />
          ) : (
            <>
              <DataTableSelections
                data={ordersData?.data?.data || []}
                columns={columns}
              />
              <Pagination
                count={ordersData?.data?.total || 0}
                currentPage={page}
                onPageChange={setPage}
                hasNext={ordersData?.data?.next}
                hasPrevious={ordersData?.data?.previous}
              />
            </>
          )}
        </Box>
      </VStack>

      {/* Column Settings Modal */}
      <CustomModal
        open={isColumnSettingsOpen}
        setOpen={onColumnSettingsClose}
        title="Column Settings"
      >
        <VStack align="stretch" gap={3}>
          {newColumns
            .filter((col) => col.id !== "actions")
            .map((column: any) => (
              <Checkbox.Root
                key={column.id}
                defaultChecked={visibleColumns[column.id]}
                onChange={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    [column.id]: !prev[column.id],
                  }))
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{column.id}</Checkbox.Label>
              </Checkbox.Root>
            ))}
        </VStack>
      </CustomModal>
      {/* <Dialog.Root
        open={isColumnSettingsOpen}
        onOpenChange={onColumnSettingsClose}
      >
        <Portal disabled>
          <Dialog.Backdrop />
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Column Settings</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack align="stretch" gap={3}>
                {columns
                  .filter((col) => col.id !== "actions")
                  .map((column) => (
                    <Checkbox.Root
                      key={column.id}
                      checked={visibleColumns[column.id]}
                      onChange={() =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [column.id]: !prev[column.id],
                        }))
                      }
                    >
                      {column.header}
                    </Checkbox.Root>
                  ))}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button colorScheme="teal" onClick={onColumnSettingsClose}>
                Done
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Portal>
      </Dialog.Root> */}

      {/* Filter Settings Modal */}
      <CustomModal
        open={isFilterSettingsOpen}
        setOpen={onFilterSettingsClose}
        title="Filter Settings"
      >
        <VStack align="stretch" gap={3}>
          {Object.keys(visibleFilters).map((filterId) => (
            <Checkbox.Root
              key={filterId}
              defaultChecked={visibleFilters[filterId]}
              onChange={() =>
                setVisibleFilters((prev) => ({
                  ...prev,
                  [filterId]: !prev[filterId],
                }))
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                {" "}
                {filterId
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}{" "}
                Filter
              </Checkbox.Label>
            </Checkbox.Root>
          ))}
        </VStack>
      </CustomModal>

      {/* create order */}
      <CustomModal
        open={openCreateOrderDialog}
        setOpen={setOpenCreateOrderDialog}
        title="Create Order"
        actionButtonTitle="Create"
        actionButtonFunction={() => handleSubmit(onSubmit)()}
        loading={createOrder.isPending}
      >
        <VStack gap="4">
          <CustomSelect
            data={[
              { label: "import", value: "import" },
              { label: "export", value: "export" },
            ]}
            control={control}
            name="type"
            label="type"
            errorMeassage={
              errors?.type?.message ? String(errors?.type?.message) : ""
            }
          />{" "}
          <CustomSelect
            data={[
              { label: "Logistics", value: "Logistics" },
              { label: "LandTransport", value: "LandTransport" },
              { label: "SeaFreight", value: "SeaFreight" },
              { label: "AirFreight", value: "AirFreight" },
            ]}
            control={control}
            name="freight_type"
            label="Freight Type"
            errorMeassage={errors?.freight_type?.message}
          />
          <CustomInput
            type="date"
            label="Date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            {...register("date")}
            errorMeassage={
              errors?.date?.message ? String(errors?.date?.message) : ""
            }
          />
        </VStack>
      </CustomModal>
      {/* create order */}
    </Container>
  );
};

export default Orders;

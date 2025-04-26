import CustomInput from "@/components/core/CustomInput";
import CustomModal from "@/components/core/CustomModal";
import CustomSelect from "@/components/core/CustomSelect";
import { DataTableSelections } from "@/components/core/DataTableSelections";
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
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

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
  // const [page, setPage] = useState(1);
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
    // Basic Information
    type: "",
    mode: "",
    declaration_number: "",
    reference_number: "",
    // Parties
    client: "",
    shipper: "",
    consignee: "",
    notify: "",
    // Locations
    pol: "",
    pod: "",
    pol_country: "",
    pod_country: "",
    final_destination: "",
    // Dates
    etd: null,
    eta: null,
    created_at_range: [null, null],
    // Sea Freight
    mbl_number: "",
    hbl_number: "",
    shipping_line: "",
    // Air Freight
    mawb_number: "",
    hawb_number: "",
    airline: "",
    // Agents
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
      type: true,
      mode: true,
      declaration_number: true,
      client: true,
      shipper: true,
      consignee: true,
      notify: true,
      pol: true,
      pod: true,
      final_destination: true,
      etd: true,
      eta: true,
      created_at: true,
    }
  );

  // const columnHelper = createColumnHelper<any>();

  const ordersData = useCustomQuery("file/files/", ["files"]);
  const columns = [
    {
      id: "name",
      header: "Reference Number",
      accessorKey: "name",
    },
    {
      id: "type",
      header: "Type as",
      accessorKey: "type",
      cell: ({ row }: any) => (
        <Text textTransform="capitalize">{row.original.type}</Text>
      ),
    },
    {
      id: "mode",
      header: "Mode",
      accessorKey: "mode",
      // cell: ({ row }) => (
      //   <Text textTransform="capitalize">{row.original.mode}</Text>
      // ),
    },
    {
      id: "declaration_number",
      header: "Declaration Number",
      accessorKey: "declaration_number",
    },
    {
      id: "client",
      header: "Client",
      accessorKey: "client.name",
    },
    {
      id: "shipper",
      header: "Shipper",
      accessorKey: "shipper.name",
    },
    {
      id: "created_at",
      header: "Created At",
      accessorKey: "created_at",
      // cell: ({ row }) => {
      //   const date = new Date(row.original.created_at);
      //   return date.toLocaleDateString("en-US", {
      //     year: "numeric",
      //     month: "short",
      //     day: "numeric",
      //   });
      // },
    },
    {
      id: "actions",
      // cell: ({ row }) => (
      //   <IconButton
      //     aria-label="View details"
      //     variant="ghost"
      //     colorScheme="teal"
      //     onClick={() => navigate(`/orders/${row.original.id}`)}
      //   >
      //     <ArrowUpRight />
      //   </IconButton>
      // ),
    },
  ].filter((col) => col.id === "actions" || visibleColumns[col.id]);

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

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          visibleFilters={visibleFilters}
          filterOptions={filterOptions}
        />

        <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
          {ordersData.isPending ? (
            <SkeletonLoader />
          ) : (
            <DataTableSelections
              data={ordersData?.data || []}
              columns={columns}
            />
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
          {columns
            .filter((col) => col.id !== "actions")
            .map((column) => (
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
                <Checkbox.Label>{column.header}</Checkbox.Label>
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

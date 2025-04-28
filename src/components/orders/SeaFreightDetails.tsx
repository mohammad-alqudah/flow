import PageCard from "../core/PageCard";
import {
  Add01Icon,
  AiEditingIcon,
  BoatIcon,
  Delete02Icon,
  PackageIcon,
} from "@hugeicons/core-free-icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import CustomInput from "../core/CustomInput";
import { HugeiconsIcon } from "@hugeicons/react";
import DataTable from "../core/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useCustomQuery } from "@/hooks/useQuery";
import SkeletonLoader from "../core/SkeletonTable";
import { useState } from "react";
import CustomModal from "../core/CustomModal";
import ContainerAddModel from "./ContainerAddModel";
import ContainerEditModel from "./ContainerEditModel";
import { useCustomRemove } from "@/hooks/useMutation";
import CustomSelectWithAddButtom from "../core/CustomSelectWithAddButtom";

const SeaFreightDetails = ({
  register,
  defaultValue,
  options,
  handleOptions,
  disabled,
  control,
}: {
  register: any;
  defaultValue: any;
  options: any;
  handleOptions: (model: string, data: any) => void;
  disabled?: boolean;
  control: any;
}) => {
  const [selectedData, setSelectedData] = useState<any>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper<any>();

  const containerData = useCustomQuery(
    `/file/containers/all/${defaultValue.id}/`,
    ["containers", `containers-${defaultValue.id}`]
  );

  const deleteContainer = useCustomRemove(
    `/file/containers/${selectedData?.id}/`,
    ["containers"]
  );

  const columns = [
    columnHelper.accessor("number", {
      header: () => "ID",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("container_type", {
      header: () => "Container Type",
      cell: (info) => info.getValue()?.name,
    }),
    columnHelper.accessor("gross_weight", {
      header: () => "Weight (KG)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("volume", {
      header: () => "Volume (CBM)	",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("number_of_packages", {
      header: () => "Packages",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("package_type", {
      header: () => "Package Type",
      cell: (info) => info.getValue()?.name,
    }),
    columnHelper.accessor("seal_number", {
      header: () => "Seal Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("settings", {
      header: () => "",
      cell: (info) => (
        <HStack gap={0}>
          <IconButton
            variant="ghost"
            rounded="full"
            size="xs"
            onClick={() => {
              setSelectedData(info.row.original);
              setOpenEdit(true);
            }}
          >
            <HugeiconsIcon icon={AiEditingIcon} />
          </IconButton>
          <IconButton
            colorPalette="red"
            variant="ghost"
            rounded="full"
            size="xs"
            onClick={() => {
              setSelectedData(info.row.original);
              setOpenDelete(true);
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} />
          </IconButton>
        </HStack>
      ),
      enableSorting: false,
    }),
  ];

  const handleDelete = async () => {
    setLoading(true);
    deleteContainer
      .mutateAsync()
      .then(() => {
        setLoading(false);
        setOpenDelete(false);
        containerData.refetch();
      })
      .catch(() => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setOpenDelete(false);
      });
  };

  if (containerData.isPending || deleteContainer.isPending) {
    return <SkeletonLoader />;
  }
  return (
    <>
      <PageCard title="Sea Freight Details" icon={BoatIcon}>
        <SimpleGrid columns={2} gap={6}>
          {/* MBL Number */}
          <Box>
            <CustomInput
              type="text"
              label="MBL Number"
              w="full"
              mt={1}
              {...register("mbl_number")}
              defaultValue={defaultValue.mbl_number}
              disabled={disabled}
            />
          </Box>
          {/* MBL Number */}

          {/* MBL Originals */}
          <Box>
            <CustomInput
              type="number"
              label="MBL Originals"
              w="full"
              mt={1}
              {...register("mbl_originals")}
              defaultValue={defaultValue.mbl_originals}
              disabled={disabled}
            />
          </Box>
          {/* MBL Originals */}

          {/* HBL Number */}
          <Box>
            <CustomInput
              type="text"
              label="HBL Number"
              w="full"
              mt={1}
              {...register("hbl_number")}
              defaultValue={defaultValue.hbl_number}
              disabled={disabled}
            />
          </Box>
          {/* HBL Number */}

          {/* HBL Originals */}
          <Box>
            <CustomInput
              type="number"
              label="HBL Originals"
              w="full"
              mt={1}
              {...register("hbl_originals")}
              defaultValue={defaultValue.hbl_originals}
              disabled={disabled}
            />
          </Box>
          {/* HBL Originals */}

          {/* Shipping Line */}
          <Box>
            <CustomSelectWithAddButtom
              label="Shipping Line"
              name="shipping_line"
              control={control}
              data={options?.data?.data?.shipping_line?.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              model="shipping_line"
              fields={[{ name: "name", type: "text", required: true }]}
              addOptionFunc={handleOptions}
              // defaultValue={orderData?.data?.data?.agent?.id}
              // errorMeassage={
              //   errors?.seal_number?.message
              //     ? String(errors?.seal_number?.message)
              //     : ""
              // }
              disabled={disabled}
            />
          </Box>
          {/* Shipping Line */}

          {/* TEUs */}
          <Box>
            <CustomInput
              type="number"
              label="TEUs"
              w="full"
              mt={1}
              {...register("teus")}
              defaultValue={defaultValue.teus}
              disabled={disabled}
            />
          </Box>
          {/* TEUs */}
        </SimpleGrid>
        <PageCard>
          <HStack justify="space-between" align="center" mb="4">
            <Heading as="h6" size="md" display="flex" gap="2">
              <Box p={2} bg="teal.50" borderRadius="lg" color="teal.800">
                <HugeiconsIcon icon={PackageIcon} />
              </Box>
              <VStack align="start" gap="0">
                <Box fontWeight="medium" alignItems="center">
                  Containers
                </Box>
                <Text fontSize="xs" color="gray.500">
                  Manage container information
                </Text>
              </VStack>
            </Heading>

            <Button
              size="xs"
              onClick={() => {
                setOpenAdd(true);
              }}
            >
              <HugeiconsIcon icon={Add01Icon} />
              Add container
            </Button>
          </HStack>
          <DataTable columns={columns} data={containerData?.data?.data} />
        </PageCard>
      </PageCard>

      {/* add continer */}
      <CustomModal
        open={openAdd}
        setOpen={setOpenAdd}
        title="Add Container"
        actionButtonTitle="Add"
        formNameId="container-add"
        loading={loading}
      >
        <ContainerAddModel
          closeModal={setOpenAdd}
          formNameId="container-add"
          setLoading={setLoading}
          orderId={defaultValue.id}
          options={options}
          handleOptions={handleOptions}
        />
      </CustomModal>
      {/* add continer */}

      {/* edit continer */}
      <CustomModal
        open={openEdit}
        setOpen={setOpenEdit}
        title="Edit Container"
        actionButtonTitle="Update"
        formNameId="container-edit"
        loading={loading}
      >
        <ContainerEditModel
          closeModal={setOpenEdit}
          formNameId="container-edit"
          setLoading={setLoading}
          containerId={selectedData?.id}
          defaultValue={selectedData}
          options={options}
          handleOptions={handleOptions}
        />
      </CustomModal>
      {/* edit continer */}

      {/* delete continer */}
      <CustomModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Container"
        actionButtonTitle="Delete"
        actionButtonColor="red"
        actionButtonFunction={handleDelete}
        loading={loading}
      >
        Are you sure you want to delete this container?
      </CustomModal>
      {/* delete continer */}
    </>
  );
};

export default SeaFreightDetails;

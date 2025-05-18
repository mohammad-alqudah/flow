import PageCard from "../core/PageCard";
import {
  Add01Icon,
  AiEditingIcon,
  AirplaneTakeOff01Icon,
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
import CustomSelectWithAddButtom from "../core/CustomSelectWithAddButtom";
import { HugeiconsIcon } from "@hugeicons/react";
import DataTable from "../core/DataTable";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomRemove } from "@/hooks/useMutation";
import CustomModal from "../core/CustomModal";
import PackageEditModel from "./PackageEditModel";
import PackageAddModel from "./PackageAddModel";

const AirFreightDetails = ({
  register,
  defaultValue,
  control,
  options,
  handleOptions,
  errors,
  disabled = false,
}: {
  register: any;
  defaultValue: any;
  control: any;
  options: any;
  handleOptions: (model: string, data: any) => Promise<void>;
  errors: any;
  disabled?: boolean;
}) => {
  const [selectedData, setSelectedData] = useState<any>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper<any>();

  const packageData = useCustomQuery(`/file/packeges/all/${defaultValue.id}/`, [
    "packeges",
    `packeges-${defaultValue.id}`,
  ]);

  const deletePackage = useCustomRemove(`/file/packeges/${selectedData?.id}/`, [
    "packeges",
  ]);

  const columns = [
    columnHelper.accessor("number_of_packages", {
      header: () => "Number of PKGS",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("type", {
      header: () => "Type (drop down)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("net_weight", {
      header: () => "Net weight KG",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("gross_weight", {
      header: () => "Gross Weight  KG",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("fimensions_length", {
      header: () => "Dimensions  cm (L)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("fimensions_width", {
      header: () => "Dimensions  cm (W)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("fimensions_height", {
      header: () => "Dimensions  cm (H)",
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
    deletePackage
      .mutateAsync()
      .then(() => {
        setLoading(false);
        setOpenDelete(false);
        packageData.refetch();
      })
      .catch(() => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setOpenDelete(false);
      });
  };

  return (
    <>
      <PageCard title="Air Freight Details" icon={AirplaneTakeOff01Icon}>
        <SimpleGrid columns={2} gap={6}>
          {/* mawb_number */}
          <Box>
            <CustomInput
              type="number"
              label="MAWB number"
              w="full"
              mt={1}
              {...register("mawb_number")}
              defaultValue={defaultValue?.mawb_number}
              disabled={disabled}
            />
          </Box>
          {/* mawb_number */}

          {/* hawb_number */}
          <Box>
            <CustomInput
              type="number"
              label="HAWB number"
              w="full"
              mt={1}
              {...register("hawb_number")}
              defaultValue={defaultValue?.hawb_number}
              disabled={disabled}
            />
          </Box>
          {/* hawb_number */}

          {/* airline */}
          <Box>
            <CustomSelectWithAddButtom
              label="Air line"
              name="airline"
              control={control}
              data={options?.data?.data?.airlines?.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              model="airline"
              fields={[{ name: "name", type: "text", required: true }]}
              addOptionFunc={handleOptions}
              // defaultValue={orderData?.data?.data?.agent?.id}
              errorMeassage={
                errors?.seal_number?.message
                  ? String(errors?.seal_number?.message)
                  : ""
              }
              disabled={disabled}
            />
          </Box>
          {/* airline */}

          {/* gross_weight */}
          <Box>
            <CustomInput
              type="number"
              label="Gross weight"
              w="full"
              mt={1}
              {...register("gross_weight")}
              defaultValue={defaultValue?.gross_weight}
              disabled={disabled}
            />
          </Box>
          {/* gross_weight */}

          {/* net_weight */}
          <Box>
            <CustomInput
              type="number"
              label="Net Weight"
              w="full"
              mt={1}
              {...register("net_weight")}
              defaultValue={defaultValue?.net_weight}
              disabled={disabled}
            />
          </Box>
          {/* net_weight */}

          {/* volume */}
          <Box>
            <CustomInput
              type="number"
              label="Volume"
              w="full"
              mt={1}
              {...register("volume")}
              defaultValue={defaultValue?.volume}
              disabled={disabled}
            />
          </Box>
          {/* volume */}

          {/* chargable_weight */}
          <Box>
            <CustomInput
              type="number"
              label="Chargable Weight"
              w="full"
              mt={1}
              {...register("chargable_weight")}
              defaultValue={defaultValue?.chargable_weight}
              disabled={disabled}
            />
          </Box>
          {/* chargable_weight */}
        </SimpleGrid>

        {/* package */}
        <PageCard>
          <HStack justify="space-between" align="center" mb="4">
            <Heading as="h6" size="md" display="flex" gap="2">
              <Box p={2} bg="teal.50" borderRadius="lg" color="teal.800">
                <HugeiconsIcon icon={PackageIcon} />
              </Box>
              <VStack align="start" gap="0">
                <Box fontWeight="medium" alignItems="center">
                  Packages
                </Box>
                <Text fontSize="xs" color="gray.500">
                  Manage packages information
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
              Add package
            </Button>
          </HStack>
          <DataTable columns={columns} data={packageData?.data?.data || []} />
        </PageCard>
        {/* package */}
      </PageCard>

      {/* add continer */}
      <CustomModal
        open={openAdd}
        setOpen={setOpenAdd}
        title="Add Package"
        actionButtonTitle="Add"
        formNameId="package-add"
        loading={loading}
      >
        <PackageAddModel
          closeModal={setOpenAdd}
          formNameId="package-add"
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
        title="Edit Package"
        actionButtonTitle="Update"
        formNameId="package-edit"
        loading={loading}
      >
        <PackageEditModel
          closeModal={setOpenEdit}
          formNameId="package-edit"
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
        title="Delete package"
        actionButtonTitle="Delete"
        actionButtonColor="red"
        actionButtonFunction={handleDelete}
        loading={loading}
      >
        Are you sure you want to delete this package?
      </CustomModal>
      {/* delete continer */}
    </>
  );
};

export default AirFreightDetails;

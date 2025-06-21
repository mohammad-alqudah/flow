import CustomInput from "@/components/core/CustomInput";
import CustomModal from "@/components/core/CustomModal";
import CustomSelectWithAddButtom from "@/components/core/CustomSelectWithAddButtom";
import DataTable from "@/components/core/DataTable";
import SkeletonLoader from "@/components/core/SkeletonTable";
import {
  useCustomPost,
  useCustomRemove,
  useCustomUpdate,
} from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import getTodayDate from "@/utils/getTodayDate";
import handleOption from "@/utils/handleOptions";
import handleErrorAlerts from "@/utils/showErrorMessages";
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Add01Icon, Delete02Icon, Pen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

type Inputs = {
  charges: string;
  value: string;
  date: string;
  supplier: string;
};

const schema = yup
  .object({
    charges: yup.string().required(),
    value: yup.string().required(),
    date: yup.string().required(),
    supplier: yup.string().required(),
  })
  .required();

const AdditionalCosts = ({ invoiceId }: { invoiceId: string }) => {
  const [itemDetails, setItemDetails] = useState<any>();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const itemsData = useCustomQuery(`invoice/costs/?invoice_id=${invoiceId}`, [
    "invoice-costs",
    `invoice-costs-${invoiceId}`,
  ]);
  const columnHelper = createColumnHelper<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const columns = [
    columnHelper.accessor("id", {
      header: () => "idx",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor("charges", {
      header: () => "charges",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("value", {
      header: () => "value",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: () => "date",
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor("invoice", {
    //   header: () => "invoice",
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("supplier", {
      header: () => "supplier",
      cell: (info) => info.getValue().name,
    }),

    columnHelper.accessor("settings", {
      header: () => "Settings",
      cell: (info) => (
        <HStack gap="0">
          <IconButton
            variant="ghost"
            rounded="full"
            onClick={() => {
              console.log("info.row.original", info.row.original);
              setItemDetails(info.row.original);
              setIsOpenEdit(true);
            }}
          >
            <HugeiconsIcon icon={Pen01Icon} size="20px" />
          </IconButton>
          <IconButton
            colorPalette="red"
            variant="ghost"
            rounded="full"
            onClick={() => {
              setItemDetails(info.row.original);
              setIsOpenDelete(true);
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} size="20px" />
          </IconButton>
        </HStack>
      ),
    }),
  ];

  const addInvoiceItem = useCustomPost(`invoice/costs/`, ["invoice-costs"]);
  const editInvoiceItem = useCustomUpdate(`invoice/costs/${itemDetails?.id}/`, [
    `invoice-costs`,
  ]);
  const deleteInvoiceItem = useCustomRemove(
    `invoice/costs/${itemDetails?.id}`,
    ["invoice-costs"]
  );

  const addOptions = useCustomPost("client_settings/options/", ["options"]);
  const options = useCustomQuery("client_settings/options/", ["options"]);

  const handleOptions = async (model: string, data: any) => {
    await handleOption(addOptions, model, data);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const cleardData = {
      ...data,
      date: formatDate(data.date),
      supplier: data?.supplier[0],
      invoice: invoiceId,
    };

    addInvoiceItem
      .mutateAsync(cleardData)
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("invoice created successflly") && setIsOpenAdd(false);

        reset();
      })
      .catch((error) => {
        handleErrorAlerts(error?.response?.data?.error);
      });
  };

  const onSubmitEdit: SubmitHandler<Inputs> = (data) => {
    const cleardData = {
      ...data,
      date: formatDate(data.date),
      supplier: data?.supplier[0],
      invoice: invoiceId,
    };

    editInvoiceItem
      .mutateAsync(cleardData)
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("invoice updated successflly") &&
            setIsOpenEdit(false);
      })
      .catch((error) => {
        handleErrorAlerts(error?.response?.data?.error);
      });
  };

  const handleDelete = () => {
    deleteInvoiceItem
      .mutateAsync(itemDetails.id)
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("invoice deleted successflly") &&
            setIsOpenDelete(false);
      })
      .catch((error) => {
        handleErrorAlerts(error?.response?.data?.error);
      });
  };

  const calculateTotal = (data: any) => {
    if (!Array.isArray(data)) return 0;

    const totalSum = data.reduce((sum, item) => {
      console.log("item", item);
      const value = parseFloat(item.value) || 0;

      return sum + value;
    }, 0);

    return totalSum;
  };

  useEffect(() => {
    if (isOpenEdit && itemDetails) {
      reset({
        charges: itemDetails.charges || "",
        value: itemDetails.value || "",
        date: itemDetails.date || "",
        supplier: itemDetails.supplier.id || "",
      });
    }
  }, [isOpenEdit, itemDetails, reset]);

  return (
    <>
      <HStack justify="space-between" mb={6} align="center">
        <Heading as="h2" size="md" color="gray.900">
          Additional Costs
        </Heading>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={() => setIsOpenAdd(true)}
        >
          <HugeiconsIcon icon={Add01Icon} size="16px" />
          Add Cost
        </Button>
      </HStack>
      <Box overflowX="auto">
        {itemsData?.isPending ? (
          <SkeletonLoader />
        ) : (
          <DataTable data={itemsData?.data?.data} columns={columns} />
        )}
      </Box>

      <HStack justify="end">
        Total:{" "}
        {itemsData?.isPending
          ? "loading..."
          : calculateTotal(itemsData?.data?.data)}
      </HStack>

      {/* add item */}
      <CustomModal
        open={isOpenAdd}
        setOpen={setIsOpenAdd}
        title="Add additional cost"
        loading={addInvoiceItem.isPending}
        formNameId="add_additional_cost"
        actionButtonTitle="add cost"
      >
        <VStack
          id="add_additional_cost"
          as="form"
          w="full"
          gap={4}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* charges */}
          <CustomInput
            type="text"
            label="charges"
            {...register("charges")}
            errorMeassage={
              errors.charges?.message ? String(errors.charges?.message) : ""
            }
          />
          {/* charges */}
          {/* date */}
          {/* <CustomInput
            type="date"
            label="date"
            {...register("date")}
            errorMeassage={
              errors.date?.message ? String(errors.date?.message) : ""
            }
            defaultValue={getTodayDate()}
          /> */}
          <Field.Root>
            <Field.Label
              color="#6b7280"
              fontWeight="normal"
              textTransform="capitalize"
            >
              Date <Field.RequiredIndicator />
            </Field.Label>

            <Controller
              control={control}
              name="date"
              defaultValue={getTodayDate()}
              render={({ field }) => (
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
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    format="dd/MM/yyyy"
                    dayPlaceholder="d"
                    monthPlaceholder="m"
                    yearPlaceholder="y"
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </Box>
              )}
            />
          </Field.Root>
          {/* date */}

          {/* value */}
          <CustomInput
            type="number"
            label="value"
            {...register("value")}
            errorMeassage={
              errors.value?.message ? String(errors.value?.message) : ""
            }
          />
          {/* value */}
          {/* supplier */}
          <CustomSelectWithAddButtom
            name="supplier"
            model="supplier"
            addOptionFunc={handleOptions}
            data={options?.data?.data?.supplier?.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))}
            fields={[{ name: "name", type: "text", required: true }]}
            control={control}
            label="supplier"
            errorMeassage={
              errors.supplier?.message ? String(errors.supplier?.message) : ""
            }
          />
          {/* supplier */}
        </VStack>
      </CustomModal>
      {/* add item */}

      {/* edit item */}
      <CustomModal
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        title="Edit additional cost"
        loading={editInvoiceItem.isPending}
        formNameId="edit_additional_cost"
        actionButtonTitle="Edit const"
      >
        <VStack
          id="edit_additional_cost"
          as="form"
          w="full"
          gap={4}
          onSubmit={handleSubmit(onSubmitEdit)}
        >
          {/* charges */}
          <CustomInput
            type="text"
            label="charges"
            {...register("charges")}
            errorMeassage={
              errors.charges?.message ? String(errors.charges?.message) : ""
            }
          />
          {/* charges */}
          {/* date */}
          {/* <CustomInput
            type="date"
            label="date"
            {...register("date")}
            errorMeassage={
              errors.date?.message ? String(errors.date?.message) : ""
            }
          /> */}
          <Field.Root>
            <Field.Label
              color="#6b7280"
              fontWeight="normal"
              textTransform="capitalize"
            >
              Date <Field.RequiredIndicator />
            </Field.Label>

            <Controller
              control={control}
              name="date"
              render={({ field }) => (
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
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    format="dd/MM/yyyy"
                    dayPlaceholder="d"
                    monthPlaceholder="m"
                    yearPlaceholder="y"
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </Box>
              )}
            />
          </Field.Root>
          {/* date */}

          {/* value */}
          <CustomInput
            type="text"
            label="value"
            {...register("value")}
            errorMeassage={
              errors.value?.message ? String(errors.value?.message) : ""
            }
          />
          {/* value */}

          {/* supplier */}
          <CustomSelectWithAddButtom
            name="supplier"
            model="supplier"
            addOptionFunc={handleOptions}
            data={options?.data?.data?.supplier?.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))}
            fields={[{ name: "name", type: "text", required: true }]}
            control={control}
            label="supplier"
            errorMeassage={
              errors.supplier?.message ? String(errors.supplier?.message) : ""
            }
          />
          {/* supplier */}
        </VStack>
      </CustomModal>
      {/* edit item */}

      {/* delete item */}
      <CustomModal
        open={isOpenDelete}
        setOpen={setIsOpenDelete}
        title="Delete item"
        loading={deleteInvoiceItem.isPending}
        actionButtonTitle="delete item"
        actionButtonColor="red"
        actionButtonFunction={handleDelete}
      >
        are you sure you want to delete this item
      </CustomModal>
      {/* delete item */}
    </>
  );
};

export default AdditionalCosts;

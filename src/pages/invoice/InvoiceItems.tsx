import CustomInput from "@/components/core/CustomInput";
import CustomModal from "@/components/core/CustomModal";
import CustomSelectWithAddButtom from "@/components/core/CustomSelectWithAddButtom";
import DataTable from "@/components/core/DataTable";
import Loading from "@/components/core/Loading";
import SkeletonLoader from "@/components/core/SkeletonTable";
import {
  useCustomPost,
  useCustomRemove,
  useCustomUpdate,
} from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import handleOption from "@/utils/handleOptions";
import handleErrorAlerts from "@/utils/showErrorMessages";
import {
  Box,
  Button,
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
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

type Inputs = {
  charges: string;
  quntity: string;
  unit: string;
  currancy: string;
  rate: string;
  ex_rate: string;
};

const schema = yup
  .object({
    charges: yup.string().required(),
    quntity: yup.string().required(),
    unit: yup.string().required(),
    currancy: yup.string().required(),
    rate: yup.string().required(),
    ex_rate: yup.string().required(),
  })
  .required();

const InvoiceItems = ({
  invoiceId,
  canEdit,
}: {
  invoiceId: string;
  canEdit: boolean;
}) => {
  const [itemDetails, setItemDetails] = useState<any>();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const itemsData = useCustomQuery(`/invoice/items/?invoice_id=${invoiceId}`, [
    "invoice-items",
    `invoice-items-${invoiceId}`,
  ]);
  const columnHelper = createColumnHelper<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
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
    columnHelper.accessor("quntity", {
      header: () => "quntity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unit", {
      header: () => "unit",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rate", {
      header: () => "rate",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("currancy", {
      header: () => "currancy",
      cell: (info) => info.getValue().name,
    }),
    columnHelper.accessor("ex_rate", {
      header: () => "ex_rate",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("total", {
      header: () => "Total",
      cell: (info) =>
        info.row.original.quntity *
        info.row.original.rate *
        info.row.original.ex_rate,
    }),

    columnHelper.accessor("settings", {
      header: () => "Settings",
      cell: (info) => (
        <HStack gap="0">
          <IconButton
            variant="ghost"
            rounded="full"
            onClick={() => {
              setItemDetails(info.row.original);
              setIsOpenEdit(true);
            }}
            disabled={!canEdit}
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
            disabled={!canEdit}
          >
            <HugeiconsIcon icon={Delete02Icon} size="20px" />
          </IconButton>
        </HStack>
      ),
    }),
  ];

  const addInvoiceItem = useCustomPost(`invoice/items/`, ["invoice-items"]);
  const editInvoiceItem = useCustomUpdate(`invoice/items/${itemDetails?.id}/`, [
    "invoice-items",
  ]);
  const deleteInvoiceItem = useCustomRemove(
    `invoice/items/${itemDetails?.id}`,
    ["invoice-items"]
  );
  const options = useCustomQuery("client_settings/options/", ["options"]);
  const addOptions = useCustomPost("client_settings/options/", ["options"]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const cleardData = {
      ...data,
      currancy: data?.currancy[0],
      invoice: invoiceId,
    };

    addInvoiceItem
      .mutateAsync(cleardData)
      .then((res) => {
        // res.error
        console.log("res", res);
        //   ? handleErrorAlerts(res.error)
        //   : toast.success("invoice created successflly") && setIsOpenAdd(false);

        // reset();
      })
      .catch((error) => {
        handleErrorAlerts(error?.response?.data?.error);
      });
  };

  const onSubmitEdit: SubmitHandler<Inputs> = (data) => {
    const cleardData = {
      ...data,
      currancy: data?.currancy[0],
      invoice: 1,
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

  const handleOptions = async (model: string, data: any) => {
    await handleOption(addOptions, model, data);
  };

  const calculateTotal = (data: any) => {
    if (!Array.isArray(data)) return 0;

    const totalSum = data.reduce((sum, item) => {
      const quantity = parseFloat(item.quntity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const extraRate = parseFloat(item.ex_rate) || 0;

      const total = quantity * rate * extraRate;

      return sum + total;
    }, 0);

    return totalSum;
  };

  useEffect(() => {
    if (isOpenEdit && itemDetails) {
      reset({
        charges: itemDetails.charges || "",
        quntity: itemDetails.quntity || "",
        unit: itemDetails.unit || "",
        currancy: itemDetails.currancy.id || "",
        rate: itemDetails.rate || "",
        ex_rate: itemDetails.ex_rate || "",
      });
    }
  }, [isOpenEdit, itemDetails, reset]);

  const selectedCurrency = watch("currancy");

  useEffect(() => {
    if (selectedCurrency) {
      const selectedClient = selectedCurrency
        ? options?.data?.data?.currancy?.find(
            (item: any) => item.id == selectedCurrency
          )
        : null;
      setValue("ex_rate", selectedClient?.rate || "");
    } else {
      setValue("ex_rate", "");
    }
  }, [selectedCurrency]);

  return (
    <>
      <HStack justify="space-between" mb={6} align="center">
        <Heading as="h2" size="md" color="gray.900">
          Invoice Items
        </Heading>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={() => setIsOpenAdd(true)}
          disabled={!canEdit}
        >
          <HugeiconsIcon icon={Add01Icon} size="16px" />
          Add Item
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
        title="Add item"
        loading={addInvoiceItem.isPending}
        formNameId="add_invoice_item"
        actionButtonTitle="add item"
      >
        <VStack
          id="add_invoice_item"
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
          {/* quntity */}
          <CustomInput
            type="number"
            label="quntity"
            {...register("quntity")}
            errorMeassage={
              errors.quntity?.message ? String(errors.quntity?.message) : ""
            }
          />
          {/* quntity */}

          {/* unit */}
          <CustomInput
            type="text"
            label="unit"
            {...register("unit")}
            errorMeassage={
              errors.unit?.message ? String(errors.unit?.message) : ""
            }
          />
          {/* unit */}

          {/* rate */}
          <CustomInput
            type="text"
            label="rate"
            {...register("rate")}
            errorMeassage={
              errors.rate?.message ? String(errors.rate?.message) : ""
            }
            pattern="[0-9]+(\.[0-9]{0,2})?"
          />
          {/* rate */}

          {/* currancy */}
          <CustomSelectWithAddButtom
            model="currancy"
            addOptionFunc={handleOptions}
            data={options?.data?.data?.currancy?.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))}
            fields={[
              { name: "name", type: "text", required: true },
              { name: "rate", type: "number", required: true },
            ]}
            control={control}
            name="currancy"
            label="currancy"
            errorMeassage={
              errors.currancy?.message ? String(errors.currancy?.message) : ""
            }
            defaultValue={itemDetails?.currancy}
          />
          {/* currancy */}

          {/* ex_rate */}
          <CustomInput
            type="text"
            label="ex_rate"
            {...register("ex_rate")}
            errorMeassage={
              errors.ex_rate?.message ? String(errors.ex_rate?.message) : ""
            }
            pattern="[0-9]+(\.[0-9]{0,2})?"
          />
          {/* ex_rate */}
        </VStack>
      </CustomModal>
      {/* add item */}
      {/* edit item */}
      <CustomModal
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        title="Edit item"
        loading={editInvoiceItem.isPending}
        formNameId="edit_invoice_item"
        actionButtonTitle="Edit"
      >
        <VStack
          id="edit_invoice_item"
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
          {/* quntity */}
          <CustomInput
            type="number"
            label="quntity"
            {...register("quntity")}
            errorMeassage={
              errors.quntity?.message ? String(errors.quntity?.message) : ""
            }
          />
          {/* quntity */}

          {/* unit */}
          <CustomInput
            type="text"
            label="unit"
            {...register("unit")}
            errorMeassage={
              errors.unit?.message ? String(errors.unit?.message) : ""
            }
          />
          {/* unit */}

          {/* rate */}
          <CustomInput
            type="text"
            label="rate"
            {...register("rate")}
            errorMeassage={
              errors.rate?.message ? String(errors.rate?.message) : ""
            }
            pattern="[0-9]+(\.[0-9]{0,2})?"
          />
          {/* rate */}

          {/* currancy */}
          <CustomSelectWithAddButtom
            model="currancy"
            addOptionFunc={handleOptions}
            data={options?.data?.data?.currancy?.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))}
            fields={[
              { name: "name", type: "text", required: true },
              { name: "rate", type: "number", required: true },
            ]}
            control={control}
            name="currancy"
            label="currancy"
            errorMeassage={
              errors.currancy?.message ? String(errors.currancy?.message) : ""
            }
            defaultValue={itemDetails?.currancy?.id}
          />
          {/* currancy */}

          {/* ex_rate */}
          <CustomInput
            type="text"
            label="ex_rate"
            {...register("ex_rate")}
            errorMeassage={
              errors.ex_rate?.message ? String(errors.ex_rate?.message) : ""
            }
            pattern="[0-9]+(\.[0-9]{0,2})?"
          />
          {/* ex_rate */}
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
      {options.isPending ? <Loading /> : ""}
    </>
  );
};

export default InvoiceItems;

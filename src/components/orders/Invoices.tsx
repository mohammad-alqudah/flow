// import React from "react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import PageCard from "../core/PageCard";
import InvoicesCard from "../incoices/InvoicesCard";
import { useCustomPost } from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import CustomModal from "../core/CustomModal";
import { Box, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useCustomQuery } from "@/hooks/useQuery";
import * as yup from "yup";
import { useNavigate } from "react-router";
import DatePicker from "react-date-picker";
type Inputs = {
  date_issued: string;
};

const schema = yup
  .object({
    date_issued: yup.string().required(),
  })
  .required();
const Invoices = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useCustomQuery(`invoice/invoices/?file=${id}`, [
    "invoices",
  ]);
  const navigate = useNavigate();
  const addInvoice = useCustomPost("invoice/invoices/", ["invoices"]);

  const { control, handleSubmit } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addInvoice
      .mutateAsync({
        ...data,
        file: id,
      })
      .then((res) => {
        if (!res.status) {
          handleErrorAlerts(res.error);
        } else {
          toast.success("invoice created successflly");
          setOpen(false);
          navigate(`/invoices/${res?.data?.id}/view`);
        }
      })
      .catch((error) => {
        handleErrorAlerts(error.response.data.error);
      });
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageCard
        title="Invoices"
        actionButtonTitle="Add invoice"
        actionButtonFunction={() => setOpen(true)}
        actionButtonIcon={Add01Icon}
      >
        {data?.data?.map((item: any) => (
          <InvoicesCard
            key={item.id}
            name={item.date_issued}
            date={item.date}
            number={item.number}
            id={item.id}
          />
        ))}
      </PageCard>

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
          {/* <CustomInput
            type="date"
            label="Date"
            {...register("date_issued")}
            errorMeassage={
              errors.date_issued?.message
                ? String(errors.date_issued?.message)
                : ""
            }
            defaultValue={getTodayDate()}
          /> */}

          <Controller
            control={control}
            name="date_issued"
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
                  value={field.value ? field.value : new Date()}
                  format="MM/dd/yyyy"
                  dayPlaceholder="d"
                  monthPlaceholder="m"
                  yearPlaceholder="y"
                  autoFocus={false}
                  openCalendarOnFocus={false}
                />
              </Box>
            )}
          />

          {/* date */}
        </VStack>
      </CustomModal>
      {/* add bill modal */}
    </>
  );
};

export default Invoices;

// import React from "react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import PageCard from "../core/PageCard";
import InvoicesCard from "../incoices/InvoicesCard";
import { useCustomPost } from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import CustomModal from "../core/CustomModal";
import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useCustomQuery } from "@/hooks/useQuery";
import * as yup from "yup";
import CustomInput from "@/components/core/CustomInput";
import getTodayDate from "@/utils/getTodayDate";
import { useNavigate } from "react-router";
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
  const { data, isPending } = useCustomQuery(`invoice/invoices/`, ["invoices"]);
  const navigate = useNavigate();
  const addInvoice = useCustomPost("invoice/invoices/", ["invoices"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
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
          navigate("/invoices");
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

        // buttonIcon={GoogleDocIcon}
        // buttonClick={() => setOpen(true)}
        // buttonLoading={addInvoice.isPending}
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
          <CustomInput
            type="date"
            label="Date"
            {...register("date_issued")}
            errorMeassage={
              errors.date_issued?.message
                ? String(errors.date_issued?.message)
                : ""
            }
            defaultValue={getTodayDate()}
          />

          {/* date */}
        </VStack>
      </CustomModal>
      {/* add bill modal */}
    </>
  );
};

export default Invoices;

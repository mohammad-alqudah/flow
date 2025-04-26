import { VStack } from "@chakra-ui/react";
import CustomInput from "../core/CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";

import * as yup from "yup";
import { useCustomPost } from "@/hooks/useMutation";
import { yupResolver } from "@hookform/resolvers/yup";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import CustomSelectWithAddButtom from "../core/CustomSelectWithAddButtom";

const schema = yup
  .object({
    container_type: yup.array().required(),
    gross_weight: yup.string().required(),
    volume: yup.string().required(),
    number_of_packages: yup.string().required(),
    package_types: yup.array().required(),
    seal_number: yup.string().required(),
  })
  .required();

const ContainerAddModel = ({
  formNameId,
  closeModal,
  setLoading,
  orderId,
  options,
  handleOptions,
}: {
  formNameId: string;
  closeModal: (state: boolean) => void;
  setLoading?: (state: boolean) => void;
  orderId: string;
  options: any;
  handleOptions: (model: string, data: any) => void;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const addContainer = useCustomPost(`file/containers/`, ["containers"]);

  const setLoadingStatus = (state: boolean) => {
    if (setLoading) {
      setLoading(state);
    }
  };

  console.log("errors", errors);
  const onSubmit: SubmitHandler<any> = (data) => {
    setLoadingStatus(true);
    addContainer
      .mutateAsync({
        file: orderId,
        container_type: data?.container_type[0],
        gross_weight: data?.gross_weight,
        volume: data?.volume,
        number_of_packages: data?.number_of_packages,
        package_type: data?.package_types[0],
        seal_number: data?.seal_number,
      })
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("create container succes") && closeModal(false);

        setLoadingStatus(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
        setLoadingStatus(false);
      });
  };

  return (
    <VStack as="form" id={formNameId} onSubmit={handleSubmit(onSubmit)}>
      <CustomSelectWithAddButtom
        label="Container type"
        name="container_type"
        control={control}
        data={options?.data?.data?.container_types?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))}
        model="containertype"
        fields={[{ name: "name", type: "text", required: true }]}
        addOptionFunc={handleOptions}
        // defaultValue={orderData?.data?.data?.agent?.id}
        errorMeassage={
          errors?.seal_number?.message
            ? String(errors?.seal_number?.message)
            : ""
        }
      />

      <CustomInput
        type="number"
        label="Gross weight"
        {...register("gross_weight")}
        errorMeassage={
          errors?.gross_weight?.message
            ? String(errors?.gross_weight?.message)
            : ""
        }
      />

      <CustomInput
        type="number"
        label="Volume"
        {...register("volume")}
        errorMeassage={
          errors?.volume?.message ? String(errors?.volume?.message) : ""
        }
      />

      <CustomInput
        type="number"
        label="numbe of packages"
        {...register("number_of_packages")}
        errorMeassage={
          errors?.number_of_packages?.message
            ? String(errors?.number_of_packages?.message)
            : ""
        }
      />

      <CustomSelectWithAddButtom
        label="Package type"
        name="package_types"
        control={control}
        data={options?.data?.data?.package_type?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))}
        model="package_type"
        fields={[{ name: "name", type: "text", required: true }]}
        addOptionFunc={handleOptions}
        errorMeassage={
          errors?.seal_number?.message
            ? String(errors?.seal_number?.message)
            : ""
        }
        // defaultValue={orderData?.data?.data?.agent?.id}
      />

      <CustomInput
        type="text"
        label="Seal number"
        {...register("seal_number")}
        errorMeassage={
          errors?.seal_number?.message
            ? String(errors?.seal_number?.message)
            : ""
        }
      />
    </VStack>
  );
};

export default ContainerAddModel;

import { VStack } from "@chakra-ui/react";
import CustomInput from "../core/CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";

import * as yup from "yup";
import { useCustomUpdate } from "@/hooks/useMutation";
import { yupResolver } from "@hookform/resolvers/yup";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import CustomSelectWithAddButtom from "../core/CustomSelectWithAddButtom";
import { useEffect } from "react";

const schema = yup
  .object({
    container_type: yup.string(),
    gross_weight: yup.string().nullable(),
    volume: yup.string().nullable(),
    number_of_packages: yup.string().nullable(),
    package_types: yup.string(),
    seal_number: yup.string(),
    number: yup.string().required(),
  })
  .required();

const ContainerEditModel = ({
  formNameId,
  closeModal,
  setLoading,
  defaultValue,
  containerId,
  options,
  handleOptions,
}: {
  formNameId: string;
  closeModal: (state: boolean) => void;
  setLoading?: (state: boolean) => void;
  defaultValue: any;
  containerId: string | null;
  options: any;
  handleOptions: (model: string, data: any) => Promise<void>;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const updateContainer = useCustomUpdate(`file/containers/${containerId}/`, [
    "containers",
  ]);

  const setLoadingStatus = (state: boolean) => {
    if (setLoading) {
      setLoading(state);
    }
  };

  console.log("errors", errors);
  const onSubmit: SubmitHandler<any> = (data) => {
    setLoadingStatus(true);
    updateContainer
      .mutateAsync({
        container_type: data?.container_type?.[0],
        gross_weight: data?.gross_weight,
        volume: data?.volume,
        package_type: data?.package_types?.[0],
        seal_number: data?.seal_number,
        number: data?.number,
        ...(data?.number_of_packages && {
          number_of_packages: data?.number_of_packages,
        }),
      })
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("update container success") && closeModal(false);

        setLoadingStatus(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
        setLoadingStatus(false);
      });
  };

  useEffect(() => {
    if (defaultValue) {
      setValue("container_type", defaultValue?.container_type?.id);
      setValue("gross_weight", defaultValue?.gross_weight);
      setValue("volume", defaultValue?.volume);
      setValue("number_of_packages", defaultValue?.number_of_packages);
      setValue("package_types", defaultValue?.package_type?.id);
      setValue("seal_number", defaultValue?.seal_number);
      setValue("number", defaultValue?.number);
    }
  }, [defaultValue, setValue]);

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
        defaultValue={defaultValue?.id}
        errorMeassage={
          errors?.container_type?.message
            ? String(errors?.container_type?.message)
            : ""
        }
      />
      <CustomInput
        type="text"
        label="Number"
        {...register("number")}
        errorMeassage={
          errors?.number?.message ? String(errors?.number?.message) : ""
        }
      />

      <CustomInput
        type="text"
        label="Gross weight"
        {...register("gross_weight")}
        errorMeassage={
          errors?.gross_weight?.message
            ? String(errors?.gross_weight?.message)
            : ""
        }
        pattern="[0-9]+(\.[0-9]{0,2})?"
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
          errors?.package_types?.message
            ? String(errors?.package_types?.message)
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

export default ContainerEditModel;

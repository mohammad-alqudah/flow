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
    number_of_packages: yup.string().nullable(),
    package_type: yup.string().nullable(),
    gross_weight: yup.string().nullable(),
    net_weight: yup.string().nullable(),
    fimensions_length: yup.string().nullable(),
    fimensions_width: yup.string().nullable(),
    fimensions_height: yup.string().nullable(),
  })
  .required();

const PackageEditModel = ({
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

  const updateContainer = useCustomUpdate(`file/packeges/${containerId}/`, [
    "packeges",
  ]);

  const setLoadingStatus = (state: boolean) => {
    if (setLoading) {
      setLoading(state);
    }
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    setLoadingStatus(true);

    const payload = {
      ...data,
    };

    if (payload.number_of_packages === "") {
      delete payload.number_of_packages;
    }

    updateContainer
      .mutateAsync(payload)
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("update package success") && closeModal(false);

        setLoadingStatus(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
        setLoadingStatus(false);
      });
  };

  useEffect(() => {
    if (defaultValue) {
      setValue("number_of_packages", defaultValue?.number_of_packages);
      setValue("package_type", defaultValue?.package_type);
      setValue("gross_weight", defaultValue?.gross_weight);
      setValue("net_weight", defaultValue?.net_weight);
      setValue("fimensions_length", defaultValue?.fimensions_length);
      setValue("fimensions_width", defaultValue?.fimensions_width);
      setValue("fimensions_height", defaultValue?.fimensions_height);
    }
  }, [defaultValue, setValue]);

  return (
    <VStack as="form" id={formNameId} onSubmit={handleSubmit(onSubmit)}>
      <CustomSelectWithAddButtom
        label="Package type"
        name="package_type"
        control={control}
        data={options?.data?.data?.package_type?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))}
        model="containertype"
        fields={[{ name: "name", type: "text", required: true }]}
        addOptionFunc={handleOptions}
        defaultValue={defaultValue?.id}
        errorMeassage={
          errors?.package_type?.message
            ? String(errors?.package_type?.message)
            : ""
        }
      />
      <CustomInput
        type="number"
        label="Number of packages"
        {...register("number_of_packages")}
        errorMeassage={
          errors?.number_of_packages?.message
            ? String(errors?.number_of_packages?.message)
            : ""
        }
      />
      <CustomInput
        type="text"
        label="Net weight"
        {...register("net_weight")}
        errorMeassage={
          errors?.net_weight?.message ? String(errors?.net_weight?.message) : ""
        }
        pattern="[0-9]+(\.[0-9]{0,3})?"
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
        pattern="[0-9]+(\.[0-9]{0,3})?"
      />
      <CustomInput
        type="text"
        label="Fimensions length"
        {...register("fimensions_length")}
        errorMeassage={
          errors?.fimensions_length?.message
            ? String(errors?.fimensions_length?.message)
            : ""
        }
      />{" "}
      <CustomInput
        type="text"
        label="Fimensions width"
        {...register("fimensions_width")}
        errorMeassage={
          errors?.fimensions_width?.message
            ? String(errors?.fimensions_width?.message)
            : ""
        }
      />{" "}
      <CustomInput
        type="text"
        label="Fimensions height"
        {...register("fimensions_height")}
        errorMeassage={
          errors?.fimensions_height?.message
            ? String(errors?.fimensions_height?.message)
            : ""
        }
      />
    </VStack>
  );
};

export default PackageEditModel;

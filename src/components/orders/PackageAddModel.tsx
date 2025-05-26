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
    number_of_packages: yup.string(),
    package_type: yup.string(),
    gross_weight: yup.string(),
    net_weight: yup.string(),
    fimensions_length: yup.string(),
    fimensions_width: yup.string(),
    fimensions_height: yup.string(),
  })
  .required();

const PackageAddModel = ({
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
  handleOptions: (model: string, data: any) => Promise<void>;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const addPackage = useCustomPost(`file/packeges/`, ["packeges"]);

  const setLoadingStatus = (state: boolean) => {
    if (setLoading) {
      setLoading(state);
    }
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data, "data");
    setLoadingStatus(true);
    const payload = {
      file: orderId,
      ...data,
    };

    if (payload.number_of_packages === "") {
      delete payload.number_of_packages;
    }

    addPackage
      .mutateAsync(payload)
      .then((res) => {
        res.error
          ? handleErrorAlerts(res.error)
          : toast.success("create package succes") && closeModal(false);

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
        label="Package type"
        name="package_type"
        control={control}
        data={options?.data?.data?.package_type?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))}
        model="package_type"
        fields={[{ name: "name", type: "text", required: true }]}
        addOptionFunc={handleOptions}
        // defaultValue={orderData?.data?.data?.agent?.id}
        errorMeassage={
          errors?.package_type?.message
            ? String(errors?.package_type?.message)
            : ""
        }
      />

      <CustomInput
        type="number"
        label="number of packages"
        {...register("number_of_packages")}
        errorMeassage={
          errors?.number_of_packages?.message
            ? String(errors?.number_of_packages?.message)
            : ""
        }
      />

      <CustomInput
        type="number"
        label="Net weight"
        {...register("net_weight")}
        errorMeassage={
          errors?.net_weight?.message ? String(errors?.net_weight?.message) : ""
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
        label="Fimension length"
        {...register("fimensions_length")}
        errorMeassage={
          errors?.fimensions_length?.message
            ? String(errors?.fimensions_length?.message)
            : ""
        }
      />

      <CustomInput
        type="number"
        label="Fimension width"
        {...register("fimensions_width")}
        errorMeassage={
          errors?.fimensions_width?.message
            ? String(errors?.fimensions_width?.message)
            : ""
        }
      />

      <CustomInput
        type="number"
        label="Fimension height"
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

export default PackageAddModel;

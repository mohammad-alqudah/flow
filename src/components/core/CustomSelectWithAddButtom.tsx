import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import CustomModal from "./CustomModal";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CustomInput from "./CustomInput";
import formatFieldName from "@/utils/formatFieldName";
import { Field, HStack, IconButton, Text, VStack } from "@chakra-ui/react";

type DataItem = { label: string; value: string }[];

const CustomSelectWithAddButton = ({
  label,
  data,
  control,
  multiple,
  disabled,
  errorMeassage,
  name,
  fields,
  addOptionFunc,
  model,
  defaultValue,
}: {
  data: DataItem;
  label: string;
  control: any;
  multiple?: boolean;
  disabled?: boolean;
  errorMeassage?: string | undefined;
  name: string;
  fields?: any[];
  addOptionFunc: (model: string, data: any) => Promise<void>;
  model: string;
  defaultValue?: string;
}) => {
  const [openOptionsModal, setOpenOptionsModal] = useState(false);

  const defaultValues =
    fields?.reduce((acc, field) => {
      acc[field.name] = field.type === "number" ? 0 : "";
      return acc;
    }, {} as any) || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      await addOptionFunc(model, data);
      setOpenOptionsModal(false);
      reset(defaultValues);
    } catch (error) {
      console.error("Error in submission:", error);
    }
  };

  const choices = useMemo(() => {
    const options = data || [];
    return options;
  }, [data]);

  return (
    <>
      <HStack w="full">
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, value, name, ref } }) => {
            const selectedValue = multiple
              ? value?.map((val: string) =>
                  choices.find((choice) => choice.value === val)
                )
              : choices.find(
                  (choice) => String(choice.value) === String(value)
                );

            return (
              <Field.Root w="full" position="relative">
                <Field.Label color="#6b7280" fontWeight="normal">
                  {label}
                </Field.Label>
                <Select
                  ref={ref}
                  name={name}
                  options={choices}
                  value={selectedValue || (multiple ? [] : null)}
                  onChange={(val: any) => {
                    if (multiple) {
                      onChange(val ? val.map((v: any) => v.value) : []);
                    } else {
                      onChange(val ? val.value : "");
                    }
                  }}
                  className="react-select"
                  classNamePrefix="react-select"
                  isMulti={multiple}
                  isDisabled={disabled}
                />
                {disabled ? null : (
                  <IconButton
                    position="absolute"
                    right="0.5rem"
                    top="45px"
                    transform="translateY(-50%)"
                    variant="surface"
                    colorScheme="teal"
                    borderRadius="full"
                    size="2xs"
                    onClick={() => setOpenOptionsModal(true)}
                    _hover={{
                      transform: "translateY(-50%) scale(1.1)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <HugeiconsIcon icon={AddIcon} />
                  </IconButton>
                )}
                {errorMeassage && (
                  <Text color="fg.error">{formatFieldName(errorMeassage)}</Text>
                )}
              </Field.Root>
            );
          }}
        />
      </HStack>
      <CustomModal
        open={openOptionsModal}
        setOpen={setOpenOptionsModal}
        title={`Add New ${formatFieldName(name)}`}
        actionButtonTitle={`Add ${formatFieldName(name)}`}
        actionButtonFunction={() => handleSubmit(onSubmit)()}
      >
        <VStack gap="2">
          {fields?.map((el) => (
            <CustomInput
              key={el.name}
              type={el.type}
              label={formatFieldName(el.name)}
              {...register(el.name, { required: el.required })}
              errorMeassage={
                errors[el.name]?.type && String(errors[el.name]?.type)
              }
            />
          ))}
        </VStack>
      </CustomModal>
    </>
  );
};

export default CustomSelectWithAddButton;

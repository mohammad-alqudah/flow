import {
  createListCollection,
  HStack,
  IconButton,
  Portal,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomModal from "./CustomModal";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CustomInput from "./CustomInput";
import formatFieldName from "@/utils/formatFieldName";

type DataItem = { label: string; value: string }[];

const CustomSelectWithAddButtomOld = ({
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
    }, {} as FormData) || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    // addOptionFunc(model, data).then(async () => {
    //   setOpenOptionsModal(false);
    // });

    try {
      await addOptionFunc(model, data);
      setOpenOptionsModal(false);
      reset(defaultValues);
    } catch (error) {
      console.error("Error in submission:", error);
    }
  };

  const choices = useMemo(() => {
    return createListCollection({
      items: data || [],
    });
  }, [data]);

  return (
    <>
      <HStack w="full">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select.Root
              w="full"
              collection={choices}
              multiple={multiple}
              disabled={disabled}
              invalid={errorMeassage ? true : false}
              name={field.name}
              value={field.value}
              onValueChange={({ value }) => field.onChange(value)}
              onInteractOutside={() => field.onBlur()}
              defaultValue={defaultValue ? [defaultValue] : undefined}
            >
              <Select.HiddenSelect />
              <Select.Label color="#6b7280" fontWeight="normal">
                {label}
              </Select.Label>
              <Select.Control position="relative">
                <Select.Trigger>
                  <Select.ValueText placeholder={`Choose ${label}`} />
                </Select.Trigger>
                <Select.IndicatorGroup pe={disabled ? "" : "2.5rem"}>
                  {disabled ? null : (
                    <>
                      <Select.Indicator />
                      <Select.ClearTrigger />
                    </>
                  )}
                </Select.IndicatorGroup>
                {disabled ? null : (
                  <IconButton
                    position="absolute"
                    right="0.5rem"
                    top="50%"
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
              </Select.Control>
              <Portal disabled>
                <Select.Positioner>
                  <Select.Content>
                    {choices?.items.map((choice) => (
                      <Select.Item item={choice} key={choice.value}>
                        {choice.label}

                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
              {errorMeassage && <Text color="fg.error">{errorMeassage}</Text>}
            </Select.Root>
          )}
        />
      </HStack>
      <CustomModal
        open={openOptionsModal}
        setOpen={setOpenOptionsModal}
        title={`Add New ${formatFieldName(name)} `}
        actionButtonTitle={`add ${formatFieldName(name)}`}
        actionButtonFunction={() => handleSubmit(onSubmit)()}
      >
        <VStack gap="2">
          {fields?.map((el) => (
            <CustomInput
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

export default CustomSelectWithAddButtomOld;

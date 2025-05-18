"use client";

import formatFieldName from "@/utils/formatFieldName";
import { createListCollection, Portal, Select, Text } from "@chakra-ui/react";

import { useMemo } from "react";
import { Controller } from "react-hook-form";

type DataItem = { label: string; value: string }[];

const CustomSelect = ({
  label,
  data,
  control,
  multiple,
  disabled,
  errorMeassage,
  name,
}: {
  data: DataItem;
  label: string;
  control: any;
  multiple?: boolean;
  disabled?: boolean;

  errorMeassage?: string | undefined;
  name: string;
}) => {
  const choices = useMemo(() => {
    return createListCollection({
      items: data || [],
    });
  }, [data]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Select.Root
            collection={choices}
            multiple={multiple}
            disabled={disabled}
            invalid={errorMeassage ? true : false}
            name={field.name}
            value={field.value}
            onValueChange={({ value }) => field.onChange(value)}
            onInteractOutside={() => field.onBlur()}
          >
            <Select.HiddenSelect />
            <Select.Label
              color="#6b7280"
              fontWeight="normal"
              textTransform="capitalize"
            >
              {formatFieldName(label)}
            </Select.Label>

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={`Choose ${label}`} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
                <Select.ClearTrigger />
              </Select.IndicatorGroup>
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
        );
      }}
    />
  );
};

export default CustomSelect;

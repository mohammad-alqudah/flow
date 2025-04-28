import PageCard from "../core/PageCard";
import { Car03Icon } from "@hugeicons/core-free-icons";
import { Box, SimpleGrid } from "@chakra-ui/react";
import CustomInput from "../core/CustomInput";
import CustomSelectWithAddButtom from "../core/CustomSelectWithAddButtom";

const LogisticsDetails = ({
  register,
  defaultValue,
  disabled,
  control,
  options,
  handleOptions,
  errors,
}: {
  register: any;
  defaultValue: any;
  disabled?: boolean;
  control: any;
  options?: any;
  handleOptions: (model: string, data: any) => void;
  errors: any;
}) => {
  console.log("asdasdas", options);
  return (
    <>
      <PageCard title="logistics Details" icon={Car03Icon}>
        <SimpleGrid columns={2} gap={6}>
          {/* service */}
          <Box>
            <CustomSelectWithAddButtom
              label="Service"
              name="service"
              control={control}
              data={options?.data?.data?.service?.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              model="service"
              fields={[{ name: "name", type: "text", required: true }]}
              addOptionFunc={handleOptions}
              // defaultValue={orderData?.data?.data?.agent?.id}
              errorMeassage={
                errors?.seal_number?.message
                  ? String(errors?.seal_number?.message)
                  : ""
              }
              disabled={disabled}
            />
            {/* <CustomInput
              type="text"
              label="Service"
              w="full"
              mt={1}
              {...register("service")}
              defaultValue={defaultValue?.service}
              disabled={disabled}
            /> */}
          </Box>
          {/* service */}

          {/* BL Number */}
          <Box>
            <CustomInput
              type="text"
              label="BL Number"
              w="full"
              mt={1}
              {...register("bl_number")}
              defaultValue={defaultValue?.bl_number}
              disabled={disabled}
            />
          </Box>
          {/* BL Number */}

          {/* 3PL Number */}
          <Box>
            <CustomSelectWithAddButtom
              label="3PL Name"
              name="third_party_logistics_name"
              control={control}
              data={options?.data?.data?.third_party?.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              model="third_party"
              fields={[{ name: "name", type: "text", required: true }]}
              addOptionFunc={handleOptions}
              // defaultValue={defaultValue?.third_party_logistics_name}
              multiple
              disabled={disabled}
            />
            {/* <CustomInput
              type="text"
              label="3PL Name"
              w="full"
              mt={1}
              {...register("third_party_logistics_name")}
              defaultValue={defaultValue["third_party_logistics_name"]}
              disabled={disabled}
            /> */}
          </Box>
          {/* 3PL Number */}
        </SimpleGrid>
      </PageCard>
    </>
  );
};

export default LogisticsDetails;

import PageCard from "../core/PageCard";
import { AirplaneTakeOff01Icon } from "@hugeicons/core-free-icons";
import { Box, SimpleGrid } from "@chakra-ui/react";
import CustomInput from "../core/CustomInput";
import CustomSelectWithAddButtom from "../core/CustomSelectWithAddButtom";

const AirFreightDetails = ({
  register,
  defaultValue,
  control,
  options,
  handleOptions,
  errors,
}: {
  register: any;
  defaultValue: any;
  control: any;
  options: any;
  handleOptions: (model: string, data: any) => void;
  errors: any;
}) => {
  return (
    <>
      <PageCard title="Air Freight Details" icon={AirplaneTakeOff01Icon}>
        <SimpleGrid columns={2} gap={6}>
          {/* mawb_number */}
          <Box>
            <CustomInput
              type="number"
              label="MAWB number"
              w="full"
              mt={1}
              {...register("mawb_number")}
              defaultValue={defaultValue?.mawb_number}
            />
          </Box>
          {/* mawb_number */}

          {/* hawb_number */}
          <Box>
            <CustomInput
              type="number"
              label="HAWB number"
              w="full"
              mt={1}
              {...register("hawb_number")}
              defaultValue={defaultValue?.hawb_number}
            />
          </Box>
          {/* hawb_number */}

          {/* airline */}
          <Box>
            <CustomSelectWithAddButtom
              label="Air line"
              name="airline"
              control={control}
              data={options?.data?.data?.airlines?.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              model="airline"
              fields={[{ name: "name", type: "text", required: true }]}
              addOptionFunc={handleOptions}
              // defaultValue={orderData?.data?.data?.agent?.id}
              errorMeassage={
                errors?.seal_number?.message
                  ? String(errors?.seal_number?.message)
                  : ""
              }
            />
          </Box>
          {/* airline */}

          {/* gross_weight */}
          <Box>
            <CustomInput
              type="number"
              label="Gross weight"
              w="full"
              mt={1}
              {...register("gross_weight")}
              defaultValue={defaultValue?.gross_weight}
            />
          </Box>
          {/* gross_weight */}

          {/* net_weight */}
          <Box>
            <CustomInput
              type="number"
              label="Net Weight"
              w="full"
              mt={1}
              {...register("net_weight")}
              defaultValue={defaultValue?.net_weight}
            />
          </Box>
          {/* net_weight */}

          {/* volume */}
          <Box>
            <CustomInput
              type="number"
              label="Volume"
              w="full"
              mt={1}
              {...register("volume")}
              defaultValue={defaultValue?.volume}
            />
          </Box>
          {/* volume */}

          {/* chargable_weight */}
          <Box>
            <CustomInput
              type="number"
              label="Chargable Weight"
              w="full"
              mt={1}
              {...register("chargable_weight")}
              defaultValue={defaultValue?.chargable_weight}
            />
          </Box>
          {/* chargable_weight */}
        </SimpleGrid>
      </PageCard>
    </>
  );
};

export default AirFreightDetails;

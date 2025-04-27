import PageCard from "../core/PageCard";
import { Car03Icon } from "@hugeicons/core-free-icons";
import { Box, SimpleGrid } from "@chakra-ui/react";
import CustomInput from "../core/CustomInput";

const LogisticsDetails = ({
  register,
  defaultValue,
  disabled,
}: {
  register: any;
  defaultValue: any;
  disabled?: boolean;
}) => {
  return (
    <>
      <PageCard title="logistics Details" icon={Car03Icon}>
        <SimpleGrid columns={2} gap={6}>
          {/* service */}
          <Box>
            <CustomInput
              type="text"
              label="Service"
              w="full"
              mt={1}
              {...register("service")}
              defaultValue={defaultValue?.service}
              disabled={disabled}
            />
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
            <CustomInput
              type="text"
              label="3PL Number"
              w="full"
              mt={1}
              {...register("third_party_logistics_name")}
              defaultValue={defaultValue["third_party_logistics_name"]}
              disabled={disabled}
            />
          </Box>
          {/* 3PL Number */}
        </SimpleGrid>
      </PageCard>
    </>
  );
};

export default LogisticsDetails;

import PageCard from "../core/PageCard";
import { ContainerTruck02Icon } from "@hugeicons/core-free-icons";
import { Box, SimpleGrid } from "@chakra-ui/react";
import CustomInput from "../core/CustomInput";

const LandTransportDetails = ({
  register,
  defaultValue,
}: {
  register: any;
  defaultValue: any;
}) => {
  return (
    <>
      <PageCard title="Land Transport Details" icon={ContainerTruck02Icon}>
        <SimpleGrid columns={2} gap={6}>
          {/* bl_number */}
          <Box>
            <CustomInput
              type="number"
              label="BL Number"
              w="full"
              mt={1}
              {...register("bl_number")}
              defaultValue={defaultValue?.bl_number}
            />
          </Box>
          {/* bl_number */}

          {/* transporter */}
          <Box>
            <CustomInput
              type="text"
              label="transporter"
              w="full"
              mt={1}
              {...register("transporter")}
              defaultValue={defaultValue?.transporter}
            />
          </Box>
          {/* transporter */}
        </SimpleGrid>
      </PageCard>
    </>
  );
};

export default LandTransportDetails;

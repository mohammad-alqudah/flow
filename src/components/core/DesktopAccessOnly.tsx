import { HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { Monitor, TabletSmartphone } from "lucide-react";

const DesktopAccessOnly = () => {
  return (
    <VStack
      minH="100vh"
      minW="100vw"
      bg="white"
      pos="fixed"
      top={0}
      bottom={0}
      right={0}
      left={0}
      display={{ base: "flex", lg: "none" }}
      justifyContent="center"
      zIndex="max"
    >
      <Icon color="colorPalette.600">
        <Monitor size="80" />
      </Icon>
      <Text fontSize="2xl" fontWeight="bold">
        Desktop Access Only
      </Text>
      <Text color="GrayText" maxW="500px">
        This application is optimized for desktop use only. Please access it
        from a device with a larger screen for the best experience.
      </Text>
      <HStack
        mt="4"
        bg="colorPalette.subtle"
        p="4"
        rounded="lg"
        color="colorPalette.700"
      >
        Minimum screen width: 1024px
        <Icon color="colorPalette.600">
          <TabletSmartphone />
        </Icon>
      </HStack>
    </VStack>
  );
};

export default DesktopAccessOnly;

import { Outlet } from "react-router";
import Sidebar from "../components/core/Sidebar";
import DesktopAccessOnly from "@/components/core/DesktopAccessOnly";
import { Avatar, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShippingTruck01Icon } from "@hugeicons/core-free-icons";

const Layout = () => {
  return (
    <>
      {/* navbar */}
      <Flex
        p="6"
        bg="white"
        borderBottom="1px solid"
        borderBottomColor="gray.100"
        pos="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        w="full"
        h="20"
        align="center"
        justify="space-between"
      >
        <Flex align="center" gap="2">
          <Flex
            justify="center"
            align="center"
            w="13"
            h="13"
            bg="teal"
            p="3"
            rounded="xl"
            color="white"
          >
            <HugeiconsIcon icon={ShippingTruck01Icon} size="24" />
          </Flex>
          <Text fontWeight="bold" fontSize="lg">
            FreightFlow
          </Text>
        </Flex>

        <HStack>
          <Avatar.Root>
            <Avatar.Fallback name="John Doe" />
            <Avatar.Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
          </Avatar.Root>
          <VStack gap="0">
            <Text fontWeight="medium" fontSize="sm">
              John Doe
            </Text>
            <Text color="gray.500" fontSize="xs">
              Administrator
            </Text>
          </VStack>
        </HStack>
      </Flex>
      {/* navbar */}
      <Box minH="100vh" bg="#f9fafb" pt="65px">
        <Sidebar />

        <Box ms={60} p="4" bg="colorPalette.50/20" minH="100vh">
          <Box p="4" minH="100vh" borderRadius="l1">
            <Outlet />
          </Box>
        </Box>
      </Box>
      <DesktopAccessOnly />
      <Toaster />
    </>
  );
};

export default Layout;

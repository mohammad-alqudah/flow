import { Box, Button, Flex, FlexProps } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router";
import { ReactNode } from "react";
import {
  // ArrowLeftRightIcon,
  DeliveryBox01Icon,
  GoogleDocIcon,
  // Home04FreeIcons,
  // UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { removeTokens } from "@/services/auth";
import useAuth from "@/store/useAuth";

interface LinkItemProps {
  name: string;
  icon: any;
  url: string;
}

const LinkItems: Array<LinkItemProps> = [
  // { name: "Home", icon: Home04FreeIcons, url: "/" },
  { name: "Files", icon: DeliveryBox01Icon, url: "orders" },
  { name: "Invoices", icon: GoogleDocIcon, url: "invoices" },
  // { name: "Customers", icon: UserMultiple02Icon, url: "customers" },
  // { name: "Transfers", icon: ArrowLeftRightIcon, url: "transfers" },
];

interface NavItemProps extends FlexProps {
  icon: any;
  children: ReactNode;
  url: string;
}
const NavItem = ({ icon, children, url }: NavItemProps) => {
  return (
    <Box asChild py="4" p="2" _hover={{ color: "colorPalette.600" }}>
      <NavLink to={url}>
        {({ isActive }) => (
          <Box
            display="flex"
            alignItems="center"
            bg={isActive ? `colorPalette.100` : "transparent"}
            color={isActive ? "colorPalette.600" : "inherit"} // Assuming white text on active background
            borderRadius="md"
            px="5"
            py="2"
            transition="all 0.2s"
            gap={2}
          >
            {icon && <HugeiconsIcon icon={icon} fontSize="16" />}
            {children}
          </Box>
        )}
      </NavLink>
    </Box>
  );
};

function Sidebar() {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <Box
      bg={"white"}
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={60}
      pos="fixed"
      h="full"
      pt="8"
      pb="20"
      borderInlineEnd={"1px solid"}
      borderInlineEndColor={"gray.100"}
      display={"flex"}
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex flexDir="column">
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} url={link.url}>
            {link.name}
          </NavItem>
        ))}
      </Flex>
      <Button
        m="2"
        colorPalette="red"
        variant="subtle"
        onClick={() => {
          removeTokens(navigate);
          setIsAuthenticated();
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Sidebar;

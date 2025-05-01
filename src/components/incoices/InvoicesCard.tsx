import { formatDate } from "@/services/date";
import { Box, Flex, Icon, Link, Text } from "@chakra-ui/react";

const InvoicesCard = ({
  date,
  // id,
  name,
  number,
}: {
  name: string;
  date: string;
  number: string;
  id: string;
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={4}
      bg="gray.50"
      borderRadius="lg"
      _hover={{ bg: "gray.100" }}
      transition="colors"
    >
      <Flex alignItems="center" gap={3}>
        <Box p={2} bg="white" borderRadius="lg">
          <Icon
            as={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="green"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
            )}
            color="teal.600"
            boxSize={5}
          />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.900">
            {name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {formatDate(date)}
          </Text>
        </Box>
      </Flex>
      <Flex alignItems="center" gap={4}>
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="medium" color="gray.900">
            {number}
          </Text>
          {/* <Badge
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            textTransform="capitalize"
            bg="yellow.100"
            color="yellow.800"
          >
            pending
          </Badge> */}
        </Box>
        <Link
          href="/bills/INV001"
          p={2}
          color="gray.400"
          _hover={{ color: "gray.500" }}
        >
          <Icon
            as={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            )}
            boxSize={5}
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default InvoicesCard;

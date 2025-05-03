import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft01Icon, BoatIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "react-router";
import InvoiceItems from "./InvoiceItems";
import AdditionalCosts from "./AdditionalCosts";

const InvoiceDetails = () => {
  const { id } = useParams();

  const invoiceData = useCustomQuery(`/invoice/invoices/${id}`, [
    `invoice-${id}`,
  ]);

  if (invoiceData.isPending) {
    return <div>Loading...</div>;
  }
  return (
    <VStack>
      {/* page header */}
      <HStack justify="space-between" align="center" w="full" px={4} py={2}>
        {/* Left Section: Back Arrow, Title, Status, and Date */}
        <HStack gap={4} align="center">
          {/* Back Arrow */}
          <Link
            href="/invoices"
            _hover={{ color: "gray.500" }}
            color="gray.400"
          >
            <Icon
              as={() => <HugeiconsIcon icon={ArrowLeft01Icon} size="24px" />}
              boxSize={6}
            />
          </Link>

          {/* Title, Status, and Date */}
          <VStack align="start" gap={1}>
            <HStack gap={3}>
              <Text fontSize="2xl" fontWeight="semibold" color="gray.900">
                Invoice {invoiceData?.data?.data?.file?.name}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              Created on {formatDate(invoiceData?.data?.data?.date)}
            </Text>
          </VStack>
        </HStack>
      </HStack>
      {/* page header */}

      {/* invoice details */}
      <VStack gap={6} align="stretch" w="full">
        {/* Card 1: SEA FREIGHT */}
        <Card.Root p={6}>
          <Card.Body>
            <HStack gap={3} mb={6} align="center">
              <Box p={2} bg="teal.50" rounded="lg" color="teal.800">
                <HugeiconsIcon icon={BoatIcon} size="24px" />
              </Box>
              <VStack align="start" gap={0}>
                <Heading as="h2" size="md" color="gray.900">
                  SEA FREIGHT
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Type: IMPORT
                </Text>
              </VStack>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="#374151" mb={1}>
                  Invoice Date
                </Text>
                <Text color="gray.900">
                  {formatDate(invoiceData?.data?.data?.date)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Client Name
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.client?.name}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Sales
                </Text>
                <Text color="gray.900">John Doe</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Shipping Line
                </Text>
                <Text color="gray.900">Maersk</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Agent
                </Text>
                <Text color="gray.900">Global Logistics</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Port of Loading (POL)
                </Text>
                <Text color="gray.900">Shanghai</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Port of Discharge (POD)
                </Text>
                <Text color="gray.900">Dubai</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Forwarder
                </Text>
                <Text color="gray.900">Fast Freight</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Airline
                </Text>
                <Text color="gray.900">Emirates</Text>
              </Box>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {/* Card 2: Invoice Items */}
        <Card.Root p={6}>
          <Card.Body>
            <InvoiceItems invoiceId={String(id)} />
          </Card.Body>
        </Card.Root>

        {/* Card 3: Additional Costs */}
        <Card.Root p={6}>
          <Card.Body>
            <AdditionalCosts invoiceId={String(id)} />
          </Card.Body>
        </Card.Root>
      </VStack>
      {/* invoice details */}
    </VStack>
  );
};

export default InvoiceDetails;

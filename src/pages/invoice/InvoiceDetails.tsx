import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "react-router";
import InvoiceItems from "./InvoiceItems";
import AdditionalCosts from "./AdditionalCosts";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/config";
import ModeIcon from "@/utils/Mode";

const downloadPreAdvicePDF = async (id?: string) => {
  const response = await axiosInstance.get(`invoice/pdf/${id}/`, {
    responseType: "blob",
  });
  return response.data;
};

const InvoiceDetails = () => {
  const { id } = useParams();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => downloadPreAdvicePDF(id),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("error:", error);
    },
  });

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

        <Button
          colorScheme="teal"
          variant="solid"
          justifyContent="center"
          display="flex"
          alignItems="center"
          gap={2}
          onClick={() => mutate()}
          loading={isPending}
          disabled={isError}
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" x2="12" y1="15" y2="3"></line>
              </svg>
            )}
            boxSize={5}
          />
          Download invoice
        </Button>
      </HStack>
      {/* page header */}

      {/* invoice details */}
      <VStack gap={6} align="stretch" w="full">
        {/* Card 1: SEA FREIGHT */}
        <Card.Root p={6}>
          <Card.Body>
            <HStack gap={3} mb={6} align="center">
              <Box p={2} bg="teal.50" rounded="lg" color="teal.800">
                <ModeIcon mode="SeaFreight" />
              </Box>
              <VStack align="start" gap={0}>
                <Heading as="h2" size="md" color="gray.900">
                  {invoiceData?.data?.data?.file?.mode}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {invoiceData?.data?.data?.file?.type}
                </Text>
              </VStack>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="#374151" mb={1}>
                  created at
                </Text>
                <Text color="gray.900">
                  {formatDate(invoiceData?.data?.data?.date)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="#374151" mb={1}>
                  Date issued
                </Text>
                <Text color="gray.900">
                  {formatDate(invoiceData?.data?.data?.date_issued)}
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
              {/* <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Sales
                </Text>
                <Text color="gray.900">John Doe</Text>
              </Box> */}
              {/* <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Shipping Line
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.client?.name}
                </Text>
              </Box> */}
              {/* <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Agent
                </Text>
                <Text color="gray.900">Global Logistics</Text>
              </Box> */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Port of Loading (POL)
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.pol?.name}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Port of Discharge (POD)
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.pod?.name}
                </Text>
              </Box>
              {/* <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Forwarder
                </Text>
                <Text color="gray.900">Fast Freight</Text>
              </Box> */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Consignee
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.consignee?.name}
                </Text>
              </Box>{" "}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  ETA
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.eta}
                </Text>
              </Box>{" "}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  ETD
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.etd}
                </Text>
              </Box>{" "}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                  Shipper
                </Text>
                <Text color="gray.900">
                  {invoiceData?.data?.data?.file?.shipper?.name}
                </Text>
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

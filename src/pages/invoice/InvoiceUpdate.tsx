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
import {
  ArrowLeft01Icon,
  DocumentValidationIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate, useParams } from "react-router";
import InvoiceItems from "./InvoiceItems";
import AdditionalCosts from "./AdditionalCosts";
import ModeIcon from "@/utils/Mode";
import { useCustomUpdate } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import CustomInput from "@/components/core/CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

const InvoiceUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const invoiceData = useCustomQuery(`/invoice/invoices/${id}`, [
    "invoice",
    `invoice-${id}`,
  ]);

  const saveInvoice = useCustomUpdate(`/invoice/invoices/${id}/`, ["invoice"]);

  const { register, watch, setValue } = useForm({
    defaultValues: {
      number: invoiceData?.data?.data?.number,
    },
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log("Submitting data:", data);
    try {
      const res = await saveInvoice.mutateAsync(data);
      if (res.status) {
        toast.success(`Invoice updated successfully`);
      } else {
        toast.error(res.detail || "Failed to update invoice");
      }
    } catch (err) {
      console.error("Error:", err);
      handleErrorAlerts(
        (err as any).response?.data?.error || "An error occurred"
      );
    }
  };

  const debouncedSubmit = useCallback(
    debounce((data: any) => {
      if (!isInitialLoad && hasChanges) {
        console.log("Debounced submit triggered:", data);
        onSubmit(data);
        setHasChanges(false);
      }
    }, 1000),
    [isInitialLoad, hasChanges]
  );

  const formValues = watch();
  const prevFormValues = useRef(formValues);

  useEffect(() => {
    if (invoiceData.isSuccess && invoiceData?.data?.data?.number) {
      setValue("number", invoiceData.data.data.number);
      setIsInitialLoad(false);
    }
  }, [invoiceData.isSuccess, invoiceData?.data?.data?.number, setValue]);

  useEffect(() => {
    if (
      Object.keys(formValues).length > 0 &&
      JSON.stringify(formValues) !== JSON.stringify(prevFormValues.current)
    ) {
      console.log("Form values changed:", formValues);
      setHasChanges(true);
      if (!isInitialLoad) {
        debouncedSubmit(formValues);
      }
      prevFormValues.current = formValues;
    }
  }, [formValues, debouncedSubmit, isInitialLoad]);

  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  if (invoiceData.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
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

          <HStack>
            <Button onClick={() => navigate(`/invoices/${id}/view`)}>
              <HugeiconsIcon icon={DocumentValidationIcon} size="24px" />
              Save
            </Button>
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
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="#374151"
                    mb={1}
                  >
                    number
                  </Text>
                  <CustomInput
                    type="text"
                    label="Name"
                    w="full"
                    mt={1}
                    {...register("number")}
                    defaultValue={invoiceData?.data?.data?.number}
                  />
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="#374151"
                    mb={1}
                  >
                    created at
                  </Text>
                  <Text color="gray.900">
                    {formatDate(invoiceData?.data?.data?.date)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="#374151"
                    mb={1}
                  >
                    Date issued
                  </Text>
                  <Text color="gray.900">
                    {formatDate(invoiceData?.data?.data?.date_issued)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Client Name
                  </Text>
                  <Text color="gray.900">
                    {invoiceData?.data?.data?.file?.client?.name}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Port of Loading (POL)
                  </Text>
                  <Text color="gray.900">
                    {invoiceData?.data?.data?.file?.pol?.name}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Port of Discharge (POD)
                  </Text>
                  <Text color="gray.900">
                    {invoiceData?.data?.data?.file?.pod?.name}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    Consignee
                  </Text>
                  <Text color="gray.900">
                    {invoiceData?.data?.data?.file?.consignee?.name}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    ETA
                  </Text>
                  <Text color="gray.900">
                    {invoiceData?.data?.data?.file?.eta}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
                    ETD
                  </Text>
                  <Text color="gray.900">
                    {invoiceData?.data?.data?.file?.etd}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={1}
                  >
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
              <InvoiceItems
                invoiceId={String(id)}
                canEdit={
                  invoiceData?.data?.data?.jofotra_status === "not_sent"
                    ? true
                    : false
                }
              />
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
    </form>
  );
};

export default InvoiceUpdate;

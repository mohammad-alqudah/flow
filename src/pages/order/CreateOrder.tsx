import CustomInput from "@/components/core/CustomInput";
import CustomSelectWithAddButtom from "@/components/core/CustomSelectWithAddButtom";
import PageCard from "@/components/core/PageCard";
import PageHeader from "@/components/core/PageHeader";
import AirFreightDetails from "@/components/orders/AirFreightDetails";
import Invoices from "@/components/orders/Invoices";
import LandTransportDetails from "@/components/orders/LandTransportDetails";
import LogisticsDetails from "@/components/orders/LogisticsDetails";
import SeaFreightDetails from "@/components/orders/SeaFreightDetails";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import handleErrorAlerts from "@/utils/showErrorMessages";
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  AirplaneTakeOff01Icon,
  BoatIcon,
  Calendar02Icon,
  Cancel01Icon,
  Car03Icon,
  ContainerTruck02Icon,
  FloppyDiskIcon,
  GoogleDocIcon,
  Location01Icon,
  UserMultiple02Icon,
  WorkIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { debounce } from "lodash";
const CreateOrder = () => {
  const [loading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const freight_type = (
    ["SeaFreight", "AirFreight", "LandTransport", "Logistics"] as const
  ).includes(searchParams.get("freight_type") as any)
    ? (searchParams.get("freight_type") as
        | "SeaFreight"
        | "AirFreight"
        | "LandTransport"
        | "Logistics")
    : null;
  const date = searchParams.get("date");

  const orderData = useCustomQuery(`/file/files/${id}`, [
    "order",
    `order-${id}`,
  ]);

  const {
    control,
    register,
    // handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<any>({});

  const saveOrder = useCustomUpdate(`file/files/${id}/`, ["orders"]);
  const addOptions = useCustomPost("client_settings/options/", ["options"]);

  const options = useCustomQuery("client_settings/options/", ["options"]);

  const handleOptions = (model: string, data: any) => {
    console.log(model, data, "///");
    addOptions
      .mutateAsync({
        model,
        ...data,
      })
      .then((res) => {
        if (res.status) {
          toast.success(`${data.name} created successfully`);
        } else {
          handleErrorAlerts(res.error);
        }
      })
      .catch((err) => {
        handleErrorAlerts(err.response.data.error);
      });
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("data", data);

    const removeEmptyStrings = (
      obj: Record<string, any>
    ): Record<string, any> => {
      const cleanedObj: Record<string, any> = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (key === "third_party_logistics_name") {
          cleanedObj[key] = value;
          return;
        }

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return;
          } else {
            cleanedObj[key] = value[0];
          }
        } else if (value !== "" && value !== undefined) {
          cleanedObj[key] = value;
        }
      });
      return cleanedObj;
    };

    const cleanedData = removeEmptyStrings(data);

    setIsLoading(true);
    saveOrder
      .mutateAsync(cleanedData)
      .then(async (res) => {
        if (res.status) {
          toast.success(`order updated successfully`);
        } else {
          toast.error(res.detail);
        }
      })
      .catch((err) => {
        handleErrorAlerts(err.response.data.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  function ModeIcon({
    mode,
  }: {
    mode: "SeaFreight" | "AirFreight" | "LandTransport" | "Logistics";
  }) {
    switch (mode) {
      case "SeaFreight":
        return <HugeiconsIcon icon={BoatIcon} size="24px" />;
      case "AirFreight":
        return <HugeiconsIcon icon={AirplaneTakeOff01Icon} size="24px" />;
      case "LandTransport":
        return <HugeiconsIcon icon={ContainerTruck02Icon} size="24px" />;
      case "Logistics":
        return <HugeiconsIcon icon={Car03Icon} size="24px" />;
    }
  }

  useEffect(() => {
    setValue("client", [orderData?.data?.data?.client?.id]);
    setValue("shipper", [orderData?.data?.data?.shipper?.id]);
    setValue("consignee", [orderData?.data?.data?.consignee?.id]);
    setValue("pol", [orderData?.data?.data?.pol?.id]);
    setValue("pod", [orderData?.data?.data?.pod?.id]);
    setValue("pol_country", [orderData?.data?.data?.pol_country?.id]);
    setValue("pod_country", [orderData?.data?.data?.pod_country?.id]);
    setValue("clearing_agent", [orderData?.data?.data?.clearing_agent?.id]);
    setValue("agent", [orderData?.data?.data?.agent?.id]);
    setValue("network", [orderData?.data?.data?.network?.id]);
    setValue("final_destination", [
      orderData?.data?.data?.final_destination?.id,
    ]);
    // logistics
    setValue("service", [orderData?.data?.data?.service]);
    setValue("bl_number", orderData?.data?.data?.bl_number);
    setValue(
      "third_party_logistics_name",
      orderData?.data?.data?.third_party_logistics_name
    );
    // airfreight
    setValue("mawb_number", orderData?.data?.data?.hawb_number);
    setValue("hawb_number", orderData?.data?.data?.hawb_number);
    setValue("airline", [orderData?.data?.data?.airline?.id]);
    setValue("gross_weight", orderData?.data?.data?.gross_weight);
    setValue("net_weight", orderData?.data?.data?.net_weight);
    setValue("volume", orderData?.data?.data?.volume);
    setValue("chargable_weight", orderData?.data?.data?.chargable_weight);
    //land
    setValue("transporter", orderData?.data?.data?.transporter);
    //sea
    setValue("shipping_line", [orderData?.data?.data?.shipping_line]);
  }, [orderData?.data?.data]);

  const selectedClientId = watch("client")?.[0];
  const selectedShipperId = watch("shipper")?.[0];
  const selectedConsigneeId = watch("consignee")?.[0];
  const selectedClearingAgentId = watch("clearing_agent")?.[0];
  useEffect(() => {
    if (selectedClientId) {
      const selectedClient = selectedClientId
        ? options?.data?.data?.second_parties?.find(
            (item: any) => item.id == selectedClientId
          )
        : null;
      setValue("client_tax", selectedClient?.tax || "");
    } else {
      setValue("client_tax", "");
    }

    if (selectedShipperId) {
      const selectedShipper = selectedShipperId
        ? options?.data?.data?.second_parties?.find(
            (item: any) => item.id == selectedShipperId
          )
        : null;
      setValue("shipper_tax", selectedShipper?.tax || "");
    } else {
      setValue("shipper_tax", "");
    }

    if (selectedConsigneeId) {
      const selectedConsignee = selectedConsigneeId
        ? options?.data?.data?.second_parties?.find(
            (item: any) => item.id == selectedConsigneeId
          )
        : null;
      setValue("consignee_tax", selectedConsignee?.tax || "");
    } else {
      setValue("consignee_tax", "");
    }

    if (selectedClearingAgentId) {
      const selectedClearingAgen = selectedClearingAgentId
        ? options?.data?.data?.second_parties?.find(
            (item: any) => item.id == selectedClearingAgentId
          )
        : null;
      setValue("clearing_agent_code", selectedClearingAgen?.tax || "");
    } else {
      setValue("clearing_agent_code", "");
    }
  }, [
    selectedClientId,
    selectedShipperId,
    selectedConsigneeId,
    selectedClearingAgentId,
  ]);

  // auto save
  const formValues = watch();
  const prevFormValues = useRef(formValues);

  const debouncedSubmit = useCallback(
    debounce((data: any) => {
      if (!isInitialLoad) {
        console.log("Submitting", data);
        onSubmit(data);
      }
    }, 1000),
    [isInitialLoad]
  );
  useEffect(() => {
    if (
      Object.keys(formValues).length > 0 &&
      JSON.stringify(formValues) !== JSON.stringify(prevFormValues.current)
    ) {
      debouncedSubmit(formValues);
      prevFormValues.current = formValues;
    }
  }, [formValues, debouncedSubmit]);

  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, []);
  useEffect(() => {
    if (orderData?.data?.data) {
      const timeout = setTimeout(() => {
        setIsInitialLoad(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [orderData?.data?.data]);
  if (!id || !name || !type || !freight_type || !date) {
    toast.error("Missing required parameters");

    navigate("/orders", {
      replace: true,
    });

    return null;
  }

  if (options.isPending || orderData.isPending) {
    return (
      <Box>
        <PageHeader
          title="Loading..."
          description="Please wait while we load the data"
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* page header */}
      <HStack justifyContent="space-between" alignItems="center" mb="6">
        <VStack alignItems="flex-start" gap={0}>
          <HStack gap={2} align="center">
            <Text
              fontWeight="medium"
              fontSize="x-large"
              textTransform={"uppercase"}
            >
              {orderData?.data?.data?.name}
            </Text>
          </HStack>

          <Text color="GrayText">
            Created on {formatDate(orderData?.data?.data?.created_at)}
          </Text>
        </VStack>

        <HStack gap={2}>
          <Button
            colorPalette="gray"
            variant="outline"
            size="sm"
            loading={loading}
            loadingText="Loading..."
            onClick={() => {
              navigate({
                pathname: `/orders/${id}/view`,
                search: `?name=${name}&type=${type}&freight_type=${freight_type}&date=${date}`,
              });
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
            cancel
          </Button>
          <Button
            size="sm"
            loading={loading}
            loadingText="Loading..."
            onClick={() => {
              navigate({
                pathname: `/orders/${id}/view`,
                search: `?name=${name}&type=${type}&freight_type=${freight_type}&date=${date}`,
              });
            }}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} />
            Save Changes
          </Button>
        </HStack>
      </HStack>
      {/* page header */}

      <HStack w="full" align="start" gap="6">
        {/* left side */}
        <VStack w="2/3" align="start">
          {/* Basic Information */}
          <PageCard>
            <Box>
              <Flex alignItems="center" gap={3} mb={6}>
                <Box p={2} bg="teal.50" borderRadius="lg">
                  <ModeIcon mode={freight_type} />
                </Box>
                <Box>
                  <Heading as="h2" size="md" color="gray.900">
                    Basic Information
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {freight_type.toUpperCase()} FREIGHT - {type.toUpperCase()}
                  </Text>
                </Box>
              </Flex>
              <SimpleGrid columns={2} gap={6}>
                <CustomInput
                  type="text"
                  label="Declaration Number"
                  {...register("declaration_number")}
                  defaultValue={orderData?.data?.data?.declaration_number}
                />
                <CustomInput
                  type="text"
                  label="Reference Number"
                  {...register("reference_number")}
                />
              </SimpleGrid>
            </Box>
          </PageCard>
          {/* Basic Information */}

          {/* Parties */}
          <PageCard title="Parties" icon={UserMultiple02Icon}>
            <SimpleGrid columns={2} gap={4}>
              {/* Client */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                >
                  Client
                </Heading>
                <VStack gap="2">
                  {/* <CustomInput type="text" label="Name" w="full" mt={1} /> */}
                  <CustomSelectWithAddButtom
                    label="Name"
                    name="client"
                    control={control}
                    data={options?.data?.data?.second_parties?.map(
                      (item: any) => ({
                        label: item.name,
                        value: item.id,
                      })
                    )}
                    model="secondparty"
                    fields={[
                      { name: "name", type: "text", required: true },
                      { name: "mobile_number", type: "text", required: true },
                      { name: "email", type: "text", required: true },
                      { name: "tax", type: "number", required: true },
                      { name: "address", type: "text", required: true },
                    ]}
                    addOptionFunc={handleOptions}
                    defaultValue={orderData?.data?.data?.client?.id}
                  />
                  <CustomInput
                    type="text"
                    label="Tax Number"
                    w="full"
                    mt={1}
                    disabled
                    defaultValue={orderData?.data?.data?.client?.tax}
                    {...register("client_tax")}
                  />
                </VStack>
              </Box>
              {/* Client */}
              {/* Shipper */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                >
                  Shipper
                </Heading>
                <VStack gap="2">
                  {/* <CustomInput type="text" label="Name" w="full" mt={1} /> */}
                  <CustomSelectWithAddButtom
                    label="Name"
                    name="shipper"
                    control={control}
                    data={options?.data?.data?.second_parties?.map(
                      (item: any) => ({
                        label: item.name,
                        value: item.id,
                      })
                    )}
                    model="secondparty"
                    fields={[
                      { name: "name", type: "text", required: true },
                      { name: "mobile_number", type: "text", required: true },
                      { name: "email", type: "text", required: true },
                      { name: "tax", type: "number", required: true },
                      { name: "address", type: "text", required: true },
                    ]}
                    addOptionFunc={handleOptions}
                    defaultValue={orderData?.data?.data?.shipper?.id}
                  />
                  <CustomInput
                    type="text"
                    label="Tax Number"
                    w="full"
                    mt={1}
                    disabled
                    defaultValue={orderData?.data?.data?.shipper?.tax}
                    {...register("shipper_tax")}
                  />
                </VStack>
              </Box>
              {/* Shipper */}
              {/* Consignee  */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                >
                  Consignee
                </Heading>
                <VStack gap="2">
                  {/* <CustomInput type="text" label="Name" w="full" mt={1} /> */}
                  <CustomSelectWithAddButtom
                    label="Name"
                    name="consignee"
                    control={control}
                    data={options?.data?.data?.second_parties?.map(
                      (item: any) => ({
                        label: item.name,
                        value: item.id,
                      })
                    )}
                    model="secondparty"
                    fields={[
                      { name: "name", type: "text", required: true },
                      { name: "mobile_number", type: "text", required: true },
                      { name: "email", type: "text", required: true },
                      { name: "tax", type: "number", required: true },
                      { name: "address", type: "text", required: true },
                    ]}
                    addOptionFunc={handleOptions}
                    defaultValue={orderData?.data?.data?.consignee?.id}
                  />
                  <CustomInput
                    type="text"
                    label="Tax number"
                    w="full"
                    mt={1}
                    disabled
                    defaultValue={orderData?.data?.data?.consignee?.tax}
                    {...register("consignee_tax")}
                  />
                </VStack>
              </Box>
              {/* Consignee  */}
              {/* Notify */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                >
                  Notify
                </Heading>
                <VStack gap="2">
                  <CustomInput
                    type="text"
                    label="Name"
                    w="full"
                    mt={1}
                    {...register("notify")}
                    defaultValue={orderData?.data?.data?.notify}
                  />
                </VStack>
              </Box>
              {/* Notify */}
            </SimpleGrid>
          </PageCard>
          {/* Parties */}

          {/* Locations */}
          <PageCard title="Locations" icon={Location01Icon}>
            <SimpleGrid columns={2} gap={6}>
              {/* Port of Loading */}
              <Box>
                <CustomSelectWithAddButtom
                  label="Port of Loading"
                  name="pol"
                  control={control}
                  data={options?.data?.data?.ports?.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  model="ports"
                  fields={[{ name: "name", type: "text", required: true }]}
                  addOptionFunc={handleOptions}
                  defaultValue={orderData?.data?.data?.pol?.id}
                />
              </Box>
              {/* Port of Loading */}
              {/* POL Country */}
              <Box>
                {/* <CustomInput type="text" label="POL Country" w="full" mt={1} /> */}
                <CustomSelectWithAddButtom
                  label="POL Country"
                  name="pol_country"
                  control={control}
                  data={options?.data?.data?.countries?.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  model="country"
                  fields={[{ name: "name", type: "text", required: true }]}
                  addOptionFunc={handleOptions}
                  defaultValue={orderData?.data?.data?.pol_country?.id}
                />
              </Box>
              {/* POL Country */}
              {/* Port of Discharge  */}
              <Box>
                <CustomSelectWithAddButtom
                  label="Port of Discharge"
                  name="pod"
                  control={control}
                  data={options?.data?.data?.ports?.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  model="ports"
                  fields={[{ name: "name", type: "text", required: true }]}
                  addOptionFunc={handleOptions}
                  defaultValue={orderData?.data?.data?.pod?.id}
                />
              </Box>
              {/* Port of Discharge  */}
              {/* POD Country */}
              <Box>
                {/* <CustomInput type="text" label="POD Country" w="full" mt={1} /> */}
                <CustomSelectWithAddButtom
                  label="POD Country"
                  name="pod_country"
                  control={control}
                  data={options?.data?.data?.countries?.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  model="country"
                  fields={[{ name: "name", type: "text", required: true }]}
                  addOptionFunc={handleOptions}
                  defaultValue={orderData?.data?.data?.pod_country?.id}
                />
              </Box>
              {/* POD Country */}
              {/* Final Destination */}
              <Box>
                <CustomSelectWithAddButtom
                  label="Final Destination"
                  name="final_destination"
                  control={control}
                  data={options?.data?.data?.final_destination?.map(
                    (item: any) => ({
                      label: item.name,
                      value: item.id,
                    })
                  )}
                  model="final_destination"
                  fields={[{ name: "name", type: "text", required: true }]}
                  addOptionFunc={handleOptions}
                  // defaultValue={orderData?.data?.data?.agent?.id}
                  // errorMeassage={
                  //   errors?.seal_number?.message
                  //     ? String(errors?.seal_number?.message)
                  //     : ""
                  // }
                />
                {/* <CustomInput
                  type="text"
                  label="Final Destination"
                  w="full"
                  mt={1}
                  {...register("final_destination")}
                  defaultValue={orderData?.data?.data?.final_destination}
                /> */}
              </Box>
              {/* Final Destination */}
            </SimpleGrid>
          </PageCard>
          {/* Locations */}

          {/* Dates */}
          <PageCard title="Dates" icon={Calendar02Icon}>
            <SimpleGrid columns={2} gap={6}>
              {/* ETD */}
              <Box>
                <CustomInput
                  type="date"
                  label="ETD"
                  w="full"
                  mt={1}
                  {...register("etd")}
                  defaultValue={orderData?.data?.data?.etd}
                />
              </Box>
              {/* ETD */}
              {/* ETA */}
              <Box>
                <CustomInput
                  type="date"
                  label="ETA"
                  w="full"
                  mt={1}
                  {...register("eta")}
                  defaultValue={orderData?.data?.data?.eta}
                />
              </Box>
              {/* ETA */}
            </SimpleGrid>
          </PageCard>
          {/* Dates */}

          {orderData?.data?.data?.mode === "AirFreight" ? (
            <AirFreightDetails
              register={register}
              defaultValue={orderData?.data?.data}
              control={control}
              options={options}
              handleOptions={handleOptions}
              errors={errors}
            />
          ) : orderData?.data?.data?.mode === "LandTransport" ? (
            <LandTransportDetails
              register={register}
              defaultValue={orderData?.data?.data}
            />
          ) : orderData?.data?.data?.mode === "Logistics" ? (
            <LogisticsDetails
              register={register}
              defaultValue={orderData?.data?.data}
              control={control}
              options={options}
              handleOptions={handleOptions}
              errors={errors}
            />
          ) : (
            <SeaFreightDetails
              register={register}
              defaultValue={orderData?.data?.data}
              control={control}
              options={options}
              handleOptions={handleOptions}
            />
          )}

          {/* Description */}
          <PageCard title="Description" icon={GoogleDocIcon}>
            <Field.Root>
              <Field.Label>
                Description of Goods
                <Field.RequiredIndicator />
              </Field.Label>
              <Textarea
                placeholder="Start typing..."
                {...register("description_of_goods")}
                defaultValue={orderData?.data?.data?.description_of_goods}
              />
            </Field.Root>
          </PageCard>
          {/* Description */}

          {/* Agents */}
          <PageCard title="Agents" icon={WorkIcon}>
            <SimpleGrid columns={2} gap={4}>
              {/* Agent */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                >
                  Agent
                </Heading>
                <VStack gap="2">
                  <CustomSelectWithAddButtom
                    label="Name"
                    name="agent"
                    control={control}
                    data={options?.data?.data?.agents1?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    model="agent1"
                    fields={[{ name: "name", type: "text", required: true }]}
                    addOptionFunc={handleOptions}
                    defaultValue={orderData?.data?.data?.agent?.id}
                  />
                </VStack>
              </Box>
              {/* Agent */}
              {/* Network  */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                >
                  Network
                </Heading>
                <VStack gap="2">
                  {/* <CustomInput type="text" label="Name" w="full" mt={1} /> */}
                  <CustomSelectWithAddButtom
                    label="Name"
                    name="network"
                    control={control}
                    data={options?.data?.data?.networks?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    model="network"
                    fields={[{ name: "name", type: "text", required: true }]}
                    addOptionFunc={handleOptions}
                    defaultValue={orderData?.data?.data?.network?.id}
                  />
                </VStack>
              </Box>
              {/* Network  */}

              {/* Clearing Agent */}
              <Box>
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                >
                  Clearing Agent
                </Heading>
                <VStack gap="2">
                  {/* <CustomInput type="text" label="Name" w="full" mt={1} /> */}
                  <CustomSelectWithAddButtom
                    label="Name"
                    name="clearing_agent"
                    control={control}
                    data={options?.data?.data?.agents?.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    model="agent"
                    fields={[
                      { name: "name", type: "text", required: true },
                      { name: "code", type: "number", required: true },
                    ]}
                    addOptionFunc={handleOptions}
                    defaultValue={orderData?.data?.data?.clearing_agent?.id}
                  />
                </VStack>
              </Box>

              <Box>
                {/* hide title */}
                <Heading
                  as="h3"
                  size="sm"
                  fontWeight="medium"
                  color="gray.900"
                  mb={4}
                  visibility="hidden"
                >
                  Clearing Agent code
                </Heading>
                {/* hide title */}

                <CustomInput
                  type="text"
                  label="Code"
                  w="full"
                  mt={1}
                  disabled
                  defaultValue={orderData?.data?.data?.clearing_agent?.code}
                  {...register("clearing_agent_code")}
                />
              </Box>
              {/* Clearing Agent */}
            </SimpleGrid>
          </PageCard>
          {/* Agents */}
        </VStack>
        {/* left side */}

        {/* right side */}
        <VStack w="1/3" gap="6">
          <Invoices id={id} />

          <PageCard title="Documents">
            {["index", "cover letter", "Pre-advice", "arrival notes"].map(
              (item) => (
                <Button
                  key={item}
                  w="full"
                  justifyContent="center"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  color="gray.700"
                  _hover={{ bg: "gray.50" }}
                  display="flex"
                  alignItems="center"
                  gap={2}
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
                  Download {item}
                </Button>
              )
            )}
          </PageCard>
        </VStack>
        {/* right side */}
      </HStack>
    </Box>
  );
};

export default CreateOrder;

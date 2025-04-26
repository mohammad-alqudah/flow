import { InputGroup } from "@/components/ui/input-group";
import { useCustomPost } from "@/hooks/useMutation";
import { storeTokens } from "@/services/auth";
import useAuth from "@/store/useAuth";
import { LoginInputs } from "@/types/LoginPage";
import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockPasswordIcon,
  Mail01Icon,
  ShippingTruck01Icon,
} from "@hugeicons/core-free-icons";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const { mutateAsync } = useCustomPost("user/login/");

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    setIsLoading(true);
    mutateAsync(data)
      .then(async (res) => {
        if (res.status) {
          await storeTokens(
            res.data.tokens.access,
            navigate,
            setIsAuthenticated
          );
        } else {
          setError(res.error);
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box minH="100vh" bg="#f9fafb" display="flex">
      {/* cover */}
      <Box
        bg="#319795"
        minH="full"
        w="1/2"
        p="20"
        color="white"
        display={{ base: "none", md: "flex" }}
        justifyContent="center"
        alignItems="center"
        gap={8}
        flexDir="column"
      >
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Freight logistics"
          borderRadius="lg"
          boxShadow="xl"
        />
        <Box color="white" textAlign="left">
          <Heading as="h2" size="3xl" mb={4}>
            Global Freight Solutions
          </Heading>
          <Text color="teal.50">
            Streamline your logistics operations with our comprehensive freight
            forwarding platform. Track shipments, manage documents, and optimize
            your supply chain all in one place.
          </Text>
        </Box>
      </Box>
      {/* cover */}

      {/* form */}
      <Box
        w={{ base: "full", md: "1/2" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full" maxW="448px">
          <VStack bg="white" shadow="xs" w="full" p="8" rounded="md" gap="6">
            {/* logo */}
            <HStack bg="teal" p="4" rounded="xl" color="white">
              <HugeiconsIcon icon={ShippingTruck01Icon} size="30" />
            </HStack>
            {/* logo */}

            <VStack mt="4">
              <Text fontWeight="bolder" fontSize="3xl">
                Welcome back
              </Text>
              <Text color="gray" fontSize="medium">
                Sign in to your freight forwarding portal
              </Text>
            </VStack>

            {error && (
              <Alert.Root status="error" mb="6" mt="8">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            {/* store url */}
            <Field.Root
              required
              invalid={errors?.email?.type === "required" ? true : false}
            >
              <Field.Label>
                Email Address
                <Field.RequiredIndicator />
              </Field.Label>
              <InputGroup
                startElement={<HugeiconsIcon icon={Mail01Icon} size="20" />}
                w="full"
              >
                <Input
                  {...register("email", { required: true })}
                  placeholder="you@example.com"
                />
              </InputGroup>
            </Field.Root>
            {/* store url */}

            {/* user name */}
            <Field.Root
              required
              invalid={errors?.password?.type === "required" ? true : false}
            >
              <Field.Label>
                Password
                <Field.RequiredIndicator />
              </Field.Label>
              <InputGroup
                startElement={
                  <HugeiconsIcon icon={LockPasswordIcon} size="20" />
                }
                w="full"
              >
                <Input
                  type="password"
                  {...register("password", { required: true })}
                  placeholder=".........."
                />
              </InputGroup>
            </Field.Root>
            {/* user name */}

            {/* user name */}
            {/* <Field.Root
              required
              invalid={
                errors?.company_domian?.type === "required" ? true : false
              }
            >
              <Field.Label>
                Company Domain
                <Field.RequiredIndicator />
              </Field.Label>
              <InputGroup
                startElement={<HugeiconsIcon icon={House01Icon} size="20" />}
                w="full"
              >
                <Input
                  type="text"
                  {...register("company_domian", { required: true })}
                  placeholder="company.domain"
                />
              </InputGroup>
            </Field.Root> */}
            {/* user name */}

            {/* login */}
            <Button w="full" type="submit" loading={isLoading}>
              Sign in to your account
            </Button>
            {/* login */}

            <Text color="gray" fontSize="small">
              Protected by industry-leading security protocols
            </Text>
          </VStack>
        </Box>
      </Box>
      {/* form */}
    </Box>
  );
};

export default LoginPage;

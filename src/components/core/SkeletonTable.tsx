import { Skeleton, VStack, HStack } from "@chakra-ui/react";

const SkeletonLoader = () => {
  return (
    <VStack w="full" gap={4} mt="8">
      <VStack w="full" gap={3}>
        <HStack w="full" gap={4} bg="gray.50" p={4} borderRadius="md">
          <Skeleton height="50px" width="50px" borderRadius="full" />{" "}
          {/* صورة أو أيقونة */}
          <VStack align="start" flex={1} gap={2}>
            <Skeleton height="20px" width="70%" />
            <Skeleton height="15px" width="40%" />
          </VStack>
        </HStack>

        <HStack w="full" gap={4} bg="gray.50" p={4} borderRadius="md">
          <Skeleton height="50px" width="50px" borderRadius="full" />
          <VStack align="start" flex={1} gap={2}>
            <Skeleton height="20px" width="60%" />
            <Skeleton height="15px" width="50%" />
          </VStack>
        </HStack>

        <HStack w="full" gap={4} bg="gray.50" p={4} borderRadius="md">
          <Skeleton height="50px" width="50px" borderRadius="full" />
          <VStack align="start" flex={1} gap={2}>
            <Skeleton height="20px" width="80%" />
            <Skeleton height="15px" width="30%" />
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default SkeletonLoader;

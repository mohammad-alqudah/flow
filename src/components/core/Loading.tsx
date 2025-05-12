import { Box, Loader } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Box
      minH="100vh"
      w="full"
      position="fixed"
      inset={0}
      bg="#80808080"
      zIndex="max"
    >
      <Loader fontSize="4xl" />
    </Box>
  );
};

export default Loading;

import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { HugeiconsIcon } from "@hugeicons/react";

const PageCard = ({
  children,
  icon,
  title,
  actionButtonTitle,
  actionButtonFunction,
  actionButtonIcon,
}: {
  children: React.ReactNode;
  icon?: any;
  title?: string;
  actionButtonTitle?: string;
  actionButtonFunction?: () => void;
  actionButtonIcon?: any;
}) => {
  return (
    <Box w="full" shadow="xs" p="6" bg="white" rounded="lg">
      {title || actionButtonFunction ? (
        <HStack justify="space-between" align="center" mb="4">
          {title && (
            <Heading
              as="h6"
              size="md"
              fontWeight="medium"
              display="flex"
              gap="2"
              alignItems="center"
            >
              {icon && (
                <Box p={2} bg="teal.50" borderRadius="lg" color="teal.800">
                  <HugeiconsIcon icon={icon} />
                </Box>
              )}
              {title}
            </Heading>
          )}
          {actionButtonFunction && actionButtonTitle && (
            <Button size="xs" onClick={actionButtonFunction}>
              {actionButtonIcon && <HugeiconsIcon icon={actionButtonIcon} />}
              {actionButtonTitle}
            </Button>
          )}
        </HStack>
      ) : (
        ""
      )}
      <Box display="flex" flexDirection="column" gap={4}>
        {children}
      </Box>
    </Box>
  );
};

export default PageCard;

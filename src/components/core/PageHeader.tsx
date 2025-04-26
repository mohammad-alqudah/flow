import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";

const PageHeader = ({
  title,
  description,
  buttonClick,
  buttonTitle,
  buttonIcon,
  buttonLoading,
}: {
  title: string;
  description?: string;
  buttonClick?: () => void;
  buttonTitle?: string;
  buttonIcon?: IconSvgElement;
  buttonLoading?: boolean;
  buttonDisabled?: boolean;
}) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" mb="6">
      <VStack alignItems="flex-start" gap={0}>
        <Text fontWeight="medium" fontSize="x-large">
          {title}
        </Text>
        {description && <Text color="GrayText">{description}</Text>}
      </VStack>

      {buttonClick && (
        <Button
          size="sm"
          loading={buttonLoading}
          loadingText="Loading..."
          onClick={buttonClick}
        >
          {buttonIcon && <HugeiconsIcon icon={buttonIcon} />}
          {buttonTitle}
        </Button>
      )}
    </HStack>
  );
};

export default PageHeader;

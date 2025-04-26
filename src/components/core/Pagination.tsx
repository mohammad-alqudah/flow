// import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Flex, Button, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  count: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  hasNext,
  hasPrevious,
  onPageChange,
  count,
}: PaginationProps) {
  const totalPages = Math.ceil(count / 15);
  const activeColor = "#67B37D";
  const hoverBg = "gray.100";

  const generatePageNumbers = () => {
    const pages = [];
    const range = 2;

    for (let i = currentPage - range; i < currentPage; i++) {
      if (i > 0) pages.push(i);
    }

    pages.push(currentPage);

    for (let i = currentPage + 1; i <= currentPage + range; i++) {
      if (i <= totalPages) pages.push(i);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <Flex align="center" justify="center" gap={2} mt={6}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        p={2}
        borderRadius="lg"
        _hover={{ bg: hoverBg }}
        opacity={!hasPrevious ? 0.5 : 1}
        cursor={!hasPrevious ? "not-allowed" : "pointer"}
        variant="ghost"
      >
        {" "}
        <ChevronLeftIcon size={5} />
      </Button>

      {pages[0] > 1 && (
        <>
          <Button
            onClick={() => onPageChange(1)}
            px={3}
            py={1}
            borderRadius="lg"
            bg={1 === currentPage ? activeColor : "transparent"}
            color={1 === currentPage ? "white" : undefined}
            _hover={{ bg: 1 === currentPage ? activeColor : hoverBg }}
            variant={1 === currentPage ? "solid" : "ghost"}
          >
            1
          </Button>
          {pages[0] > 2 && (
            <Text px={3} py={1}>
              ٠٠٠
            </Text>
          )}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          px={3}
          py={1}
          borderRadius="lg"
          bg={page === currentPage ? activeColor : "transparent"}
          color={page === currentPage ? "white" : undefined}
          _hover={{ bg: page === currentPage ? activeColor : hoverBg }}
          variant={page === currentPage ? "solid" : "ghost"}
        >
          {page}
        </Button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <Text px={3} py={1}>
              ٠٠٠
            </Text>
          )}
          <Button
            onClick={() => onPageChange(totalPages)}
            px={3}
            py={1}
            borderRadius="lg"
            bg={totalPages === currentPage ? activeColor : "transparent"}
            color={totalPages === currentPage ? "white" : undefined}
            _hover={{ bg: totalPages === currentPage ? activeColor : hoverBg }}
            variant={totalPages === currentPage ? "solid" : "ghost"}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        p={2}
        borderRadius="lg"
        _hover={{ bg: hoverBg }}
        opacity={!hasNext ? 0.5 : 1}
        cursor={!hasNext ? "not-allowed" : "pointer"}
        variant="ghost"
      >
        <ChevronRightIcon size={5} />
      </Button>
    </Flex>
  );
}

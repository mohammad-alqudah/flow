import { Button, Icon } from "@chakra-ui/react";
import PageCard from "../core/PageCard";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/config";

const downloadPreAdvicePDF = async (endpoint: string, id: string) => {
  const response = await axiosInstance.get(`file/pdf/${endpoint}/${id}/`, {
    responseType: "blob", // استقبال البيانات كملف
  });
  return response.data;
};

const Documents = ({ id }: { id: string }) => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (endpoint: string) => downloadPreAdvicePDF(endpoint, id),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `download.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("error:", error);
    },
  });

  return (
    <PageCard title="Documents">
      {/* pre_advice */}
      <Button
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
        onClick={() => mutate("pre_advice")}
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
        Download pre advice
      </Button>
      {/* pre_advice */}

      {/* cover_letter */}
      <Button
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
        onClick={() => mutate("cover_letter")}
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
        Download cover letter
      </Button>
      {/* cover_letter */}

      {/* arrival */}
      <Button
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
        onClick={() => mutate("arrival_notice")}
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
        Download arrival notice
      </Button>
      {/* arrival */}

      {/* index */}
      <Button
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
        onClick={() => mutate("index")}
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
        Download index
      </Button>
      {/* index */}
    </PageCard>
  );
};

export default Documents;

import toast from "react-hot-toast";

const handleErrorAlerts = (errorObj: { [key: string]: string[] }) => {
  const allErrorMessages = Object.values(errorObj).flat();

  console.log("errObj", errorObj);
  console.log("allErrorMessages", allErrorMessages);

  allErrorMessages.forEach((message) => {
    toast.error(message);
  });
};

export default handleErrorAlerts;

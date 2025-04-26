import { Box, Field, FileUpload, Icon, Input } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";

const CustomInput = ({
  type,
  label,
  defaultValue,
  placeholder,
  errorMeassage,
  required,
  disabled,
  ...props
}: {
  type: "text" | "email" | "password" | "number" | "file" | "date" | "select";
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  errorMeassage?: string | boolean;
  required?: boolean;
  disabled?: boolean;
  [key: string]: any;
}) => {
  if (type === "file") {
    return (
      <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone>
          <Icon size="md" color="fg.muted">
            <LuUpload />
          </Icon>
          <FileUpload.DropzoneContent>
            <Box>اسحب الملفات هنا أو انقر للاختيار</Box>
            <Box color="fg.muted">.png, .jpg up to 5MB</Box>
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
        <FileUpload.List clearable showSize />
      </FileUpload.Root>
    );
  }

  return (
    <Field.Root required={required} invalid={!!errorMeassage}>
      {label && (
        <Field.Label
          color="#6b7280"
          fontWeight="normal"
          textTransform="capitalize"
        >
          {label} <Field.RequiredIndicator />
        </Field.Label>
      )}
      <Input
        type={type}
        placeholder={placeholder || ""}
        defaultValue={defaultValue}
        {...props}
        mt="0"
        disabled={disabled}
      />
      {errorMeassage && typeof errorMeassage === "string" && (
        <Field.ErrorText>{errorMeassage}</Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default CustomInput;

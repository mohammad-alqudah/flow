import { Button, CloseButton } from "@chakra-ui/react";
import { Dialog } from "@chakra-ui/react";

const CustomModal = ({
  children,
  open,
  setOpen,
  title,
  actionButtonTitle,
  actionButtonColor,
  actionButtonFunction,
  formNameId,
  loading,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  actionButtonTitle?: string;
  actionButtonColor?: string;
  actionButtonFunction?: () => void;
  formNameId?: string;
  loading?: boolean;
}) => (
  <Dialog.Root
    lazyMount
    open={open}
    placement="center"
    onOpenChange={() => setOpen(!open)}
  >
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title textTransform="capitalize">{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>{children}</Dialog.Body>
        {actionButtonTitle && (
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline" colorPalette="gray">
                Cancel
              </Button>
            </Dialog.ActionTrigger>
            {actionButtonFunction ? (
              <Button
                colorPalette={actionButtonColor ? actionButtonColor : "teal"}
                onClick={() => actionButtonFunction()}
                textTransform="capitalize"
              >
                {actionButtonTitle}
              </Button>
            ) : (
              <Button
                colorPalette={actionButtonColor ? actionButtonColor : "teal"}
                type="submit"
                form={formNameId}
                loading={loading}
                textTransform="capitalize"
              >
                {actionButtonTitle}
              </Button>
            )}
          </Dialog.Footer>
        )}
        <Dialog.CloseTrigger asChild>
          <CloseButton size="sm" />
        </Dialog.CloseTrigger>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
);

export default CustomModal;

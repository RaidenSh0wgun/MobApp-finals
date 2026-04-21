import { Toast, ToastDescription, ToastTitle } from "./toast";

export const CustomToast = ({
  title,
  description,
  variant = "solid",
  action = "muted",
  id,
}: {
  title: string;
  description: string;
  variant: "solid" | "outline" | undefined;
  action: "muted" | "error" | "warning" | "success" | "info" | undefined;
  id: string;
}) => {
  return (
    <Toast action={action} nativeID={id} variant={variant}>
      <ToastTitle>{title}</ToastTitle>
      <ToastDescription>{description}</ToastDescription>
    </Toast>
  );
};

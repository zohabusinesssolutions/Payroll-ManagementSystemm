import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface AdminityButtonProps {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "destructive" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export const AdminityButton = ({
  children,
  disabled = false,
  loading = false,
  className,
  onClick,
  type = "button",
  variant = "default",
  size = "default",
}: AdminityButtonProps) => {

  const content = (
    <>
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {children}
    </>
  );

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={className}
      onClick={onClick}
    >
      {content}
    </Button>
  );
};

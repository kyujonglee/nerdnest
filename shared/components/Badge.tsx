import { UserType } from "@/shared/types/user.types";
import { cn } from "@nextui-org/theme";
import { Brush, ChevronsLeftRight, UserPen } from "lucide-react";

type BadgeProps = {
  userType: UserType;
  className?: string;
  size?: number;
  iconSize?: number;
};

export default function Badge({
  userType,
  className,
  size = 30,
  iconSize = 18,
}: BadgeProps) {
  const icon: Record<UserType, React.ElementType> = {
    designer: Brush,
    developer: ChevronsLeftRight,
    projectManager: UserPen,
  };
  const Icon = icon[userType];

  const backgroundColor: Record<UserType, string> = {
    designer: "bg-[#FC9E4F]",
    developer: "bg-[#0BB694]",
    projectManager: "bg-[#E4535F]",
  };

  const color: Record<UserType, string> = {
    designer: "#653F20",
    developer: "#04493B",
    projectManager: "#5B2126",
  };

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        `badge p-1.5 rounded-full flex items-center justify-center`,
        backgroundColor[userType],
        className
      )}
    >
      <Icon size={iconSize} color={color[userType]} />
    </div>
  );
}

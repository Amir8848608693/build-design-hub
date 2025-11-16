import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  change?: string;
  changePositive?: boolean;
  subtitle?: string;
  onClick?: () => void;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor, 
  iconColor, 
  change, 
  changePositive = true,
  subtitle,
  onClick 
}: StatCardProps) => {
  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-shadow",
        onClick && "cursor-pointer hover:scale-[1.02] transition-transform"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            {change && (
              <p className={cn(
                "text-sm font-medium",
                changePositive ? "text-green-600" : "text-red-600"
              )}>
                {changePositive ? "↑" : "↓"} {change}
              </p>
            )}
            {subtitle && (
              <p className="text-sm text-red-600 font-medium">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-full", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

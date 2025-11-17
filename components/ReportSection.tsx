import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ReportSectionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconColor?: string;
  children: ReactNode;
}

const ReportSection = ({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = "text-primary",
  children 
}: ReportSectionProps) => {
  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`h-12 w-12 rounded-xl bg-gradient-card flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && (
              <CardDescription className="text-base mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ReportSection;

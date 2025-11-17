import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface InterviewQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  children?: React.ReactNode;
}

const InterviewQuestionCard = ({
  questionNumber,
  totalQuestions,
  questionText,
  children,
}: InterviewQuestionCardProps) => {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-base px-4 py-1.5">
            <MessageSquare className="h-4 w-4 mr-2" />
            Kérdés {questionNumber} / {totalQuestions}
          </Badge>
          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <CardTitle className="text-2xl leading-relaxed">
          {questionText}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Válaszolj minél részletesebben, konkrét példákat hozva
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default InterviewQuestionCard;

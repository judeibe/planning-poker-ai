import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameFormCardProps {
  title: string;
  children: React.ReactNode;
}

export function GameFormCard({ title, children }: GameFormCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
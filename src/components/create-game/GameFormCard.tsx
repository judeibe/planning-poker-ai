import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GameFormCard({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Game</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
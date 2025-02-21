import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingChart = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader>
      <Skeleton className="h-6 w-[200px] mb-2" />
      <Skeleton className="h-4 w-[300px]" />
    </CardHeader>
    <CardContent className="px-2 sm:p-6">
      <Skeleton className="h-[300px] w-full" />
    </CardContent>
  </Card>
);
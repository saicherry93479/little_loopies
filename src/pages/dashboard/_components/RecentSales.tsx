import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales({ data = [] }) {
  return (
    <div className="space-y-8">
      {data.map((item) => (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{item?.productCount}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item?.name}</p>
            <p className="text-sm text-muted-foreground">
             {item?.email}
            </p>
          </div>
          <div className="ml-auto font-medium">{item?.orderAmount || 0}</div>
        </div>
      ))}
    </div>
  );
}

import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-52 w-full rounded-[2rem]" />
      <div className="grid gap-3">
        <Skeleton className="h-28 w-full rounded-[1.5rem]" />
        <Skeleton className="h-28 w-full rounded-[1.5rem]" />
        <Skeleton className="h-28 w-full rounded-[1.5rem]" />
      </div>
    </div>
  );
}

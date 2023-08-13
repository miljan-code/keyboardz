import { Skeleton } from "@/components/ui/skeleton";

export const Loader = () => {
  return (
    <div className="-mt-14 flex flex-col items-center justify-center gap-2">
      <Skeleton className="h-[20px] w-full rounded-full" />
      <Skeleton className="h-[20px] w-full rounded-full" />
      <Skeleton className="h-[20px] w-full rounded-full" />
    </div>
  );
};

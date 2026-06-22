import React from "react";
import { Skeleton } from "./skeleton";

const DataSkeleton = () => {
  return (
    <div className="flex w-[80%] flex-col gap-7">
      <div className="flex flex-col gap-3 w-full">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
};

export default DataSkeleton;

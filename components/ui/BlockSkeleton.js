import React from "react";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

const BlockSkeleton = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
};

export default BlockSkeleton;

import React from 'react'
import { Skeleton } from './skeleton'

const DashLoader = () => {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-10 flex-1" />
        </div>
      ))}
    </div>
  )
}

export default DashLoader

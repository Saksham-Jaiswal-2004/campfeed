"use client"
import React from 'react'

const Analytics = ({ setSelectedView }) => {
  return (
    <div className='w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Your Campus Analytics</h2>
          {/* <p className='contentText'>Create and manage campus announcements</p> */}
        </div>
      </div>
    </div>
  )
}

export default Analytics

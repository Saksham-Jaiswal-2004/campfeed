import React from 'react'
import { Switch } from "@/components/ui/switch"

const Settings = () => {
  return (
    <div className='w-[84vw] h-screen flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-[70%] px-5 mt-6 mb-10'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Platform Settings</h2>
          <p className='contentText'>Configure platform behavior and system preferences</p>
        </div>

        <div className='flex gap-4'>
          <button className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out'>Save Changes</button>
          <button className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out'>Restore Defaults</button>
        </div>
      </div>

      <div className='w-[67%]'>
        <div className='h-fit border border-gray-700 rounded-lg my-4 p-6'>
          <h2 className='subtitle text-2xl'>Platform Controls</h2>
          <p className='contentText text-xs mb-10'>Manage core platform functionality and user interactions</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Enable New Event Submissions</p>
              <p className='contentText text-xs'>Users can submit events through the platform</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Maintainence Mode</p>
              <p className='contentText text-xs'>Show maintenance page to all users</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Enable User Feedback Collection</p>
              <p className='contentText text-xs'>Show feedback forms and collect user suggestions</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

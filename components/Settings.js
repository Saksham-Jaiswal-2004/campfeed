import React from 'react'
import { Switch } from "@/components/ui/switch"

const Settings = () => {
  return (
    <div className='w-[84vw] h-screen flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 my-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Platform Settings</h2>
          <p className='contentText'>Configure platform behavior and system preferences</p>
        </div>

        <div className='flex gap-4'>
          <button className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out'>Save Changes</button>
          <button className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out'>Restore Defaults</button>
        </div>
      </div>

      <div className='w-full px-4'>
        <div className='h-fit border border-gray-800 bg-[#020316] rounded-lg my-4 py-6 px-12'>
          <h2 className='subtitle text-2xl'>Notifications & Alerts</h2>
          <p className='contentText text-xs mb-10'>Customize how and when you receive campus updates.</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Announcement Notifications</p>
              <p className='contentText text-xs'>Enable or disable notifications for official announcements.</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Event Reminders</p>
              <p className='contentText text-xs'>Get reminders for upcoming campus events and deadlines.</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Query & Issue Updates</p>
              <p className='contentText text-xs'>Receive updates when your query or issue gets a response or status change.</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>
        </div>

        <div className='h-fit border border-gray-800 bg-[#020316] rounded-lg my-4 py-6 px-12'>
          <h2 className='subtitle text-2xl'>Support & Preferences</h2>
          <p className='contentText text-xs mb-10'>Help, feedback, and general preferences.</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Language & Accessibility</p>
              <p className='contentText text-xs'>Choose language and accessibility options.</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Help & Support</p>
              <p className='contentText text-xs'>Contact support or report technical issues.</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Query & Issue Updates</p>
              <p className='contentText text-xs'>Receive updates when your query or issue gets a response or status change.</p>
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

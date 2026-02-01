import React from 'react'
import { Switch } from "@/components/ui/switch"

const AdminSettings = () => {
  return (
    <div className='w-[84vw] h-screen flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 my-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Admin Settings</h2>
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
          <h2 className='subtitle text-2xl'>Announcements Management</h2>
          <p className='contentText text-xs mb-10'>Control official campus communication.</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Create & Publish Announcements</p>
              <p className='contentText text-xs'>Post announcements to selected student groups.</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Edit Announcements</p>
              <p className='contentText text-xs'>Update outdated announcements.</p>
            </div>

            <div>
              <Switch />
            </div>
          </div>
        </div>

        <div className='h-fit border border-gray-800 bg-[#020316] rounded-lg my-4 py-6 px-12'>
          <h2 className='subtitle text-2xl'>Events Management</h2>
          <p className='contentText text-xs mb-10'>Oversee all campus events.</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Event Creation</p>
              <p className='contentText text-xs'>Let Clubs and Faculty create events</p>
            </div>
            <div><Switch /></div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Registration Management</p>
              <p className='contentText text-xs'>Enable or disable student registrations.</p>
            </div>
            <div><Switch /></div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Event Analytics</p>
              <p className='contentText text-xs'>Track views, registrations, and engagement.</p>
            </div>
            <div><Switch /></div>
          </div>
        </div>

        <div className='h-fit border border-gray-800 bg-[#020316] rounded-lg my-4 py-6 px-12'>
          <h2 className='subtitle text-2xl'>Queries & Issue Moderation</h2>
          <p className='contentText text-xs mb-10'>Maintain order and transparency on campus issues.</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Issue Approval Workflow</p>
              <p className='contentText text-xs'>Approve, reject, or escalate reported issues.</p>
            </div>
            <div><Switch /></div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Status Management</p>
              <p className='contentText text-xs'>Let update issue status (open, in review, resolved).</p>
            </div>
            <div><Switch /></div>
          </div>
        </div>

        <div className='h-fit border border-gray-800 bg-[#020316] rounded-lg my-4 py-6 px-12'>
          <h2 className='subtitle text-2xl'>Student Management</h2>
          <p className='contentText text-xs mb-10'>Control and monitor student accounts.</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Student Verification</p>
              <p className='contentText text-xs'>Approve or verify student accounts.</p>
            </div>
            <div><Switch /></div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Account Suspension</p>
              <p className='contentText text-xs'>Temporarily suspend or restrict users.</p>
            </div>
            <div><Switch /></div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Bulk Import & Export</p>
              <p className='contentText text-xs'>Upload student data in bulk.</p>
            </div>
            <div><Switch /></div>
          </div>
        </div>

        <div className='h-fit border border-gray-800 bg-[#020316] rounded-lg my-4 py-6 px-12'>
          <h2 className='subtitle text-2xl'>Privacy, Security & Compliance</h2>
          <p className='contentText text-xs mb-10'>Ensure platform integrity and compliance.</p>

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Data Access Logs</p>
              <p className='contentText text-xs'>View admin actions and data access history.</p>
            </div>
            <div><Switch /></div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Privacy Controls</p>
              <p className='contentText text-xs'>Manage data visibility and retention policies.</p>
            </div>
            <div><Switch /></div>
          </div>

          <hr className='border-[0.2px] border-gray-700' />

          <div className='my-6 flex justify-between items-center'>
            <div className='flex flex-col'>
              <p className='text-base'>Security Settings</p>
              <p className='contentText text-xs'>Enable 2FA and security rules for admins.</p>
            </div>
            <div><Switch /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings

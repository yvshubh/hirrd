import CreatedApplications from '@/components/CreatedApplications'
import CreatedJobs from '@/components/CreatedJobs'
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { BarLoader } from 'react-spinners'

const MyJobs = () => {


  const {user, isLoaded} = useUser()

  if(!isLoaded ){
    return <BarLoader  className='mb-4' width={'100%'} color='#36d7b7'/>
     
}
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8  '>
        {
          user?.unsafeMetadata?.role === "recruiter" ? "My Jobs" : "My Applications"
        }
      </h1>

        {
          user?.unsafeMetadata?.role === "recruiter" 
          ?(<CreatedJobs />)
          :(<CreatedApplications />)
        }
    </div>
  )
}

export default MyJobs
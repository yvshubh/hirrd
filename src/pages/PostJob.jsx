import { addNewJob } from '@/api/apiApplications'
import { getCompanies } from '@/api/apiCompanies'
import AddCompanyDrawer from '@/components/add-company-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import { zodResolver } from '@hookform/resolvers/zod'
import MDEditor from '@uiw/react-md-editor'
import { State } from 'country-state-city'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import { z } from 'zod'


const schema = z.object({
  title: z.string().min(1, {message:"Title is required"}),
  description: z.string().min(1, {message:"Description is required"}),
  location: z.string().min(1, {message:"Select a location"}),
  company_id: z.string().min(1, {message:"Select or add a new company"}),
  requirements: z.string().min(1, {message:"Requirements are required"}),
})

const PostJob = () => {

  const navigate = useNavigate()

  const {control, formState:{errors}, register, handleSubmit } = useForm({
    defaultValues: {
      location:"",
      company_id:"",
      requirements:"",
    },
    resolver: zodResolver(schema)
  })

  const {fn:fnCompanies, data:companies, loading:loadingCompanies} =  useFetch(getCompanies)
  const {fn:fnCreateJOb,  loading:loadingCreateJob, error:errorCreateJob, data:dataCreateJob} =  useFetch(addNewJob)
  const {isLoaded, user} = useUser()


  useEffect(() => {
    if(isLoaded) fnCompanies()
  }, [isLoaded])

  useEffect(() => {
    if(dataCreateJob?.length > 0) navigate('/jobs')
  }, [loadingCreateJob])

  
  const onSubmitHandler = (data) => {
    fnCreateJOb({
      ...data,
      recruiter_id:user.id,
      isOpen: true,
    })
  }

  if(!isLoaded || loadingCompanies){
    return <BarLoader  className='mb-4' width={'100%'} color='#36d7b7'/>
  }

  if(user?.unsafeMetadata?.role !== 'recruiter'){
    return <Navigate to={'/jobs'} />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a Job</h1>

      <form className='flex flex-col p-4 gap-4 pb-0' onSubmit={handleSubmit(onSubmitHandler)}>
        <Input placeholder="Job Title" {...register('title')} />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && <p className='text-red-500'>{errors.description.message}</p>}

        <div className='flex gap-4 items-center'>
          <Controller 
          name='location'
          control={control}
          render={({field}) => (
          <Select value={field.value} onValueChange={field.onChange} >
          <SelectTrigger>
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>

              {
                State.getStatesOfCountry("IN").map(({name}) => (

                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))
              }
              
            </SelectGroup>
          </SelectContent>
        </Select>
          )}
          />
        

        <Controller
        name='company_id'
        control={control}
        render={({field}) => (
          <Select value={field.value} onValueChange={field.onChange} >
          <SelectTrigger>
            <SelectValue placeholder="Select Company">
              {
                field.value
                ?(companies.find((com) => com.id === Number(field.value))?.name)
                :("Company")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>

              {
                companies?.map(({name, id}) => (

                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))
              }
              
            </SelectGroup>
          </SelectContent>
        </Select>
        )}
        />

        <AddCompanyDrawer fetchCompanies={fnCompanies} />

        </div>
        {
          errors.company_id && <p className='text-red-500'>{errors.company_id.message}</p>
        }
        {
          errors.location && <p className='text-red-500'>{errors.location.message}</p>
        }

        <Controller 
        name='requirements'
        control={control}
        render={({field}) => (

          <MDEditor style={{backgroundColor:"black", color:"white"}} value={field.value} onChange={field.onChange} />
        )}
        />
        {
          errors.requirements && <p className='text-red-500'>{errors.requirements.message}</p>
        }

        {
          errorCreateJob?.message && <p className='text-red-500'>{errorCreateJob?.message}</p>
        }

        {loadingCreateJob && <BarLoader  className='mb-4' width={'100%'} color='#36d7b7'/>}
        <Button type="submit" variant="blue" size="lg" className="mt-2">Submit</Button>
      </form>
    </div>
  )
}

export default PostJob
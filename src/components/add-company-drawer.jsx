import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Drawer, DrawerClose, DrawerContent,  DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { addNewCompany } from '@/api/apiCompanies'
import useFetch from '@/hooks/use-fetch'
import { BarLoader } from 'react-spinners'

const schema = z.object({
    name: z.string().min(1, {message: "Company name is required"}),
    logo: z.any().refine((file) => file[0] && (
        file[0].type === 'image/png' || file[0].type === 'image/jpeg'
    ), {message: "Only png or jpeg images are allowed"})
})
const AddCompanyDrawer = ({fetchCompanies}) => {

    const {handleSubmit, register, formState:{errors}} = useForm({
        resolver: zodResolver(schema)
    })

    const {fn:fnCreateCompany,  loading:loadingCreateCompany, error:errorCreateCompany, data:dataCreateCompany} = 
     useFetch (addNewCompany)

    const onSubmit = (data) => {
        fnCreateCompany({
            ...data,
            logo: data.logo[0]
        })
    }

    useEffect(() => {
        if(dataCreateCompany?.length > 0) fetchCompanies()
    }, [loadingCreateCompany])

  return (
    <Drawer>
    <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
           + Add Company
        </Button>
    </DrawerTrigger>
    <DrawerContent>
        <DrawerHeader>
        <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className='flex gap-2 p-4 pb-0' >
            <Input {...register("name")} placeholder="Company Name" />

            <Input type="file" accept="image/*"
            className="file:text-gray-500"
            {...register("logo")}  />

            <Button type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40 "
            >Submit</Button>
        </form>

        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        {errors.logo && <p className='text-red-500'>{errors.logo.message}</p>}

        {
            errorCreateCompany?.message && 
            <p className='text-red-500'>{errorCreateCompany.message}</p>
        }

        {loadingCreateCompany && <BarLoader width={"100%"} color='#36d7b7' /> }

        <DrawerFooter>
        <DrawerClose asChild>
            <Button variant="secondary" type="button">Cancel</Button>
        </DrawerClose>
        </DrawerFooter>
    </DrawerContent>
    </Drawer>
  )
}

export default AddCompanyDrawer
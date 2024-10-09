import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentSchema } from '@/utils/validationSchema';
import { useMutation } from '@tanstack/react-query';
import { createStudent } from '@/api/studentApi';

const AddStudent = () => {
  const usePostData = useMutation({
    mutationFn: createStudent,
    onSuccess: (data) => {
      console.log('Student created successfully', data);
    },
    onError: (error) => {
      console.error('Error creating student:', error);
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(studentSchema)
  });

  const [image, setImage] = useState(null)
  const onSubmit = async (data) => {
    try {
      await usePostData.mutateAsync({
        ...data,
        picture: image
      });
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  }

  return (
    <div className='flex justify-center flex-col items-center'>
      <h2 className='text-center text-3xl my-3 tracking-wider uppercase font-bold'>Add Student</h2>
      <form className="w-full max-w-lg mt-2"
        onSubmit={handleSubmit(onSubmit)}>
        {/* first name and last name */}
        <div className="flex flex-wrap -mx-3 mb-6">

          {/* first name */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <Label>Full Name</Label>
            <Input
              {...register('firstName')}
              placeholder="First Name"
              className={errors.firstName ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName.message}</p>}
          </div>

          {/* last name */}
          <div className="w-full md:w-1/2 px-3">
            <Label>Last Name</Label>
            <Input
              {...register('lastName')}
              placeholder="Last Name"
              className={errors.lastName ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* roll no , class and gender */}
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Roll No */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <Label>Roll No</Label>
            <Input
              {...register('rollNo')}
              placeholder="Roll No"
              className={errors.rollNo ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.rollNo && <p className="text-red-500 text-xs italic">{errors.rollNo.message}</p>}
          </div>
          {/* Class */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <Label>Class</Label>
            <Input
              {...register('class')}
              placeholder="Class"
              className={errors.class ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.class && <p className="text-red-500 text-xs italic">{errors.class.message}</p>}
          </div>

          {/* Gender */}
          {/* <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <Label>Gender</Label>
            <Select {...register('gender')} onValueChange={(value) => {
              console.log("Selected Gender:", value)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gender</SelectLabel>
                  {gender.map(({ title }) => (
                    <SelectItem key={title} value={title}>{title}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs italic">{errors.gender.message}</p>}
          </div> */}
        </div>

        {/* contact details */}
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Phone No */}
          <div className="w-full px-3">
            <Label>Phone No</Label>
            <Input
              {...register('phoneNo')}
              placeholder="Phone No"
              className={errors.phoneNo ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.phoneNo && <p className="text-red-500 text-xs italic">{errors.phoneNo.message}</p>}
          </div>

          {/* Email */}
          <div className="w-full px-3">
            <Label>Email</Label>
            <Input
              {...register('email')}
              placeholder="Email"
              className={errors.email ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
          </div>
        </div>

        {/* address */}
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Address */}
          <div className="w-full px-3">
            <Label>Address</Label>
            <Input
              {...register('address')}
              placeholder="Address"
              className={errors.address ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.address.message}</p>}
          </div>
        </div>

        {/* address details */}
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* city */}
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <Label>City</Label>
            <Input
              {...register('city')}
              placeholder="City"
              className={errors.city ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.city && <p className="text-red-500 text-xs italic">{errors.city.message}</p>}
          </div>

          {/* state */}
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <Label>State</Label>
            <Input
              {...register('state')}
              placeholder="State"
              className={errors.state ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.city && <p className="text-red-500 text-xs italic">{errors.state.message}</p>}
          </div>

          {/* Pin Code */}
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <Label>Pin Code</Label>
            <Input
              {...register('pinCode')}
              placeholder="Pin Code"
              className={errors.pinCode ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.pinCode && <p className="text-red-500 text-xs italic">{errors.pinCode.message}</p>}
          </div>
        </div>

        {/* Picture */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <Label htmlFor="picture">Picture</Label>
            <Input
              id="picture"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="focus-visible:ring-1" />
          </div>
        </div>

        {/* submit button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}>
          {/* <Link to={path}> */}
          <button className="w-full shadow bg-primary focus:shadow-outline focus:outline-none text-white font-bold text-base py-2 px-4 rounded" type="submit">
            Submit
          </button>
          {/* </Link> */}
        </motion.div>
      </form>
    </div>
  )
}

export default AddStudent
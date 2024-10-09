import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { getStudents, updateStudent } from '@/api/studentApi';
import { studentSchema } from '@/utils/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const EditStudent = () => {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const gridRefStudent = useRef(null);

  const [colDefsStudent] = useState([
    { field: 'firstName', headerName: 'First Name', flex: 1 }
  ]);

  // Function to handle row selection of students
  const onRowStudent = () => {
    const selectedNodes = gridRefStudent.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    if (selectedData.length > 0) {
      setSelectedStudent(selectedData); // Set selected book name
    }
  };

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(studentSchema)
  });

  // image preview
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null)
  // use imagePreview for showing images
  const handelFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file)

    const imageReader = new FileReader();
    imageReader.onload = () => (
      setImagePreview(imageReader.result)
    )

    if (file) {
      imageReader.readAsDataURL(file)
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      setValue("firstName", selectedStudent[0]?.firstName || "");
      setValue("lastName", selectedStudent[0]?.lastName || "");
      setValue("rollNo", selectedStudent[0]?.rollNo || "");
      setValue("class", selectedStudent[0]?.class || "");
      setValue("phoneNo", selectedStudent[0]?.phoneNo || "");
      setValue("email", selectedStudent[0]?.email || "");
      setValue("address", selectedStudent[0]?.address || "");
      setValue("city", selectedStudent[0]?.city || "");
      setValue("state", selectedStudent[0]?.state || "");
      setValue("pinCode", selectedStudent[0]?.pinCode || "");
    }
  }, [selectedStudent, setValue]);

  const useUpdate = useMutation({
    mutationFn: updateStudent,
    onSuccess: (data) => {
      console.log('student updated successfully', data);
    },
    onError: (error) => {
      console.error('Error student updated:', error);
    }
  })

  const onSubmit = async (formData) => {
    if (image !== "") {
      formData.picture = image;
    }
    try {
      await useUpdate.mutateAsync({
        student: formData,
        studentId: selectedStudent[0]?.student_id,
      });
    } catch (error) {
      console.error('Failed to create book:', error);
    }
  }

  return (
    <>
      <h2 className='text-center text-3xl my-3 tracking-wider uppercase font-bold'>Edit Book</h2>
      <div className='flex justify-around content-between'>
        <div>
          {/* Select Student */}
          <div className="w-full px-3">
            <Label htmlFor="student">Select Student</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedStudent && selectedStudent[0]?.firstName || "Select a Student"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    <Input
                      placeholder="Search Student"
                      onChange={(e) => setSearch(e.target.value)} />
                  </SelectLabel>
                  <div
                    className="ag-theme-quartz" // applying the Data Grid theme
                    style={{ height: 300, width: '100%' }} >
                    <AgGridReact
                      rowData={students}
                      columnDefs={colDefsStudent}
                      quickFilterText={search}
                      ref={gridRefStudent}
                      selection={{ mode: "singleRow" }}
                      onSelectionChanged={onRowStudent}
                    />
                  </div>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* {selectedStudent && (
              <div className='pt-2'>
                <p className='font-bold'>Student Name : <span className='font-normal'>{selectedStudent[0]?.firstName}</span></p>
                <p className='font-bold'>Student Phone : <span className='font-normal'>{selectedStudent[0]?.phoneNo}</span></p>
                <p className='font-bold'>Student Email : <span className='font-normal'>{selectedStudent[0]?.email}</span></p>
                <p className='font-bold'>Student Class : <span className='font-normal'>{selectedStudent[0]?.class}</span></p>
              </div>
            )} */}
          </div>

          {/* image of book */}
          <img
            src={
              imagePreview ? imagePreview : selectedStudent && selectedStudent[0]?.picture ? selectedStudent[0].picture : "/profile.jpg"
            }
            className='h-96 w-72 my-6 object-cover'
            alt="" />
        </div>

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
                defaultValue={selectedStudent && selectedStudent[0]?.firstName}
                onChange={(e) => setValue("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName.message}</p>}
            </div>

            {/* last name */}
            <div className="w-full md:w-1/2 px-3">
              <Label>Last Name</Label>
              <Input
                {...register('lastName')}
                placeholder="Last Name"
                defaultValue={selectedStudent && selectedStudent[0]?.lastName}
                onChange={(e) => setValue("lastName", e.target.value)}
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
                defaultValue={selectedStudent && selectedStudent[0]?.rollNo}
                onChange={(e) => setValue("rollNo", e.target.value)}
                className={errors.rollNo ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.rollNo && <p className="text-red-500 text-xs italic">{errors.rollNo.message}</p>}
            </div>
            {/* Class */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <Label>Class</Label>
              <Input
                {...register('class')}
                placeholder="Class"
                defaultValue={selectedStudent && selectedStudent[0]?.class}
                onChange={(e) => setValue("class", e.target.value)}
                className={errors.class ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.class && <p className="text-red-500 text-xs italic">{errors.class.message}</p>}
            </div>
          </div>

          {/* contact details */}
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Phone No */}
            <div className="w-full px-3">
              <Label>Phone No</Label>
              <Input
                {...register('phoneNo')}
                placeholder="Phone No"
                defaultValue={selectedStudent && selectedStudent[0]?.phoneNo}
                onChange={(e) => setValue("phoneNo", e.target.value)}
                className={errors.phoneNo ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.phoneNo && <p className="text-red-500 text-xs italic">{errors.phoneNo.message}</p>}
            </div>

            {/* Email */}
            <div className="w-full px-3">
              <Label>Email</Label>
              <Input
                {...register('email')}
                placeholder="Email"
                defaultValue={selectedStudent && selectedStudent[0]?.email}
                onChange={(e) => setValue("email", e.target.value)}
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
                defaultValue={selectedStudent && selectedStudent[0]?.address}
                onChange={(e) => setValue("address", e.target.value)}
                className={errors.address ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.address.message}</p>}
            </div>
          </div>

          {/* city */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label>City</Label>
              <Input
                {...register('city')}
                placeholder="City"
                defaultValue={selectedStudent && selectedStudent[0]?.city}
                onChange={(e) => setValue("city", e.target.value)}
                className={errors.city ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.city && <p className="text-red-500 text-xs italic">{errors.city.message}</p>}
            </div>

            {/* state */}
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label>State</Label>
              <Input
                {...register('state')}
                placeholder="State"
                defaultValue={selectedStudent && selectedStudent[0]?.state}
                onChange={(e) => setValue("state", e.target.value)}
                className={errors.state ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.city && <p className="text-red-500 text-xs italic">{errors.state.message}</p>}
            </div>

            {/* Pin Code */}
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label>Pin Code</Label>
              <Input
                {...register('pinCode')}
                placeholder="Pin Code"
                defaultValue={selectedStudent && selectedStudent[0]?.pinCode}
                onChange={(e) => setValue("pinCode", e.target.value)}
                className={errors.pinCode ? "border-red-500" : "focus-visible:ring-1"} />
              {errors.pinCode && <p className="text-red-500 text-xs italic">{errors.pinCode.message}</p>}
            </div>
          </div>

          {/* Picture */}
          <div className="flex flex-wrap mb-6">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file"
              className="focus-visible:ring-1"
              onChange={handelFileChange} />
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
    </>
  )
}

export default EditStudent
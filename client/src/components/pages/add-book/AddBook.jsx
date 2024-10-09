import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bookSchema } from '@/utils/validationSchema';
import { useMutation } from '@tanstack/react-query';
import { createBook } from '@/api/booksApi';

const AddBook = () => {

  const usePostData = useMutation({
    mutationFn: createBook,
    onSuccess: (data) => {
      console.log('Book created successfully', data);
    },
    onError: (error) => {
      console.error('Error creating book:', error);
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bookSchema)
  })

  const [image, setImage] = useState("");

  const onSubmit = async (formData) => {
    console.log(image);
    try {
      await usePostData.mutateAsync({
        ...formData,
        picture: image, // Pass the file to the API
      });
    } catch (error) {
      console.error('Failed to create book:', error);
    }
  }

  return (
    <div className='flex justify-center flex-col items-center'>
      <h2 className='text-center text-3xl my-3 tracking-wider uppercase font-bold'>Add Book</h2>
      <form className="w-full max-w-lg"
        onSubmit={handleSubmit(onSubmit)}>

        <div className="flex flex-wrap -mx-3 my-6 gap-4">
          {/* shadecn */} {/* name */}
          <div className="w-full px-3">
            <Label>NAME</Label>
            <Input
              {...register("name")}
              placeholder="Name of the book"
              className={errors.name ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
          </div>

          {/* shadecn */} {/* author */}
          <div className="w-full px-3">
            <Label>AUTHOR</Label>
            <Input
              {...register("author")}
              placeholder="Author of the book"
              className={errors.author ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.author && <p className="text-red-500 text-xs italic">{errors.author.message}</p>}
          </div>

          {/* shadecn */} {/* publisher */}
          <div className="w-full px-3">
            <Label>PUBLISHER</Label>
            <Input
              {...register("publisher")}
              placeholder="Publisher of the book"
              className={errors.publisher ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.publisher && <p className="text-red-500 text-xs italic">{errors.publisher.message}</p>}
          </div>

          {/* shadecn */} {/* isbn */}
          <div className="w-full px-3">
            <Label>ISBN</Label>
            <Input
              {...register("isbn")}
              placeholder="ISBN of the book"
              className={errors.isbn ? "border-red-500" : "focus-visible:ring-1"} />
            {errors.isbn && <p className="text-red-500 text-xs italic">{errors.isbn.message}</p>}
          </div>

          {/* shadecn */} {/* Picture */}
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

export default AddBook
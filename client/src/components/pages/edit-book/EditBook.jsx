import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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

import { getBooks, updateBook } from '@/api/booksApi';
import { bookSchema, bookUpdateSchema } from '@/utils/validationSchema';

const EditBook = () => {
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState("");

  const [colDefsBook] = useState([
    { field: 'name', headerName: 'Name', flex: 1 },
  ]);

  const gridRefBook = useRef(null);

  const onRowBook = () => {
    const selectedNodes = gridRefBook.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    if (selectedData.length > 0) {
      setSelectedBook(selectedData); // Set selected book name
    }
  };

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bookSchema)
  })

  useEffect(() => {
    if (selectedBook) {
      setValue("name", selectedBook[0]?.name || "");
      setValue("author", selectedBook[0]?.author || "");
      setValue("publisher", selectedBook[0]?.publisher || "");
      setValue("isbn", selectedBook[0]?.isbn || "");
    }
  }, [selectedBook, setValue]);

  const [image, setImage] = useState("");
  const useUpdate = useMutation({
    mutationFn: updateBook,
    onSuccess: (data) => {
      console.log('Book created successfully', data);
    },
    onError: (error) => {
      console.error('Error creating book:', error);
    }
  })

  // image preview
  const [imagePreview, setImagePreview] = useState("");
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

  const onSubmit = async (formData) => {
    if (image !== "") {
      formData.picture = image;
    }
    try {
      await useUpdate.mutateAsync({
        book: formData,
        bookId: selectedBook[0]?.id
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
          {/* Select Book */}
          <div className="w-full px-3">
            <Label htmlFor="book">Select Book</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedBook && selectedBook[0].name || "Select a Book"} />
                {/* {selectedBook && console.log(selectedBook[0].name)} */}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    <Input
                      placeholder="Search book"
                      onChange={(e) => setSearch(e.target.value)} />
                  </SelectLabel>
                  <div
                    className="ag-theme-quartz" // applying the Data Grid theme
                    style={{ height: 300, width: '100%' }} >
                    <AgGridReact
                      rowData={books}
                      columnDefs={colDefsBook}
                      quickFilterText={search}
                      ref={gridRefBook}
                      selection={{ mode: "singleRow" }}
                      onSelectionChanged={onRowBook}
                    />
                  </div>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* image of book */}
          <img
            src={
              imagePreview ? imagePreview : selectedBook && selectedBook[0]?.picture ? selectedBook[0].picture : "/book.jpg"
            }
            className='h-96 w-72 my-6'
            alt="" />
        </div>

        <form className="w-full max-w-lg"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-3 my-6 gap-4">
            {/* shadecn */} {/* name */}
            <div className="w-full px-3">
              <Label>NAME</Label>
              <Input
                placeholder="Name of the book"
                {...register("name")}
                defaultValue={selectedBook && selectedBook[0]?.name}
                onChange={(e) => setValue("name", e.target.value)}
                className="focus-visible:ring-1" />{/* border-red-500 */}
              {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
            </div>

            {/* shadecn */} {/* author */}
            <div className="w-full px-3">
              <Label>AUTHOR</Label>
              <Input
                placeholder="Author of the book"
                {...register("author")}
                defaultValue={selectedBook && selectedBook[0]?.author}
                onChange={(e) => setValue("author", e.target.value)}
                className="focus-visible:ring-1" />{/* border-red-500 */}
              {errors.author && <p className="text-red-500 text-xs italic">{errors.author.message}</p>}
            </div>

            {/* shadecn */} {/* publisher */}
            <div className="w-full px-3">
              <Label>PUBLISHER</Label>
              <Input
                placeholder="Publisher of the book"
                {...register("publisher")}
                defaultValue={selectedBook && selectedBook[0]?.publisher}
                onChange={(e) => setValue("publisher", e.target.value)}
                className="focus-visible:ring-1" />{/* border-red-500 */}
              {errors.publisher && <p className="text-red-500 text-xs italic">{errors.publisher.message}</p>}
            </div>

            {/* shadecn */} {/* isbn */}
            <div className="w-full px-3">
              <Label>ISBN</Label>
              <Input
                placeholder="ISBN of the book"
                {...register("isbn")}
                defaultValue={selectedBook && selectedBook[0]?.isbn}
                onChange={(e) => setValue("isbn", e.target.value)}
                className="focus-visible:ring-1" />{/* border-red-500 */}
              {errors.isbn && <p className="text-red-500 text-xs italic">{errors.isbn.message}</p>}
            </div>

            {/* shadecn */} {/* Picture */}
            <div className="w-full px-3 object-cover">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file"
                className="focus-visible:ring-1"
                onChange={handelFileChange} />
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
    </>
  )
}

export default EditBook
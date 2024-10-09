import { getBooks } from '@/api/booksApi';
import { getStudents } from '@/api/studentApi';
import { useMutation, useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from "framer-motion";
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

import { useRef, useState } from 'react'
import { returnBook } from '@/api/issueReturn';
import { removeAssignedToStudent } from '@/api/assignedStudents';

function ReturnBook() {
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Column Definitions
  const [colDefsBook] = useState([
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'author', headerName: 'Author', flex: 1 },
    { field: 'publisher', headerName: 'Publisher', flex: 1 },
  ]);
  const [colDefsStudent] = useState([
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'phoneNo', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
  ]);

  const gridRefBook = useRef(null);
  const gridRefStudent = useRef(null);

  // Function to handle row selection
  const onRowBook = () => {
    const selectedNodes = gridRefBook.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    if (selectedData.length > 0) {
      setSelectedBook(selectedData); // Set selected book name
    }
  };

  // Function to handle row selection
  const onRowStudent = () => {
    const selectedNodes = gridRefStudent.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    if (selectedData.length > 0) {
      setSelectedStudent(selectedData); // Set selected book name
      console.log(selectedData);

    }
  };

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  })
  // console.log("books", books);

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })
  // console.log("studentsList", studentsList);

  const useReturnBook = useMutation({
    mutationFn: returnBook,
    onSuccess: (data) => {
      console.log('useReturnBook successfully', data);
    },
    onError: (error) => {
      console.error('Error Returned book :', error);
    }
  })
  const useRemoveAssignedStudent = useMutation({
    mutationFn: removeAssignedToStudent,
    onSuccess: (data) => {
      console.log('useRemoveAssignedStudent successfully', data);
    },
    onError: (error) => {
      console.error('Error Returned book :', error);
    }
  })

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      await useReturnBook.mutateAsync({
        studentId: selectedStudent[0]?.student_id,
        bookId: selectedBook[0]?.id
      });
      await useRemoveAssignedStudent.mutateAsync({
        studentId: selectedStudent[0]?.student_id,
        bookId: selectedBook[0]?.id
      });
    } catch (error) {
      console.error('Failed to ReturnBook.jsx :', error);
    }
  }

  return (
    <div className='flex justify-center flex-col items-center'>
      <h2 className='text-center text-3xl my-3 tracking-wider uppercase font-bold'>Return Book</h2>
      <form className="w-full max-w-lg"
        onSubmit={handelSubmit}>
        <div className="flex flex-wrap -mx-3 my-6 gap-4">

          {/* Select Student */}
          <div className="w-full px-3">
            <Label htmlFor="student">Select Student</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedStudent && selectedStudent[0]?.firstName || "Select a Student"} />
                {/* {selectedStudent && console.log(selectedStudent)} */}
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
            {selectedStudent && (
              <div className='pt-2'>
                <p className='font-bold'>Student Id : <span className='font-normal'>{selectedStudent[0]?.student_id}</span></p>
                <p className='font-bold'>Student Name : <span className='font-normal'>{selectedStudent[0]?.firstName}</span></p>
                <p className='font-bold'>Student Phone : <span className='font-normal'>{selectedStudent[0]?.phoneNo}</span></p>
                <p className='font-bold'>Student Email : <span className='font-normal'>{selectedStudent[0]?.email}</span></p>
                <p className='font-bold'>Student Class : <span className='font-normal'>{selectedStudent[0]?.class}</span></p>
              </div>
            )}
          </div>

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
            {selectedBook && (
              <div className='pt-2'>
                <p className='font-bold'>Book id : <span className='font-normal'>{selectedBook[0]?.id}</span></p>
                <p className='font-bold'>Book Name : <span className='font-normal'>{selectedBook[0]?.name}</span></p>
                <p className='font-bold'>Book Author : <span className='font-normal'>{selectedBook[0]?.author}</span></p>
                <p className='font-bold'>Book Publisher : <span className='font-normal'>{selectedBook[0]?.publisher}</span></p>
                <p className='font-bold'>Book ISBN : <span className='font-normal'>{selectedBook[0]?.isbn}</span></p>
              </div>
            )}
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

export default ReturnBook
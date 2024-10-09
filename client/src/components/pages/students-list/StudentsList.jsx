
import { getStudents } from '@/api/studentApi'
import { useQuery } from '@tanstack/react-query'
import { AgGridReact } from 'ag-grid-react'
import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

const StudentsList = () => {
  const [search, setSearch] = useState('');
  const { data: studentsList, isPending, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })
  // console.log("studentsList", studentsList);

  const [colDefs] = useState([
    { field: "picture", maxWidth: 100, cellRenderer: (params) => <img src={params.value} alt="Book" className='w-10 h-10 rounded-full' /> },
    { field: "firstName" },
    { field: "lastName" },
    { field: "middleName" },
    { field: "gender" },
    { field: "phoneNo" },
    { field: "email" },
    { field: "class" },
    { field: "address" },
    { field: "city" },
    { field: "state" },
    { field: "pinCode" },
    { field: "assigned to", cellRenderer: () => <span className='underline cursor-pointer'>Books</span> },
    {
      field: "edit", maxWidth: 75,
      cellRenderer: () => (
        <div className='py-2 text-[#0EA5E9]'>
          <Edit />
        </div>
      )
    },
    {
      field: "delete", maxWidth: 75,
      cellRenderer: () => (
        <div className='py-2 text-red-500'>
          <Trash2 />
        </div>
      )
    },
  ]);

  return (
    <div>
      <h2 className='text-center text-3xl my-3 tracking-wider uppercase font-bold'>Books List</h2>

      <div className='px-4 my-4'>
        {/* Search Input */}
        <div className='flex border border-gray-300 items-center my-4 p-2 max-w-sm rounded-lg'>
          <Search className='text-gray-400' />
          <input type="text" placeholder='Search Book'
            className='rounded-md  outline-none text-base w-full ml-2'
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        {/* React Data Grid Component */}
        <div
          className="ag-theme-quartz " // applying the Data Grid theme
          style={{ height: 570 }} // the Data Grid will fill the size of the parent container
        >
          <AgGridReact
            rowData={studentsList}
            columnDefs={colDefs}
            pagination={true} // Enable pagination
            paginationPageSize={20} // Set the number of rows per page
            quickFilterText={search}
          />
        </div>
      </div>
    </div>
  )
}

export default StudentsList
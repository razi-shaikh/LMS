import { getBooks } from '@/api/booksApi';
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { Edit, Search, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [search, setSearch] = useState('');

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  })
  // console.log("books", books);


  const [colDefs,] = useState([
    { field: "picture", maxWidth: 100, cellRenderer: (params) => <img loading='lazy' src={params.value} alt="Book" className='w-10 h-10 rounded-md' /> },
    { field: "name" },
    { field: "author" },
    { field: "publisher" },
    { field: "isbn" },
    { field: "assigned to", cellRenderer: () => <span className='underline cursor-pointer'>Student</span> },
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
            rowData={books}
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

export default Dashboard
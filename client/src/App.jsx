import React from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { AddBook, AddStudent, Analystics, Chart, Dashboard, EditBook, EditStudent, Headers, IssueBook, ProtuctedRoute, ReturnBook, StudentsList, } from './components/pages'

function App() {
  return (
    <BrowserRouter>
      <Headers />
      <Routes>
        <Route path='/' element={<Navigate to={'/dashboard'} />} />
        <Route path='*' element={<Navigate to={'/'} />} />
        <Route element={<ProtuctedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/add-book' element={<AddBook />} />
          <Route path='/add-student' element={<AddStudent />} />
          <Route path='/analystics' element={<Analystics />} />
          <Route path='/chart' element={<Chart />} />
          <Route path='/edit-book' element={<EditBook />} />
          <Route path='/edit-student' element={<EditStudent />} />
          <Route path='/issue-book' element={<IssueBook />} />
          <Route path='/return-book' element={<ReturnBook />} />
          <Route path='/students-list' element={<StudentsList />} />
        </Route >
      </Routes >
    </BrowserRouter >
  )
}

export default App
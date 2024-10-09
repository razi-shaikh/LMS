import { menuItem } from '@/utils/constant'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from "framer-motion";

const Navigation = () => {
  // const [active, setActive] = useState(0)
  const { pathname } = useLocation()

  return (
    <>
      <ul className='p-4 '>
        {menuItem.map(({ title, path }, index) => (
          <motion.div

            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            key={index}>
            <Link to={path}>
              <li className={`my-2 p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white
            ${pathname === path ? "bg-primary text-white" : "bg-gray-100 text-black"}`}>
                {title}
              </li>
            </Link>
          </motion.div>
        ))}
      </ul>
    </>
  )
}

export default Navigation
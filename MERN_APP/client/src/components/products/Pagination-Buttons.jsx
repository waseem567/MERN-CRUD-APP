import * as React from 'react';
import "./Products.css";
import {motion} from "framer-motion";

export default function PaginationButtons() {
    
  return (
   <motion.div animate={{transition: {staggerChildren: ""}}} className='w-full flex justify-center items-center gap-3'>
    <motion.button transition={{type: "spring"}} whileHover={{scale: 1.1}} className='h-[45px] border-2 relative w-[45px] border-grad rounded-full hover:bg-slate-800 hover:text-white'><i className="fa-solid fa-arrow-left"></i></motion.button>
    <motion.button transition={{type: "spring"}} whileHover={{scale: 1.1}} className='h-[45px] border-2 relative w-[45px] border-grad rounded-full hover:bg-slate-800 hover:text-white'>2</motion.button>
    <motion.button transition={{type: "spring"}} whileHover={{scale: 1.1}} className='h-[45px] border-2 relative w-[45px] border-grad rounded-full hover:bg-slate-800 hover:text-white'><i className="fa-solid fa-arrow-right"></i></motion.button>
   </motion.div>
  );
}
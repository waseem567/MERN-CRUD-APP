import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useProductStore from "../zustand-store/store";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/context";
import "./Products.css";
import { ImSpinner9 } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";

const Product = ({ prod, ondelete }) => {
  const auth = useContext(AuthContext);
  const [deleting, setDeleting] = useState(false);
  const editProd = {
    id: prod._id,
    title: prod.title,
    price: prod.price,
    image: prod.image,
  };
  const deleteProd = async () => {
    if (auth.isLoggedIn) {
      setDeleting(true);
      const response = await fetch(
        `https://week-5-task-backend.vercel.app/product/${prod._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + auth.token,
          },
        }
      );
      await response.json();
      ondelete();
    } else {
      toast.error("You are not authenticated! Please sign in first");
    }
  };
  return (
    <div className="max-w-[270px] bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
      <img className=" block w-[270px] h-[250px]" src={prod.image} alt="" />

      <div className="p-5 bg-gray-50">
        <h5 className="mb-2 tracking-tight text-gray-900 ">{prod.title}</h5>

        <p className="mb-3 font-normal text-[#DB4444]">{prod.price} $</p>
        <div className="w-full flex justify-start gap-2 items-center">
          {auth.isLoggedIn && (
            <Link to={`edit`} state={editProd}>
              <button className="border hover:bg-black hover:text-white hover:border-white py-2 px-3 block w-full">
                <i className="fa-regular fa-pen-to-square"></i>{" "}
              </button>
            </Link>
          )}

          <button
            className="hover:bg-black hover:text-white hover:border-white border flex justify-center items-center py-3 gap-3 px-3"
            onClick={deleteProd}
          >
            <RiDeleteBin5Line />
            {deleting && (
              <span className="animate-spin">
                <ImSpinner9 />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;

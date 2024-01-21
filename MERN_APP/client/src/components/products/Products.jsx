/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/context";
import Product from "./Product";

const Products = (props) => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [products, setProducts] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [filteredProducts, setFiltered] = useState([]);
    
  useEffect(() => {
    if(props.query.type === "search"){
    const filtered = products.filter((product) => {
      const searchWords = props.query.searchKeyWord?.toLowerCase().split(" ");
      return searchWords.some((word) =>
        product.title.toLowerCase().includes(word),
      );
    });
    setProducts(filtered);
}else{
    setProducts(filteredProducts);
}
  }, [props.query]);
  console.log(filteredProducts)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await fetch("https://week-5-task-backend.vercel.app/products", {
        method: "POST",
        body: JSON.stringify({
          id: auth.userId
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.token,
        },
      });
      setLoading(false);
      const loadedProducts = await response.json();
      setProducts(loadedProducts);
      setFiltered(loadedProducts);
      
    };
    fetchProducts();
  }, [refetch]);
  const deletingPr = () => {
    setRefetch((prev) => !prev);
  };
  useEffect(()=> {
    if(loading){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "unset";
    }
  }, [loading]);
  return (
    <>
      {products?.length === 0 && !loading && (
        <h1 className="text-center w-full font-extrabold text-3xl pt-6">
          No Product yet!
        </h1>
      )}
      {loading && <h1 className="text-center">Fetching Products....</h1>}
      <div className="flex justify-center my-5 gap-5 flex-wrap ">
        {products.length > 0 &&
          products.map((p) => (
            <Product key={p?._id} prod={p} ondelete={deletingPr} />
          ))}
      </div>
    </>
  );
};

export default Products;

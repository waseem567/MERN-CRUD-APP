import { useRef, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/context";
import "./Form.css";
import toast from "react-hot-toast";

const AddProduct = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  console.log(auth);
  console.log(location.state);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(
    location.state !== null ? true : false
  );
  const [image, setImage] = useState(editMode ? location.state.image : null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState(true);
  const [error, setError] = useState(false);
  const [product, setProduct] = useState({
    title: editMode ? location.state.title : "",
    price: editMode ? location.state.price : "",
  });
  const [titleIsValid, setTitleIsValid] = useState(true);
  const [priceIsValid, setPriceIsValid] = useState(true);
  const [imageValidity, setImageValidity] = useState(true);
  const imageRef = useRef();
  const onClickImageButton = () => {
    imageRef.current.click();
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setImageValidity(true);
    setTitleIsValid(true);
    setPriceIsValid(true);
    setProduct({
      ...product,
      [name]: value,
    });
  };
  console.log("file => ", file);
  const onSelectFile = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === "image/png") {
        if(event.target.files[0].size > 50000){
          setImageSize(false);
          toast.error("File size limit is 50KB")
          return;
        }
        setImageSize(true);
        setImageValidity(true)
        setImage(URL.createObjectURL(event.target.files[0]));
        setFile(event.target.files[0]);
        return;
      }
      setImageValidity(false)
      toast.error("Invalid file type. Only png file supported")
    }
  };
  const onAddNewProduct = async (event) => {
    event.preventDefault();

    if (editMode) {
      setLoading(true);
      console.log("editing...");
      // const formData = new FormData();
      //   formData.append('id', product._id);
      //   formData.append('title', product.title);
      //   formData.append('price', product.price);
      //   formData.append('image', file);
      fetch("https://week-5-task-backend.vercel.app/product", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          id: location.state.id,
          title: product.title,
          price: product.price,
          image: image,
        }),
      })
        .then((resp) => {
          setLoading(false);
          setError(false);
          return navigate("/");
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
          return;
        });
    } else {
      try {
        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("price", product.price);
        formData.append("creator", auth.userId);
        formData.append("image", file);
        if (product.title.trim() === "") {
          return setTitleIsValid(false);
        }
        if (product.price.trim() === "") {
          return setPriceIsValid(false);
        }
        if (!file || !file?.type === "image/png") {
          return setImageValidity(false);
        }
        setLoading(true);
        fetch("https://week-5-task-backend.vercel.app/product", {
          method: "POST",
          body: formData,
          headers: {
            authorization: "Bearer " + auth.token,
          },
        })
          .then((resp) => {
            setLoading(false);
            setError(false);
            return navigate("/");
          })
          .catch((err) => {
            setError(true);
            setLoading(false);
            return;
          });
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error("Error creating product:", error);
        // Handle error scenarios
      }
    }
  };

  return (
    <div className="">
      <h1 className="text-center py-5">ADD PRODUCT</h1>
      <form
        className="max-w-[500px] flex gap-3 flex-col mx-auto"
        onSubmit={onAddNewProduct}
      >
        <input
          className="outline-none border py-2 px-2 block w-full"
          type="text"
          placeholder="Enter title..."
          onChange={handleInputChange}
          value={product.title}
          name="title"
        />
        {!titleIsValid && (
          <p className="text-red-500 text-sm">Title is required!</p>
        )}
        <input
          className="outline-none border py-2 px-2 block w-full"
          type="number"
          placeholder="Enter price..."
          onChange={handleInputChange}
          value={product.price}
          name="price"
        />
        {!priceIsValid && (
          <p className="text-red-500 text-sm">price is required!</p>
        )}
        <button
          type="button"
          className="border py-2 px-2 block w-full hover:bg-slate-100 bg-white"
          onClick={onClickImageButton}
        >
          <i className="fa-solid fa-plus"></i> Pick an image
        </button>
        <input
          className="hidden"
          onChange={onSelectFile}
          type="file"
          name="image"
          ref={imageRef}
        />
        <div
          className={`${
            !imageValidity && "border-red-500"
          } border h-[200px] w-full sm:w-[200px] bg-white mx-auto flex justify-center items-center`}
        >
          {image !== null || editMode ? (
            <img className="block h-full w-full" src={image} alt="grocers" />
          ) : (
            "Preview"
          )}
        </div>
        {!imageValidity && <p className="text-center text-red-500">Only png file is supported!</p>}
        {!imageSize && <p className="text-center text-red-500">Image size should not exceed 50KB!</p>}
        
        {!editMode && (
          <button
            disabled={loading}
            className="border w-full py-2 cursor-pointer bg-black text-white hover:opacity-80 flex justify-center items-center gap-4"
            type="submit"
          >
            {!editMode && loading && !error ? "Adding Product" : "Add Product"}
            {loading && !error && <div className="loader inline-block"></div>}
          </button>
        )}
        {editMode && (
          <button
            disabled={loading}
            className="border w-full py-2 cursor-pointer bg-black text-white hover:opacity-80 flex justify-center items-center gap-4"
            type="submit"
          >
            {!editMode && loading && !error
              ? "Editing Product"
              : "Edit Product"}
            {loading && !error && <div className="loader inline-block"></div>}
          </button>
        )}
      </form>
    </div>
  );
};

export default AddProduct;

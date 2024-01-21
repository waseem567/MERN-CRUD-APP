import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Signin.css";
import { AuthContext } from "../../context/context";
import main_img from "../image/1.png";
import { motion } from "framer-motion";

const SignIn = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [emailValidity, setEmailValidity] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const onLogUserIn = async (event) => {
    event.preventDefault();
    if (user.email.trim() === "") {
      setEmailValidity(true);
      toast.error("Email Can't Be Empty!");
      return;
    }
    if (
      !user.email.trim().includes("@") ||
      !user.email.trim().includes(".com") ||
      !user.email.trim().length > 12
    ) {
      setEmailValidity(true);
      toast.error("Email is not Valid!");
      return;
    }
    if (user.password.trim() === "") {
      setPasswordValidity(true);
      toast.error("Password can not be empty!");
      return;
    }
    setLoading(true);
    const data = await fetch("https://week-5-task-backend.vercel.app/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        password: user.password,
      }),
    });

    if (!data.ok) {
      setLoading(false);
      const response = await data.json();
      toast.error(response.message || "Error Occured!");
      return;
    }
    const response = await data.json();
    setLoading(false);
    toast.success(response.message);
    auth.login(response.userId, response.token);
    return navigate("/");
  };
  useEffect(()=> {
    if(loading){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "unset";
    }
  }, [loading]);
  return (
    <div className="md:grid md:grid-cols-2 h-full md:justify-center">
      {loading && (
        <div className="flex justify-center items-center overlay h-full w-full m-0 p-0 opacity-55 bg-black absolute left-0 top-0 cursor-wait">
          <div className="lds-ring">
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center">
        {" "}
        <img src={main_img} alt="" />
      </div>
      <div className="md:flex md:justify-center md:items-center">
        <form
          className="sm:max-w-[500px] w-full flex gap-3 flex-col mx-auto"
          onSubmit={onLogUserIn}
        >
          <input
            className={`outline-none border py-2 px-2 block w-full ${
              emailValidity && "border-red-500"
            }`}
            type="text"
            placeholder={`${
              !emailValidity ? "Enter email here..." : "Email is compulsory..."
            }`}
            onChange={handleInputChange}
            name="email"
          />
          <input
            className={`outline-none border py-2 px-2 block w-full ${
              passwordValidity && "border-red-500"
            }`}
            type="password"
            placeholder={`${
              !passwordValidity
                ? "Enter password here..."
                : "Password is compulsory..."
            }`}
            onChange={handleInputChange}
            name="password"
          />
          <button
            className="border w-full py-2 cursor-pointer hover:bg-slate-800 bg-black text-white flex justify-center items-center gap-4"
            type="submit"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

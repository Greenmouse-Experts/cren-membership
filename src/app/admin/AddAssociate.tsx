// @ts-nocheck
import React,{useState} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {IoClose} from "react-icons/io5"
import { CustomAdd } from '../services/config';
import { ThreeDots} from "react-loader-spinner";


const AddAssociate = ({onClose}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [logindata, setLoginData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    account_type: "Associate",
    phone_number: "",
  });

  const handleInput = (e) => {
    const{name, value} = e.target;
    setLoginData({ ...logindata, [name]: value });
  }

  const isValidate = () => {
    let isProceed = true;
    let errorMessages = ""; // Create a variable to store error messages

    if (
      logindata.first_name === "" ||
      logindata.last_name === "" ||
      logindata.username === "" ||
      logindata.email === "" ||
      logindata.account_type === "" ||
      logindata.phone_number === ""
    ) {
      isProceed = false;
      errorMessages += "Please fill all inputs. ";
    }

    if (!isProceed) {
      toast.error(errorMessages);
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(logindata.email)) {
        isProceed = false;
        toast.warning("Please enter a valid email");
      }
    }

    return isProceed;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(logindata);
    const fd = new FormData();
    Object.entries(logindata).forEach(([key, value]) => {
      fd.append(key, value);
    });
    if (isValidate()) {
      setIsLoading(true); 

      CustomAdd.post("admin/member/add", fd)
        .then((res) => {
          // console.log(res);
            if(res.status === 200){
              // console.log(res.data)
              // console.log(res.data.errors);
              toast.success("Member Added Successfully");
              onClose(); 
            }
            else{
              // console.log(res);
              // toast.error(res.response.data.code)
            }
            
        })
        .catch((err) => {
          
          Object.entries(err.response.data.errors).forEach(([key,value])=> {
            toast.error(value[0]);
          })
          
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  
  };

  return (
    <div className="add_member">
        <div className="add_head"><p>Add New Member</p> <span onClick={onClose}><IoClose/></span></div>
      <form onSubmit={handleSubmit} action="submit" className="add_mem">
        <div className="input_">
          <label>Account Type</label>
          <div className="radio">
            <div className="">
              <input
                type="radio"
                id="associate"
                name="account_type"
                value="Associate"
                checked={logindata.account_type === "Associate"}
                onChange={handleInput}
              />
              <label htmlFor="associate">Associate</label>
            </div>

            <div className="">
              {" "}
              <input
                type="radio"
                id="fellow"
                name="account_type"
                value="Fellow"
                checked={logindata.account_type === "Fellow"}
                onChange={handleInput}
              />
              <label htmlFor="fellow">Fellow</label>
            </div>
          </div>
        </div>

        <div className="double">
          <div className="input_log">
            <label htmlFor="firstName">First Name</label>
            <div>
              {/* <HiOutlineUser className="icon" /> */}
              <input
                placeholder="Enter First Name"
                id="first_name"
                name="first_name"
                type="text"
                value={logindata.first_name}
                onChange={handleInput}
              />
            </div>
          </div>

          <div className="input_log">
            <label htmlFor="last_name">Last Name</label>
            <div>
              {/* <HiOutlineUser className="icon" /> */}
              <input
                placeholder="Enter Last Name"
                id="last_name"
                name="last_name"
                type="text"
                value={logindata.last_name}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
        <div className="input_log">
          <label htmlFor="username">Username</label>
          <div>
            {/* <HiOutlineUser className="icon" /> */}
            <input
              placeholder="Enter Username"
              id="username"
              name="username"
              type="text"
              value={logindata.username}
              onChange={handleInput}
            />
          </div>
        </div>

        <div className="input_log">
          <label htmlFor="email">Email</label>
          <div>
            {/* <AiOutlineMail className="icon" /> */}
            <input
              placeholder="Enter Email"
              id="email"
              name="email"
              type="email"
              value={logindata.email}
              onChange={handleInput}
            />
          </div>
        </div>

        <div className="input_log">
          <label htmlFor="phone_number">Phone Number</label>
          <div>
            <input
              placeholder="Enter Phone Number"
              id="phone_number"
              name="phone_number"
              type="text"
              value={logindata.phone_number}
              onChange={handleInput}
            />
          </div>
        </div>
      
        {isLoading ? <div className="dotss"><ThreeDots 
height="80" 
width="80" 
radius="9"
color="#4fa94d" 
ariaLabel="three-dots-loading"
wrapperStyle={{}}
wrapperClassName=""
visible={true}
 /></div>  : <button className="add_btn" type="submit" disabled={isLoading}>Add Member </button>}
      </form>
    </div>
  );
};

export default AddAssociate;


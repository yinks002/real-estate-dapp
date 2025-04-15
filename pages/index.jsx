import React, {useState, useEffect} from "react";
import { ethers } from "ethers";

//internal import
import {useStateContext} from "../context";
import {checkIfImage} from "../utils"


const index = () => {
  const {address, contract, connect, realEstate, createPropertyFunction} = useStateContext();

  //state variable
  const [isLoading, setIsLoading]  = useState(false);
  const [properties, setProperties] = useState([]);

  const [form, setForm] = useState({
    propertyTitle: "",
    description: "",
    category: "",
    price: "",
    images: "",
    propertyAddress: ""
  });


  const handleFormFieldChange= (fieldName, e) => {
    setForm({...form, [fieldName]: e.target.value})
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    checkIfImage(form.images, async(exists)=>{
      if(exists) {
        setIsLoading(true);
        await createPropertyFunction({
          ...form,
          price: ethers.utils.parseUnits(form.price)
        });
        setIsLoading(false)
      }else {
        alert("please provide a valid image url")
      }
    })
  }

  return <div>
    <h1> {realEstate} </h1>
    <button onClick = {()=> connect()}> Connect </button>

    <h1>create</h1>
    <form onSubmit= {handleSubmit }>
    <div></div>

    </form>
  </div>;
};

export default index;

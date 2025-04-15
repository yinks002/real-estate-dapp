import React, {useState, useEffect} from "react";
import { ethers } from "ethers";

//internal import
import {useStateContext} from "../context";
import {checkIfImage} from "../utils"


const index = () => {
  const {address, 
    contract, 
    connect, realEstate, 
    createPropertyFunction, getPropertiesData} = useStateContext();

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
  const fetchProperty = async()=>{
    setIsLoading(true);
    const data = await getPropertiesData();
    setProperties(data);
    isLoading(false);

  };
  useEffect(()=>{
    if(contract) fetchProperty();
    
    
  },[address, contract])

  return( <div>
    <h1> {realEstate} </h1>
    <button onClick = {()=> connect()}> Connect </button>

    <h1>create</h1>
    <form onSubmit= {handleSubmit }>
    <div>
      <input type="text" placeholder="propertyTitle" onChange={(e)=> 
        handleFormFieldChange("propertyTitle", e)
      } />
    </div>

    <div>
      <input type="text" placeholder="description" onChange={(e)=> 
        handleFormFieldChange("description", e)
      } />
    </div>


    <div>
      <input type="text" placeholder="category" onChange={(e)=> 
        handleFormFieldChange("category", e)
      } />
    </div>


    <div>
      <input type="number" placeholder="price" onChange={(e)=> 
        handleFormFieldChange("price", e)
      } />
    </div>


    <div>
      <input type="url" placeholder="images" onChange={(e)=> 
        handleFormFieldChange("images", e)
      } />
    </div>


    <div>
      <input type="text" placeholder="propertyAddress" onChange={(e)=> 
        handleFormFieldChange("propertyAddress", e)
      } />
    </div>

    <button type="submit" >Submit</button>


    </form>
  </div>
  );
};

export default index;

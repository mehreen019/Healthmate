import React from 'react'
import { TextField } from '@mui/material'

type InputProp = {
    name:string;
    label:string;
    type:string
}

const CustomizedInput = (prop: InputProp) => {
  return (
    <TextField 
    margin="normal"
    InputLabelProps={{ style: { color: "white" } }}
    name={prop.name}
    label={prop.label}
    type={prop.type}
    InputProps={{
      style: {
        width: "400px",
        borderRadius: 10,
        fontSize: 20,
        color: "white",
      },
    }}
    ></TextField>
  )
}

export default CustomizedInput

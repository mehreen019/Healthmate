import React from 'react';
import { TextField } from '@mui/material';

interface CustomizedInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomizedInput: React.FC<CustomizedInputProps> = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      margin="normal"
      sx={{
        maxWidth: '400px',
        '& .MuiInputBase-root': {
          borderRadius: '8px',
        },
      }}
    />
  );
};

export default CustomizedInput;

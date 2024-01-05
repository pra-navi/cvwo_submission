import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface InputProps {
    name: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    half?: boolean;
    autoFocus?: boolean;
    type?: string;
    handleShowPassword?: () => void;
}

const Input: React.FC<InputProps> = ({ name, handleChange, label, half, autoFocus, type, handleShowPassword }) => {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
        <TextField
            name={name}
            onChange={handleChange}
            variant="outlined"
            required
            fullWidth
            label={label}
            autoFocus={autoFocus}
            type={type}
            InputProps={name === 'password' ? {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                            {type === 'password' ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }: {}} 
        />
    </Grid>
  )
}

export default Input
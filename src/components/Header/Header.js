import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";

import "./Header.css";

function Header({ countries, country, selected }) {
  return (
    <div className='header'>
      <Typography variant='h4' className='header__title'>
        COVID-19 TRACKER
      </Typography>
      <FormControl className='header__formControl'>
        <InputLabel>Countries</InputLabel>
        <Select
          value={country}
          onChange={selected}
          className='header__dropdown'
          label='Countries'>
          <MenuItem value='Worldwide'>Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.code} key={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default Header;

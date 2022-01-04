import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


const Search = () => {

    return (
        <TextField
            label="Search"
            InputProps={{
                endAdornment: (
                    <InputAdornment>
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )

};

export default Search;
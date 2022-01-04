import * as React from 'react';
import Button from '@mui/material/Button';


const MakePackingSlipButton = () => {
    const isDisabled = true;

    return (
        <Button disabled={isDisabled} variant="contained">Make Packing Slip</Button>
    )

};

export default MakePackingSlipButton;


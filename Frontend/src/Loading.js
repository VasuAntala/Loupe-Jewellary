import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
    return (
        <div className='flex items-center h-full justify-center'>
            <CircularProgress size={60} sx={{ color: '#db2777' }} />
        </div>
    );
}

export default Loading

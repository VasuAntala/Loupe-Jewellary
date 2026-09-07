import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginIcon from '@mui/icons-material/Login';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';
import { Button, Box, Typography } from '@mui/material';
import DeliveryAddressForm from './DeliveryAddressForm';
import OrderSummary from './OrderSummary';
import LoginForm from '../../auth/LoginForm';
import RegisterForm from '../../auth/RegisterForm';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: 'linear-gradient(to right, #93291E, #ED213A)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: 'linear-gradient(to right, #93291E, #ED213A)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        background: 'linear-gradient(to right, #93291E, #ED213A)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        background: 'linear-gradient(to right, #93291E, #ED213A)',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <LoginIcon />,
        2: <LocationOnIcon />,
        3: <EventNoteIcon />,
        4: <PaymentIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

const steps = ['Login', 'Delivery Address', 'Order Summary', 'Payment'];

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const querySearch = new URLSearchParams(location.search);
    const stepFromQuery = querySearch.get("step");

    const { jwt: reduxJwt } = useSelector((store) => store.auth);
    const jwt = reduxJwt || localStorage.getItem("jwt");

    const [isLogin, setIsLogin] = useState(true);

    let activeStep = stepFromQuery ? parseInt(stepFromQuery, 10) : (jwt ? 1 : 0);

    const handleAuthSuccess = () => {
        navigate('/checkout?step=1');
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', maxWidth: '900px', shadow: 3, borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', bgcolor: 'white' }}>
                            {isLogin ? (
                                <LoginForm onLoginSuccess={handleAuthSuccess} />
                            ) : (
                                <RegisterForm onRegisterSuccess={handleAuthSuccess} />
                            )}

                            <Box sx={{ p: 4, pt: 0, textAlign: 'center', borderTop: '1px solid #f8fafc', mt: -2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {isLogin ? "New to Loupe Jewellery?" : "Already have an account?"}{' '}
                                    <Button
                                        onClick={() => setIsLogin(!isLogin)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            color: '#3c7399',
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        {isLogin ? "Create an Account" : "Sign In instead"}
                                    </Button>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );
            case 1:
                return <DeliveryAddressForm />;
            case 2:
                return <OrderSummary />;
            default:
                return <DeliveryAddressForm />;
        }
    };

    return (
        <div className='p-10 lg:px-20 lg:py-10 max-w-7xl mx-auto min-h-[80vh]'>
            <Stack sx={{ width: '100%', mb: 8 }}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Stack>

            {renderStepContent(activeStep)}
        </div>
    );
}

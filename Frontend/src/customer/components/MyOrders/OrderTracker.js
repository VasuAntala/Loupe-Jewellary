import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import {
    ShoppingCart,
    CheckCircle2,
    Package,
    Truck,
    Home,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 25,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: '#3c7399',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: '#3c7399',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 2,
        border: 0,
        backgroundColor: '#f1f5f9',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: '#f1f5f9',
    zIndex: 1,
    color: '#64748b',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #e2e8f0',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    ...(ownerState.active && {
        background: '#3c7399',
        color: '#ffffff',
        boxShadow: '0 10px 25px rgba(117, 89, 112, 0.35)',
        borderColor: '#3c7399',
        transform: 'scale(1.1)',
    }),
    ...(ownerState.completed && {
        background: '#f5f0f4',
        color: '#3c7399',
        borderColor: '#d4b8cf',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <ShoppingCart size={20} />,
        2: <CheckCircle2 size={20} />,
        3: <Package size={20} />,
        4: <Truck size={20} />,
        5: <Home size={20} />,
    };

    return (
        <motion.div
            initial={false}
            animate={active ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } } : { scale: 1 }}
        >
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        </motion.div>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

const steps = ['Registry Placed', 'Order Confirmed', 'Boutique Prep', 'In Transit', 'Hand-Delivered'];

export default function OrderTracker({ activeStep }) {
    return (
        <div className='p-8 lg:px-12 lg:py-16 bg-white/50 backdrop-blur-sm rounded-[32px] border border-white/50'>
            <Stack sx={{ width: '100%' }}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel
                                StepIconComponent={ColorlibStepIcon}
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontSize: '0.7rem',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1.5,
                                        mt: 2,
                                        color: '#94a3b8',
                                        '&.Mui-active': { color: '#3c7399' },
                                        '&.Mui-completed': { color: '#3c7399', opacity: 0.7 }
                                    }
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Stack>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { format, startOfWeek, subDays } from 'date-fns';
import Header1 from '../../components/Layout/Header1';
import { useAuth } from '../../context/auth';

// Styled component for Day Button
const DayButton = styled(Button)(({ selected }) => ({
    backgroundColor: selected ? '#4CAF50' : '#fff',
    color: selected ? '#fff' : '#000',
    borderRadius: '12px',
    width: '80px',
    height: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: selected ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : '0px 2px 4px rgba(0, 0, 0, 0.1)',
    fontWeight: selected ? 'bold' : 'normal',
    '&:hover': {
        backgroundColor: selected ? '#388e3c' : '#f0f0f0',
    },
    transition: 'background-color 0.3s, box-shadow 0.3s',
}));

// Styled component for Schedule Card
const ScheduleCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    backgroundColor: '#f5f5f5',
    borderLeft: '8px solid #4CAF50',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#d0f0c0',
    },
}));

const CollectionHistory = () => {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);
    const [auth] = useAuth();

    useEffect(() => {
        const startDay = startOfWeek(new Date(), { weekStartsOn: 0 });
        const days = Array.from({ length: 7 }, (_, i) => subDays(startDay, i)); // Get last 7 days
        setWeekDays(days);

        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                setSchedules(response.data);
                filterSchedules(response.data, new Date());
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, []);

    const filterSchedules = (schedulesList, selectedDate) => {
        const filtered = schedulesList.filter(schedule => {
            const userCity = auth?.user?.address?.city?.toLowerCase();
            return (
                format(new Date(schedule.pickupDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
                schedule.area.toLowerCase() === userCity &&
                schedule.status.toLowerCase() === 'completed'
            );
        });
        setFilteredSchedules(filtered);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        filterSchedules(schedules, day);
    };

    return (
        <Box>
            <Header1 />
            <Container maxWidth="lg" sx={{ p: 2, mt: 5 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Schedule Pickup History
                </Typography>

                {/* Week Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {weekDays.map((day, index) => (
                            <Box key={index} sx={{ mx: 1, textAlign: 'center' }}>
                                <DayButton
                                    selected={format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')}
                                    onClick={() => handleDayClick(day)}
                                >
                                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                                        {format(day, 'EEE')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontSize: '18px' }}>
                                        {format(day, 'd')}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                                        {format(day, 'MMM')}
                                    </Typography>
                                </DayButton>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Schedule Cards */}
                <Box>
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map(schedule => (
                            <ScheduleCard key={schedule._id}>
                                <Typography>Pickup Time: {schedule.pickupTime}</Typography>
                                <Typography>Bin Type: {schedule.binType}</Typography>
                                <Typography>Date: {format(new Date(schedule.pickupDate), 'dd MMM yyyy')}</Typography>
                                <Typography>Status: {schedule.status}</Typography>
                            </ScheduleCard>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                            No completed schedules pickups for this date.
                        </Typography>
                    )}
                </Box>

                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
        </Box>
    );
};

export default CollectionHistory;
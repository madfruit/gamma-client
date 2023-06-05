import React, {useEffect} from 'react';
import {Box, Text} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import {removeUser} from "../features/userSlicer";
import {useAppDispatch} from "../hooks";

type LogoutProps = {

}

const Logout: React.FC<LogoutProps> = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(removeUser());
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return navigate('/');
    });
    return (
        <Box>
        <Text>
            Logging out...
        </Text>
    </Box>
    );
};

export default Logout;

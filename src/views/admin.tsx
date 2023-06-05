import React, {useEffect} from "react";
import {Role} from "package-types";
import {useAppSelector} from "../hooks";
import {useNavigate, Link as ReactLink} from "react-router-dom";
import {Heading, Box, Link, Flex} from '@chakra-ui/react';

const Admin: React.FC = (): JSX.Element => {
    const currentUser = useAppSelector(state => state.user.value);
    const allowedRoles = [Role.ADMIN, Role.AUTHOR, Role.MODERATOR] as string[];
    const navigate = useNavigate();
    const fetchData = async () => {
        if(!currentUser || !allowedRoles.includes(currentUser.role)) {
            return navigate('/users/login');
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    if(!currentUser) {
        return (<Box></Box>);
    }
    switch (currentUser.role) {
        case Role.AUTHOR:
            return (
                <Box>
                    <Heading>Welcome to the {currentUser.role} page!</Heading>
                    <Flex>
                        <Link as={ReactLink} to={'/admin/writeArticle'}>
                            <Box>
                                Write an article
                            </Box>
                        </Link>
                        <Link as={ReactLink} to={'/admin/reviewArticle'}>
                            <Box>
                                Review an article
                            </Box>
                        </Link>
                    </Flex>
                </Box>
            );
        case Role.ADMIN:
            return (
                <Box>
                    <Heading>Welcome to the {currentUser.role} page!</Heading>
                </Box>
            );
        case Role.MODERATOR:
            return (
                <Box>
                    <Heading>Welcome to the {currentUser.role} page!</Heading>
                </Box>
            );
        default: return (<Box></Box>);
    }
}

export default Admin;

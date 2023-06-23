import React, {useEffect} from "react";
import {Role} from "package-types";
import {useAppDispatch, useAppSelector} from "../hooks";
import {useNavigate, Link as ReactLink} from "react-router-dom";
import {Heading, Box, Link, Flex} from '@chakra-ui/react';

const Admin: React.FC = (): JSX.Element => {
    let currentUser = useAppSelector(state => state.user.value);
    const allowedRoles = [Role.ADMIN, Role.AUTHOR, Role.MODERATOR] as string[];
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const fetchData = async () => {
        if(!currentUser || !allowedRoles.includes(currentUser.role)) {
            return navigate('/error403');
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
                    <Heading m={5}>Welcome to the {currentUser.role} page!</Heading>
                    <Flex>
                        <Box m={5}>
                            <Link as={ReactLink} to={'/articles/writeArticle'}>
                                <Box>
                                    Write an article
                                </Box>
                            </Link>
                        </Box>
                        <Box m={5}>
                            <Link as={ReactLink} to={'/admin/reviewArticles'}>
                                <Box>
                                    Review an article
                                </Box>
                            </Link>
                        </Box>
                    </Flex>
                </Box>
            );
        case Role.ADMIN:
            return (
                <Box>
                    <Heading>Welcome to the {currentUser.role} page!</Heading>
                    <Box m={5}>
                        <Link as={ReactLink} to={'/admin/manageRoles'}>
                            <Box>
                                Manage roles
                            </Box>
                        </Link>
                    </Box>
                </Box>
            );
        case Role.MODERATOR:
            return (
                <Box>
                    <Heading>Welcome to the {currentUser.role} page!</Heading>
                    <Flex>
                        <Box m={5}>
                            <Link as={ReactLink} to={'/admin/getReports'}>
                                <Box>
                                    Get reported comments
                                </Box>
                            </Link>
                        </Box>
                    </Flex>
                </Box>
            );
        default: return (<Box></Box>);
    }
}

export default Admin;

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
                <Box m={3}>
                    <Heading m={5}>Сторінка автора</Heading>
                    <Flex>
                        <Box m={5}>
                            <Link as={ReactLink} to={'/articles/writeArticle'}>
                                <Box>
                                    Написати статтю
                                </Box>
                            </Link>
                        </Box>
                        <Box m={5}>
                            <Link as={ReactLink} to={'/admin/reviewArticles'}>
                                <Box>
                                    Рецензувати статтю
                                </Box>
                            </Link>
                        </Box>
                    </Flex>
                </Box>
            );
        case Role.ADMIN:
            return (
                <Box m={3}>
                    <Heading>Сторінка адміністратора</Heading>
                    <Box m={5}>
                        <Link as={ReactLink} to={'/admin/manageRoles'}>
                            <Box>
                                Управління ролями
                            </Box>
                        </Link>
                    </Box>
                </Box>
            );
        case Role.MODERATOR:
            return (
                <Box m={3}>
                    <Heading>Сторінка модератора</Heading>
                    <Flex>
                        <Box m={5}>
                            <Link as={ReactLink} to={'/admin/getReports'}>
                                <Box>
                                    Переглянути скарги
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

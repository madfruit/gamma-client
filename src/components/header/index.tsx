import React from 'react';
import { Box, Heading, Flex, Link } from '@chakra-ui/react';
import UserBox from "./userBox";
import {useAppSelector} from "../../hooks";
import {Link as ReactLink} from "react-router-dom";

const Header: React.FC = () => {
    const user = useAppSelector(state => state.user.value);
    console.log(user);
    return (
        <Flex
            bg="purple.900"
              color="white"
              w="100%"
              h="80px"
              px="6"
              py="5"
              align="center"
              justify="space-between"
        >
            <Box>
                <Link as={ReactLink}  to='/' colorScheme="teal" m={4} >
                    <Heading as="h1" size="xl">
                        Gamma
                    </Heading>
                </Link>
            </Box>
            <UserBox user={ user } />
        </Flex>
    );
};

export default Header;

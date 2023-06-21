import React from 'react';
import { Heading, Flex, Link, Text } from '@chakra-ui/react';
import UserBox from "./userBox";
import {useAppSelector} from "../../hooks";
import {Link as ReactLink} from "react-router-dom";

const Header: React.FC = () => {
    const { value: user } = useAppSelector(state => state.user);
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
            <Flex>
                <Link as={ReactLink}  to='/' colorScheme="teal" m={4} >
                    <Heading as="h1" size="xl">
                        Gamma
                    </Heading>
                </Link>
                { user && (
                    <Flex>
                        <Link as={ReactLink} to='/articles/writeArticle' colorScheme="teal" m={4}>
                            <Text mt={3}>
                                Написати статтю
                            </Text>
                        </Link>
                        <Link as={ReactLink} to='/articles/myArticles' colorScheme="teal" m={4}>
                            <Text mt={3}>
                                Мої статті
                            </Text>
                        </Link>
                    </Flex>
                    )
                }
            </Flex>
            <UserBox user={ user } />
        </Flex>
    );
};

export default Header;

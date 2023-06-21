import React from 'react';
import {Box, Text, Link, Image, Flex} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import {Role, SafeUser} from "package-types";

type HeaderProps = {
    user?: SafeUser;
}

const UserBox: React.FC<HeaderProps> = (props) => {
    const { user } = props;
    if(!user) {
        return (
            <Box p={4}>
                <Link as={ReactLink}  to='/users/login' colorScheme="teal" m={4} >Увійти</Link>
                <Link as={ReactLink} to='/users/register' colorScheme="teal" m={4}>Зареєструватись</Link>
            </Box>
        );
    }
    const { nickname, avatar, email, role } = user;
    return (
        <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Box m={5}>
            {user.avatar
                ? <Image src={avatar} alt='no pic here' borderRadius='full' w={50}/>
                : <Image
                    w={50} borderRadius={25}
                    src={`${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                    alt={'no avatar here'}/>
            }
            </Box>
            <Box>
                <Link as={ReactLink} to={`/users/${user.id}`}>
                    <Text fontSize="lg">{nickname}</Text>
                </Link>
                <Text fontSize="lg">{email}</Text>
            </Box>
            {role !== Role.USER?
            <Box m={10}>
                <Link as={ReactLink} to={'/admin'}>
                    <Text>
                        {role}
                    </Text>
                </Link>
            </Box>
                : <Box></Box>
                }
                <Link as={ReactLink} to={'/users/logout'}>
                    <Text>
                        Вийти
                    </Text>
                </Link>
        </Flex>
    )
};

export default UserBox;

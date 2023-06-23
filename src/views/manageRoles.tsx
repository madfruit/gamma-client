import React, {useEffect, useState} from "react";
import {
    Box,
    Text,
    Image,
    Flex,
    Link,
    Button,
    Select, InputGroup, Input, InputRightElement, Stack
} from '@chakra-ui/react';
import request from "../helpers/request";
import {
    GetUsersByRoleResult,
    Role, SafeUser
} from "package-types";
import {useAppSelector} from "../hooks";
import {useNavigate, Link as ReactLink} from "react-router-dom";
import {AxiosResponse} from "axios";

interface ArticleProps {

}

const ManageRoles: React.FC<ArticleProps> = (props): JSX.Element => {
    const navigate = useNavigate();
    const currentUser = useAppSelector(state => state.user.value);

    const [nickname, setNickname] = useState('');
    const [users, setUsers] = useState<SafeUser[]>([]);
    const [roleToSearch, setRoleToSearch] = useState<string>(Role.AUTHOR);


    const fetchData = async () => {
        if (!currentUser || currentUser.role !== Role.ADMIN) {
            return navigate('/error403');
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const onRoleToSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value;
        setRoleToSearch(role);
    }

    const onSearchButtonClick = async () => {
        const {data} = await request.get<undefined, AxiosResponse<GetUsersByRoleResult>>(`/users/getUsersByRole?role=${roleToSearch}&nickname=${nickname}`);
        setUsers(data.users);
    }

    const onNicknameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }

    return (
        <Box>
            <Flex>
                <Text m={5}>Оберіть роль для пошуку</Text>
                <InputGroup size='lg' m={3} w={1000}>
                    <Input onChange={onNicknameInputChange} placeholder={'Пошук по нікнейму'}/>
                    <InputRightElement mt={1} width='6.5rem' height={'2.5rem'}>
                        <Button m={2} h='1.75rem' size='lg' onClick={onSearchButtonClick}>Шукати</Button>
                    </InputRightElement>
                </InputGroup>
                <Select value={roleToSearch} onChange={onRoleToSearchChange} w={200} m={4}>
                    {Object.values(Role).map((role) => {
                        if(role !== Role.GUEST) {
                            return (<option value={role} key={role}>{role}</option>)
                        }
                    })}
                </Select>
            </Flex>
            <Box>
                <Stack>
                    {users.map(user => {
                        return (
                            <Flex key={user.id}>
                                <Image
                                    src={user.avatar
                                        ? user.avatar
                                        : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                    w={50} borderRadius={25}/>
                                <Link as={ReactLink} to={`/users/${user.id}`}>{user.nickname}</Link>
                            </Flex>
                        )
                    })
                    }
                </Stack>
            </Box>
        </Box>
    )
}

export default ManageRoles;

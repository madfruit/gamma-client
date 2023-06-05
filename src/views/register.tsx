import React, {useState} from "react";
import {
    Box,
    Center,
    Button,
    Text,
    Card,
    CardBody,
    CardHeader,
    Input,
    CardFooter,
    FormLabel
} from '@chakra-ui/react';
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios, {AxiosResponse} from "axios";
import config from "../env/env";
import {RegisterPayload, RegisterResult} from 'package-types';
import {useNavigate} from 'react-router-dom';

const schema = yup.object({
    email: yup.string().email().required(),
    nickname: yup.string().min(3).max(50).required(),
    password: yup.string().min(5).max(30).required(),
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match').required(),
    avatar: yup.mixed(),
}).required();

type FormData = yup.InferType<typeof schema>;

const Register: React.FC = () => {
    const [error, setError] = useState('');
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const fetchData = async (registerData: RegisterPayload) => {
        const {data} = await axios.post<RegisterPayload, AxiosResponse<RegisterResult>>(`${config.beUrl}/users/register`, {...registerData}, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(data);
        if (!data.success) {
            setError(data.message ?? 'Помилка реєстрації');
            return;
        }
        return navigate("/login");
    }

    const onSubmit = (data: FormData) => {
        const { email, password, nickname, avatar} = data;
        fetchData({email, password, nickname, avatar});
    }

    return (
        <Center>
            <Card m={5} w={350} align='center'>
                <CardHeader>
                    Log in
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)} encType={'multipart/form-data'}>
                    <CardBody>
                        <Box mt={4}>
                            <FormLabel>E-mail</FormLabel>
                            <Input type="text" placeholder="E-mail" {...register('email')}/>
                            <Text p={4} color={'red'}>{errors.email?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Nickname</FormLabel>
                            <Input type="text" placeholder="Nickname" {...register('nickname')}/>
                            <Text p={4} color={'red'}>{errors.nickname?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder="Password" {...register('password')}/>
                            <Text p={4} color={'red'}>{errors.password?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Confirm password</FormLabel>
                            <Input type="password" placeholder="Confirm password" {...register('passwordConfirmation')}/>
                            <Text p={4} color={'red'}>{errors.password?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Avatar</FormLabel>
                            <Input type="file" placeholder="Select avatar" {...register('avatar')}/>
                        </Box>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" colorScheme="teal" mt={4}>
                            Register
                        </Button>
                        <Text p={4} color={'red'}>{error}</Text>
                    </CardFooter>
                </form>
            </Card>
        </Center>
    )
}

export default Register;

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
import {AxiosResponse} from "axios";
import config from "../env/env";
import {LoginPayload, LoginResult} from 'package-types';
import {useNavigate} from "react-router-dom";
import request from "../helpers/request";

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(5).max(30).required(),
}).required();

type FormData = yup.InferType<typeof schema>;

const Login: React.FC = () => {
    const [error, setError] = useState('');
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const fetchData = async (loginData: FormData) => {
        const {data} = await request.post<LoginPayload, AxiosResponse<LoginResult>>(`${config.beUrl}/users/login`, {...loginData}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (!data.success) {
            setError('Невірна пошта та/або пароль');
            return;
        }
        const { tokens } = data;
        console.log(tokens);
        localStorage.setItem('access', tokens!.access);
        localStorage.setItem('refresh', tokens!.refresh);
        return navigate('/');
    }

    const onSubmit = (data: LoginPayload) => {
        fetchData(data);
    }

    return (
        <Center>
            <Card m={5} w={350} align='center'>
                <CardHeader>
                    Log in
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody>
                        <Box mt={4}>
                            <FormLabel>E-mail</FormLabel>
                            <Input type="text" id={'email'} placeholder="E-mail" {...register('email')}/>
                            <Text p={4} color={'red'}>{errors.email?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" id={'password'} placeholder="Password" {...register('password')}/>
                            <Text p={4} color={'red'}>{errors.password?.message}</Text>
                        </Box>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" colorScheme="teal" mt={4}>
                            Log In
                        </Button>
                        <Text p={4} color={'red'}>{error}</Text>
                    </CardFooter>
                </form>
            </Card>
        </Center>
    )
}

export default Login;

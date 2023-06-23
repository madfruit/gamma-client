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
    email: yup.string().email('Поле має бути e-mail').required('E-mail-обов\'язкове поле'),
    nickname: yup.string().min(3, 'Мінімальна довжина нікнейма-3 символи').max(50, 'Максимальна довжина нікнейма-50 символів').required('Нікнейм-обов\'язкове поле'),
    password: yup.string().min(5, 'Мінімальна довжина пароля-5 символів').max(30, 'Максимальна довжина пароля-30 символів').required('Пароль-обов\'язкове поле'),
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), undefined], 'Паролі мають співпадати').required(),
    avatar: yup.mixed()
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
        if (!data.success) {
            setError(data.message ?? 'Помилка реєстрації');
            return;
        }
        return navigate("/users/login");
    }

    const onSubmit = (data: FormData) => {
        const { email, password, nickname, avatar} = data;
        fetchData({email, password, nickname, avatar});
    }

    return (
        <Center>
            <Card m={5} w={350} align='center'>
                <CardHeader>
                    Реєстрація
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)} encType={'multipart/form-data'}>
                    <CardBody>
                        <Box mt={4}>
                            <FormLabel>E-mail</FormLabel>
                            <Input type="text" placeholder="E-mail" {...register('email')}/>
                            <Text p={4} color={'red'}>{errors.email?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Нікнейм</FormLabel>
                            <Input type="text" placeholder="Nickname" {...register('nickname')}/>
                            <Text p={4} color={'red'}>{errors.nickname?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Пароль</FormLabel>
                            <Input type="password" placeholder="Password" {...register('password')}/>
                            <Text p={4} color={'red'}>{errors.password?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Повторіть пароль</FormLabel>
                            <Input type="password" placeholder="Confirm password" {...register('passwordConfirmation')}/>
                            <Text p={4} color={'red'}>{errors.password?.message}</Text>
                        </Box>
                        <Box mt={4}>
                            <FormLabel>Аватар</FormLabel>
                            <Input type="file" placeholder="Select avatar" {...register('avatar')} border={'none'}/>
                        </Box>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" colorScheme="teal" mt={4}>
                            Зареєструватись
                        </Button>
                        <Text p={4} color={'red'}>{error}</Text>
                    </CardFooter>
                </form>
            </Card>
        </Center>
    )
}

export default Register;

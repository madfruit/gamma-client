import React, {useEffect, useState} from "react";
import {useNavigate, useParams, Link as ReactLink} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks";
import {
    ChangeAvatarPayload,
    ChangeAvatarResult, ChangeNicknamePayload, ChangeNicknameResult,
    ChangePasswordPayload,
    ChangePasswordResult, GetCommentsByAuthorResult,
    GetUserResult,
    SafeUser,
    Comment, ClearTokensResult, DeleteReportResult, ChangeRolePayload, ChangeRoleResult, Role
} from "package-types";
import request from "../helpers/request";
import {AxiosResponse} from "axios";
import {Box, Image, Flex, Text, Link, Input, Button, IconButton, Heading, Divider, Select} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";
import {setUser as dispatchSetUser, removeUser} from "../features/userSlicer";
import * as yup from "yup";

const passwordSchema = yup.object({
    oldPassword: yup.string().min(5).max(30).required(),
    newPassword: yup.string().min(5).max(30).required(),
    repeatNewPassword: yup.string().oneOf([yup.ref('newPassword'), undefined], 'Passwords must match').required(),
}).required();

const nicknameSchema = yup.object({
    nickname: yup.string().min(3).max(40).required()
}).required();

const User: React.FC = (): JSX.Element => {
    const {userId} = useParams();
    const initialCommentsState: Comment[] = [];
    const currentUser = useAppSelector(state => state.user.value);
    const [user, setUser] = useState<SafeUser | undefined>(undefined);
    const [newAvatar, setNewAvatar] = useState<File | undefined>(undefined);
    const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const [comments, setComments] = useState(initialCommentsState);
    const [avatarErrorMessage, setAvatarErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
    const [nicknameSuccessMessage, setNicknameSuccessMessage] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [nicknameChangeEnabled, setNicknameChangeEnabled] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [role, setRole] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const fetchComments = async (userToFetch: SafeUser) => {
        try {
            const {data} = await request.get<undefined, AxiosResponse<GetCommentsByAuthorResult>>(`/article/getCommentsByAuthor?authorId=${userToFetch.id}`);
            setComments(data.comments);
        } catch (err) {
            console.log(err);
        }
    }
    const fetchData = async () => {
        if (!currentUser) {
            return navigate('/error401');
        }

        if (currentUser.id === userId) {
            setUser(currentUser);
            await fetchComments(currentUser);
        } else {
            try {
                const {data} = await request.get<undefined, AxiosResponse<GetUserResult>>(`/users/${userId}`);
                if (data.user) {
                    setUser(data.user);
                    setRole(data.user.role);
                    setNewNickname(data.user.nickname);
                    await fetchComments(data.user);
                }
            } catch (err) {
                console.log(err);
                return;
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, [userId]);

    const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if( !currentUser || !user || currentUser.id !== user.id) {
            return;
        }
        const allowedFileExtensions = ['jpg', 'jpeg', 'png'];

        const {files} = e.target;
        if (files) {
            const file = files.item(0);
            if (file) {
                const fileExtension = file.name.split('.').pop();
                if (fileExtension && allowedFileExtensions.includes(fileExtension)) {
                    const url = URL.createObjectURL(file);
                    setNewAvatarUrl(url);
                    setNewAvatar(file);
                    setAvatarErrorMessage('');
                } else {
                    setAvatarErrorMessage('Файл не підтримується');
                }
            } else {
                setAvatarErrorMessage('Аватар не вибраний');
            }

        } else {
            setAvatarErrorMessage('Аватар не вибраний');
        }
    }

    const onSetAvatarClick = async () => {
        if( !currentUser || !user || currentUser.id !== user.id) {
            return;
        }
        if (!newAvatar) {
            setAvatarErrorMessage('Аватар не вибраний');
            return;
        }
        try {
            const {data} = await request.put<ChangeAvatarPayload, AxiosResponse<ChangeAvatarResult>>('/users/changeAvatar', {
                avatar: newAvatar
            });
            if (data.avatar) {
                const updatedUser = JSON.parse(JSON.stringify(user)) as SafeUser;
                updatedUser.avatar = data.avatar;
                setUser(updatedUser);
                setNewAvatar(undefined);
                setNewAvatarUrl('');
                dispatch(dispatchSetUser(updatedUser));
            }
        } catch (err) {
            setAvatarErrorMessage('Аватар не вибраний');
        }
    }

    const onOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value);
    }
    const onNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    }
    const onRepeatNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatNewPassword(e.target.value);
    }

    const onChangePasswordClick = async () => {
        if( !currentUser || !user || currentUser.id !== user.id) {
            return;
        }
        try {
            await passwordSchema.validate({oldPassword, newPassword, repeatNewPassword});
            const {data} = await request.put<ChangePasswordPayload, AxiosResponse<ChangePasswordResult>>('/users/changePassword', {
                currentPassword: oldPassword,
                newPassword
            });
            if (data.success) {
                setPasswordErrorMessage('');
                setPasswordSuccessMessage('Пароль успішно змінено');
            } else {
                setPasswordSuccessMessage('');
                if (data.errorMessage) {
                    setPasswordErrorMessage(data.errorMessage);
                } else {
                    setPasswordErrorMessage('Помилка. Спробуйте пізніше');
                }
            }
        } catch (err) {
            setPasswordErrorMessage('Паролі мають бути довжиною від 5 до 30 символів, а новий пароль треба повторити двічі');
            setPasswordSuccessMessage('');
            return;
        }
    }

    const onChangeNicknameButtonClick = () => {
        setNicknameChangeEnabled(true);
    }

    const onNicknameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNickname(e.target.value);
    }

    const onSaveNicknameButtonClick = async () => {
        if( !currentUser || !user || currentUser.id !== user.id) {
            return;
        }
        try {
            await nicknameSchema.validate({nickname: newNickname});
        } catch (err) {
            setNicknameSuccessMessage('');
            setNicknameErrorMessage('Нікнейм має бути довжиною від 3 до 40 символів!');
            return;
        }
        try {
            const {data} = await request.put<ChangeNicknamePayload, AxiosResponse<ChangeNicknameResult>>('/users/changeNickname', {
                nickname: newNickname
            });
            if (data.errorMessage) {
                setNicknameSuccessMessage('');
                setNicknameErrorMessage('Помилка! Спробуйте пізніше');
            } else {
                setNicknameErrorMessage('');
                setNicknameSuccessMessage('Нікнейм змінено!');
                setNicknameChangeEnabled(false);
                if (user) {
                    const updatedUser = JSON.parse(JSON.stringify(user)) as SafeUser;
                    updatedUser.nickname = data.nickname;
                    dispatch(dispatchSetUser(updatedUser));
                    setUser(updatedUser);
                }
            }
        } catch (err) {
            setNicknameSuccessMessage('');
            setNicknameErrorMessage('Помилка! Спробуйте пізніше');
        }
    }

    const onClearTokensButtonClick = async () => {
        if( !currentUser || !user || currentUser.id !== user.id) {
            return;
        }
        try {
            const {data} = await request.delete<undefined, AxiosResponse<ClearTokensResult>>('/users/clearTokens');
            if (data.success) {
                return navigate('/users/logout');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onDeleteMyselfClick = async () => {
        if (currentUser && userId === currentUser.id) {
            await request.delete<undefined, AxiosResponse<DeleteReportResult>>(`/users/deleteUser/${userId}`);
            dispatch(removeUser());
            return navigate('/');
        }
    }

    const onChangeRoleButtonClick = async () => {
        if (!role || role === user?.role) {
            return;
        }
        const {data} = await request.put<ChangeRolePayload, AxiosResponse<ChangeRoleResult>>(`/users/changeRole/`, {
            userId,
            role
        });
        console.log(data);
    }

    const onChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value;
        setRole(role);
    }


    return (
        <Box m={5}>
            {user &&
            <Flex>
                <Box>
                    <Flex>
                        <Image
                            src={user.avatar ?? `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                            w={200}
                            borderRadius={100}
                            alt={'Аватар не вдалось завантажити'}/>
                        <Box mt={75} ml={10}>
                            <Flex w={300}>
                                {nicknameChangeEnabled
                                    ? <Box>
                                        <Input mb={2} type={'text'} value={newNickname}
                                               onChange={onNicknameInputChange}/>
                                        <Button onClick={onSaveNicknameButtonClick}>Зберегти</Button>
                                    </Box>
                                    : <Flex mt={1}>
                                        <Text fontSize={'2xl'}>{user.nickname}</Text>
                                        {currentUser && user.id === currentUser.id &&
                                        <IconButton ml={5} icon={<EditIcon/>} aria-label={"Змінити нікнейм"}
                                                    onClick={onChangeNicknameButtonClick}/>
                                        }
                                    </Flex>
                                }
                            </Flex>
                            {nicknameErrorMessage && (
                                <Box><Text color={'red'}>{nicknameErrorMessage}</Text></Box>
                            )}
                            {nicknameSuccessMessage && (
                                <Box><Text color={'green'}>{nicknameSuccessMessage}</Text></Box>
                            )}
                            <Text fontSize={'2xl'}>{user.email}</Text>
                            <Text fontSize={'2xl'}>Роль: {user.role}</Text>
                        </Box>
                    </Flex>
                    { currentUser && currentUser.role === Role.ADMIN && currentUser.id !== user.id && (
                        <Box>
                            <Select value={role} onChange={onChangeRole}>
                                {Object.values(Role).map((role) => {
                                    if(role !== Role.GUEST) {
                                        return (
                                            <option value={role} key={role}>{role}</option>
                                        )
                                    }
                                })}
                            </Select>
                            <Button onClick={onChangeRoleButtonClick}>Змінити роль</Button>
                        </Box>
                    )}
                    {currentUser && user.id === currentUser.id &&
                    <Box m={7}>
                        <Input type={'file'} placeholder={'Завантажте новий аватар'} onChange={onAvatarChange}
                               border={'none'}/>
                        <Button m={3} onClick={onSetAvatarClick}>Змінити</Button>
                    </Box>
                    }
                    {newAvatarUrl &&
                    <Box>
                        <Image
                            src={newAvatarUrl}
                            w={200}
                            borderRadius={100}
                            alt={'Аватар не вдалось завантажити'}/>
                    </Box>
                    }
                    {currentUser && user.id === currentUser.id &&
                    <Box m={7}>
                        <Text m={5}>Введіть старий пароль</Text>
                        <Input type={'password'} placeholder={"Старий пароль"} w={300} onChange={onOldPasswordChange}/>
                        <Text m={5}>Введіть новий пароль</Text>
                        <Input type={'password'} placeholder={"Новий пароль"} w={300} onChange={onNewPasswordChange}/>
                        <Text m={5}>Повторіть новий пароль</Text>
                        <Input type={'password'} placeholder={"Повторіть новий пароль"} w={300}
                               onChange={onRepeatNewPasswordChange}/>
                        <Box m={5}><Button onClick={onChangePasswordClick}>Змінити пароль</Button></Box>
                        {passwordErrorMessage && (
                            <Box><Text color={'red'}>{passwordErrorMessage}</Text></Box>
                        )}
                        {passwordSuccessMessage && (
                            <Box><Text color={'green'}>{passwordSuccessMessage}</Text></Box>
                        )}
                    </Box>
                    }
                    {currentUser && user.id === currentUser.id &&
                    <Box>
                        <Button m={7} background={'red'} onClick={onClearTokensButtonClick}>
                            Вийти на всіх пристроях
                        </Button>
                        <Button m={7} background={'red'} onClick={onDeleteMyselfClick}>
                            Видалити акаунт
                        </Button>
                    </Box>
                    }
                </Box>
                <Box w={500} m={10}>
                    <Heading>Коментарі:</Heading>
                    {
                        comments.map(comment => {
                            return (
                                <Box key={comment.id}>
                                    <Text
                                        dangerouslySetInnerHTML={{__html: `${comment.text}   ${new Date(comment.createdAt).toLocaleString('uk-UA')}`}}/>
                                    <Link as={ReactLink} to={`/articles/${comment.articleId}`}>Стаття</Link>
                                    <Divider/>
                                </Box>
                            )
                        })
                    }
                </Box>
            </Flex>
            }
        </Box>
    )
}

export default User;

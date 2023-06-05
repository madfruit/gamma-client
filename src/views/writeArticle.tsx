import React, {useState} from "react";
import {Box, Heading, Image, Input, Button} from '@chakra-ui/react';
import request from "../helpers/request";
import {
    RequestAddArticlePayload, RequestAddArticleResult,
    Role,
} from "package-types";
import {AxiosResponse} from 'axios';
import {useAppSelector} from "../hooks";
import {Navigate} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import config from "../env/env";

const WriteArticle: React.FC = (): JSX.Element => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [sendResult, setSendResult] = useState(false);
    const [sendErrorMessage, setSendErrorMessage] = useState('');
    const [imageURL, setImageURL] = useState(`${process.env.PUBLIC_URL}/images/image-placeholder.png`);
    const [image, setImage] = useState({});
    const currentUser = useAppSelector(state => state.user.value);
    const allowedRoles = [Role.ADMIN, Role.AUTHOR, Role.MODERATOR] as string[];
    if(!currentUser || !allowedRoles.includes(currentUser.role)) {
        return (<Navigate to='/users/login' replace/>);
    }
    const onClick = async () => {
        console.log('aaaaaaaaaaaaaaaaaaa');
        console.log(title);
        console.log(text);
        console.log(image);
        if(title && text) {
            const result = await request.post<RequestAddArticlePayload, AxiosResponse<RequestAddArticleResult>>(`${config.beUrl}/article/proposeArticle`, {
                title,
                text,
                authorId: currentUser.id,
                image
            });
            console.log(result);
        }
    }

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const images = e.target.files;
        if(images) {
            const rawImage = images[0];
            const url = URL.createObjectURL(rawImage);
            setImage(rawImage);
            setImageURL(url);
        } else {
            setImageURL(`${process.env.PUBLIC_URL}/images/image-placeholder.png`);
        }
    }
    return (
        <Box>
            <Input type={'file'} placeholder={'Головне зображення для статті'} onChange={onImageChange}/>
            <Image src={imageURL} alt={'no image here'} w={150}/>
            <Heading>Title</Heading>
            <ReactQuill theme="snow" value={title} onChange={setTitle} />
            <Heading>Text</Heading>
            <ReactQuill theme="snow" value={text} onChange={setText} />
            <Button onClick={onClick}>
                Send for review
            </Button>
        </Box>
    )
}

export default WriteArticle;

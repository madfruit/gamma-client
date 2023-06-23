import React, {useState} from "react";
import {Box, Heading, Image, Input, Button, Card, CardBody, Text, CloseButton, Flex} from '@chakra-ui/react';
import request from "../helpers/request";
import {
    RequestAddArticlePayload, RequestAddArticleResult,
} from "package-types";
import {AxiosResponse} from 'axios';
import {useAppSelector} from "../hooks";
import {Navigate, useNavigate} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import config from "../env/env";
import sanitize from "sanitize-html";

import 'quill-image-uploader/dist/quill.imageUploader.min.css';


const WriteArticle: React.FC = (): JSX.Element => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tag, setTag] = useState('');
    const tagsInitialState: string[] = [];
    const [tags, setTags] = useState(tagsInitialState);
    const [sendResult, setSendResult] = useState(false);
    const [sendErrorMessage, setSendErrorMessage] = useState('');
    const [imageURL, setImageURL] = useState(`${process.env.PUBLIC_URL}/images/image-placeholder.png`);
    const [image, setImage] = useState({});
    const currentUser = useAppSelector(state => state.user.value);
    const navigate = useNavigate();
    if(!currentUser) {
        return (<Navigate to='/users/login' replace/>);
    }
    const onClick = async () => {
        console.log(text);
        const sanitizedTitle = sanitize(title);
        const sanitizedText = sanitize(text, {
            allowedTags: sanitize.defaults.allowedTags.concat([ 'img' ]),
            allowedAttributes: {'img': ['src']},
            allowedSchemes: [ 'data', 'http', 'https']
        });
        if(title && text) {
            try {
                const {data} = await request.post<RequestAddArticlePayload, AxiosResponse<RequestAddArticleResult>>(`${config.beUrl}/article/proposeArticle`, {
                    title: sanitizedTitle,
                    text: sanitizedText,
                    authorId: currentUser.id,
                    tags,
                    image
                });
                if (data.article) {
                    return navigate('/articles/myArticles');
                }
            } catch (err) {
                setSendErrorMessage('Не вдалось запропонувати статтю. Пам\'ятайте, що всі наявні поля є обов\'язковими для заповнення');
                console.log(err);
            }
        }
    }

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
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

    const onTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setTag(value);
    }

    const onTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            if(tag) {
                const sanitizedTag = sanitize(tag, {
                    allowedTags: [],
                    allowedAttributes: { },
                    allowedIframeHostnames: []
                });
                if(sanitizedTag) {
                    setTags([...tags, sanitizedTag]);
                    setTag('');
                }
            }
        }
    }

    const onRemoveButtonClick = (text: string) => () => {
        const currentTags = JSON.parse(JSON.stringify(tags));
        currentTags.splice(tags.indexOf(text), 1);
        setTags(currentTags);
    }

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    }

    return (
        <Box m={6}>
            <Input mb={5} border={'none'} type={'file'} placeholder={'Головне зображення для статті'} onChange={onImageChange}/>
            <Image mb={5} src={imageURL} alt={'no image here'} w={300}/>
            <Heading mb={5}>Заголовок</Heading>
            <Input type={'text'} placeholder={'Заголовок'} onChange={onTitleChange} />
            <Heading mb={5}>Теги</Heading>
            <Flex wrap={"wrap"}>
                {tags.map((tag) => {
                    return (
                        <Card maxW={'max-content'} m={2}>
                            <CardBody>
                                <Flex>
                                    <Text m={1}>{tag}</Text>
                                    <CloseButton onClick={onRemoveButtonClick(tag)}/>
                                </Flex>
                            </CardBody>
                        </Card>
                    )
                })
                }
            </Flex>
            <Input mb={5} type={'text'} value={tag} placeholder={'Теги'} onChange={onTagsChange} onKeyPress={onTagInputKeyPress} />
            <Heading mt={5} mb={5}>Текст</Heading>
            <ReactQuill theme="snow" value={text} onChange={setText} modules={quillModules} />
            <Text color={'red'} m={2}>{sendErrorMessage}</Text>
            <Button mt={5} onClick={onClick}>
                Готово
            </Button>
        </Box>
    )
}

export default WriteArticle;

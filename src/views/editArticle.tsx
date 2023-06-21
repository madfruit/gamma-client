import React, {useEffect, useState} from "react";
import {
    Box,
    Heading,
    Image,
    Input,
    Button,
    Card,
    CardBody,
    Text,
    CloseButton,
    Flex,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Divider,
    DrawerFooter,
    Drawer,
    useDisclosure, Link
} from '@chakra-ui/react';
import request from "../helpers/request";
import {
    ApproveArticlePayload, ArticleWithUsers,
    EditArticlePayload, EditArticleResult,
    GetArticleResult, GetRemarksResult, RemarkWithUser,
    Role,
} from "package-types";
import {AxiosResponse} from 'axios';
import {useAppSelector} from "../hooks";
import {Link as ReactLink, Navigate, useNavigate, useParams} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sanitize from "sanitize-html";

import 'quill-image-uploader/dist/quill.imageUploader.min.css';

const EditArticle: React.FC = (): JSX.Element => {
    const {articleId} = useParams();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tag, setTag] = useState('');
    const tagsInitialState: string[] = [];
    const [tags, setTags] = useState(tagsInitialState);
    const initialRemarksState: RemarkWithUser[] = [];
    const [remarks, setRemarks] = useState(initialRemarksState);
    const [imageURL, setImageURL] = useState(`${process.env.PUBLIC_URL}/images/image-placeholder.png`);
    const [image, setImage] = useState<File | undefined>(undefined);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [article, setArticle] = useState<ArticleWithUsers | null>(null);
    const currentUser = useAppSelector(state => state.user.value);
    const navigate = useNavigate();

    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<GetArticleResult>>(`/article/getArticle/${articleId}`);
        const {article: fetchedArticle} = data;
        setArticle(fetchedArticle);
        if(!fetchedArticle) {
            return (<Navigate to='/users/login' replace/>);
        }
        if (fetchedArticle) {
            setImageURL(fetchedArticle.image);
            setTitle(fetchedArticle.title);
            setText(fetchedArticle.text);
            setTags(fetchedArticle.tags ?? []);
        }
        const {data: remarksData} = await request.get<undefined, AxiosResponse<GetRemarksResult>>(`/article/getRemarks/${articleId}`);
        setRemarks(remarksData.remarks);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (!currentUser) {
        return (<Navigate to='/users/login' replace/>);
    }

    const handleClick = (e: React.MouseEvent) => {
        if (e.detail === 2) {
            onOpen();
        }
    }

    const onClick = async () => {
        const sanitizedTitle = sanitize(title);
        const sanitizedText = sanitize(text, {
            allowedTags: sanitize.defaults.allowedTags.concat([ 'img' ]),
            allowedAttributes: {'img': ['src']},
            allowedSchemes: [ 'data', 'http', 'https']
        });
        let chosenImage;
        if(image) {
            chosenImage = image;
        } else {
            chosenImage = imageURL;
        }
        try {
            if (sanitizedText && sanitizedTitle) {
                const {data} = await request.put<EditArticlePayload, AxiosResponse<EditArticleResult>>(`/article/editArticle/${articleId}`, {
                    title: sanitizedTitle,
                    text: sanitizedText,
                    authorId: currentUser.id,
                    tags,
                    image: chosenImage
                });
                if (data.success) {
                    return navigate('/articles/myArticles');
                } else {
                    throw new Error('Не вдалось відредагувати статтю');
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const images = e.target.files;
        if (images) {
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
        if (e.key === 'Enter') {
            if (tag) {
                const sanitizedTag = sanitize(tag, {
                    allowedTags: [],
                    allowedAttributes: {},
                    allowedIframeHostnames: []
                });
                if (sanitizedTag) {
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

    const handlePublish = async () => {
        if (!article) {
            return;
        }
        try {
            await request.post<ApproveArticlePayload, AxiosResponse<ApproveArticlePayload>>('article/approveArticle', {
                articleId: article.id
            });
        } catch (err) {
            console.log(err);
        }
        return navigate('/admin');
    }

    const quillModules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    }

    return (
        <Box m={6}>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader>Зауваження</DrawerHeader>

                    <DrawerBody>
                        <Box>
                            {
                                remarks.map(remark => {
                                    return (
                                        <Box key={remark.id}>
                                            <Text>{remark.text}</Text>
                                            <Divider/>
                                        </Box>
                                    )
                                })}
                            {
                                remarks.map((remark, index) => {
                                    return (
                                        <Box key={index}>
                                            {remark.author
                                                ? <Link as={ReactLink} to={`/users/${remark.authorId}`}>
                                                    <Image
                                                        w={50} borderRadius={25}
                                                        src={remark.author.avatar ? remark.author.avatar : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                                        alt={'no avatar here'}/>
                                                    <Text>{remark.author.nickname}</Text>
                                                </Link>
                                                : <Box>
                                                    <Image
                                                        w={50} borderRadius={25}
                                                        src={`${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                                        alt={'no avatar here'}/>
                                                    <Text>Deleted reviewer</Text>
                                                </Box>
                                            }
                                            <Text>{remark.text}</Text>
                                            <Divider/>
                                        </Box>
                                    )
                                })}
                        </Box>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Закрити
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Box onClick={handleClick}>
                <Input mb={5} border={'none'} type={'file'} placeholder={'Головне зображення для статті'}
                       onChange={onImageChange}/>
                <Image mb={5} src={imageURL} alt={'no image here'} w={300}/>
                <Heading mb={5}>Заголовок</Heading>
                <ReactQuill theme="snow" value={title} onChange={setTitle}/>
                <Heading mb={5}>Теги</Heading>
                <Flex wrap={"wrap"}>
                    {tags.map((tag, index) => {
                        return (
                            <Card maxW={'max-content'} m={2} key={index}>
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
                <Input mb={5} type={'text'} value={tag} placeholder={'Головне зображення для статті'}
                       onChange={onTagsChange} onKeyPress={onTagInputKeyPress}/>
                <Heading mt={5} mb={5}>Текст</Heading>
                <ReactQuill theme="snow" value={text} onChange={setText} modules={quillModules}/>
                <Button mt={5} onClick={onClick}>
                    Готово
                </Button>
                { (currentUser && currentUser.role === Role.AUTHOR) &&
                <Button mt={5} ml={5} onClick={handlePublish}>
                    Опублікувати
                </Button>
                }
            </Box>
        </Box>
    )
}

export default EditArticle;

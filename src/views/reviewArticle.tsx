import React, {useEffect, useState} from "react";
import {
    Box,
    Text,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerFooter,
    Button,
    Divider,
    CloseButton,
    Textarea
} from '@chakra-ui/react';
import request from "../helpers/request";
import {
    ApproveArticlePayload,
    ArticleWithUsers,
    GetArticleResult,
    GetRemarksResult,
    RejectArticlePayload,
    RejectArticleResult,
} from "package-types";
import {AxiosResponse} from 'axios';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import {DrawerCloseButton} from "@chakra-ui/react";
import {DrawerHeader} from "@chakra-ui/react";
import {Remark} from "package-types";
import Article from "../components/articles/article";

interface ArticleProps {

}

const ReviewArticle: React.FC<ArticleProps> = (props): JSX.Element => {
    const navigate = useNavigate();
    const [remark, setRemark] = useState('');
    const initialRemarksState: string[] = [];
    const initialFetchedRemarksState: Remark[] = [];
    const [remarks, setRemarks] = useState(initialRemarksState);
    const [fetchedRemarks, setFetchedRemarks] = useState(initialFetchedRemarksState);
    const {id} = useParams();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [article, setArticle] = useState<ArticleWithUsers | undefined>(undefined);
    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<GetArticleResult>>(`/article/getArticle/${id}`);
        const {article: fetchedArticle} = data;
        if (fetchedArticle) {
            setArticle(fetchedArticle);
        }
        const {data: remarksData} = await request.get<undefined, AxiosResponse<GetRemarksResult>>(`/article/getRemarks/${id}`);
        console.log(remarksData);
        setFetchedRemarks(remarksData.remarks);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (e.detail === 2) {
            onOpen();
        }
    }

    const handleRemarkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRemark(e.target.value);
    }

    const handleAddRemark = () => {
        setRemarks([...remarks, remark]);
        setRemark('');
    }

    const handleRemoveRemark = (text: string) => () => {
        const currentRemarks = JSON.parse(JSON.stringify(remarks));
        currentRemarks.splice(remarks.indexOf(text), 1);
        setRemarks(currentRemarks);
    }

    const handleSave = async () => {
        if (!article || remarks.length === 0) {
            return;
        }
        try {
            const {data} = await request.post<RejectArticlePayload, AxiosResponse<RejectArticleResult>>('article/rejectArticle', {
                articleId: article.id,
                remarks
            });
            setRemarks([]);
            setFetchedRemarks([...fetchedRemarks, ...data.remarks]);
        } catch (err) {
            console.log(err);
        }
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

    return (
        <Box onClick={handleClick}>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader>Додати зауваження</DrawerHeader>

                    <DrawerBody>
                        <Textarea placeholder='Що саме варто змінити' value={remark} onChange={handleRemarkChange}/>
                        <Box>
                            {
                                fetchedRemarks.map(remark => {
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
                                            <CloseButton onClick={handleRemoveRemark(remark)}/>
                                            <Text>{remark}</Text>
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
                        <Button colorScheme='teal' onClick={handleAddRemark} mr={3}>Додати</Button>
                        <Button colorScheme='blue' onClick={handleSave}>Зберегти</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Box>
                <Article article={article}/>
            </Box>
            <Button onClick={handlePublish}>Опублікувати</Button>
        </Box>
    )
}

export default ReviewArticle;

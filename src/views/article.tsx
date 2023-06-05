import React, {useEffect, useState} from "react";
import {Box, Text, Heading, Image, Flex, Link} from '@chakra-ui/react';
import request from "../helpers/request";
import {ArticleWithUsers, GetArticleResult} from "package-types";
import {AxiosResponse} from 'axios';
import {useAppDispatch} from "../hooks";
import {setUser, removeUser} from "../features/userSlicer";
import {Link as ReactLink} from "react-router-dom";
import {useParams} from "react-router-dom";

interface ArticleProps {

}

const Article: React.FC<ArticleProps> = (props): JSX.Element => {
    const {id} = useParams();
    console.log(id);
    const [article, setArticle] = useState<ArticleWithUsers | undefined>(undefined);
    const dispatch = useAppDispatch();
    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<GetArticleResult>>(`/article/${id}`);
        const {article: fetchedArticle, currentUser} = data;
        if (fetchedArticle) {
            setArticle(fetchedArticle);
        }
        if (currentUser) {
            dispatch(setUser(currentUser));
        } else {
            dispatch(removeUser());
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Box>
            {article
                ?
                <Box>
                    <Flex>
                        <Image src={article.image? article.image : 'https://picsum.photos/300'} borderRadius={10} m={5} alt={'article title pic here'} />
                        <Heading m={5}>{article.title}</Heading>
                    </Flex>
                    {article.author
                        ? <Box>
                            <Link as={ReactLink} to={`/users/${article.authorId}`}>
                                <Image src={article.author.avatar ? article.author.avatar : 'https://picsum.photos/50'}
                                       alt={'no avatar here'}/>
                                <Text>{article.author.nickname}</Text>
                            </Link>
                        </Box>
                        : <Box>
                            <Image src={'https://picsum.photos/50'} alt={'no avatar here'}/>
                            <Text>Deleted author</Text>
                        </Box>
                    }
                    <Box>
                        <Text>{article.text}</Text>
                    </Box>
                    {article.reviewer
                        ? <Box>
                            <Link as={ReactLink} to={`/users/${article.authorId}`}>
                                <Image
                                    src={article.reviewer.avatar ? article.reviewer.avatar : 'https://picsum.photos/50'}
                                    alt={'no avatar here'}/>
                                <Text>{article.reviewer.nickname}</Text>
                            </Link>
                        </Box>
                        : <Box>
                            <Image src={'https://picsum.photos/50'} alt={'no avatar here'}/>
                            <Text>Deleted reviewer</Text>
                        </Box>
                    }
                </Box>
                : <Box>404</Box>
            }
        </Box>
    )
}

export default Article;

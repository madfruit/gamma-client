import React, {useEffect, useState} from "react";
import {Box, Text, Heading, Stack, StackItem, Image, Flex, Link} from '@chakra-ui/react';
import {RouteComponentProps} from "@reach/router";
import request from "../helpers/request";
import {ArticleWithUsers, SearchArticlesResult} from "package-types";
import {AxiosResponse} from 'axios';
import {useAppDispatch} from "../hooks";
import {setUser, removeUser} from "../features/userSlicer";
import {Link as ReactLink} from "react-router-dom";

interface HomeProps extends RouteComponentProps {

}

const Home: React.FC<HomeProps> = (): JSX.Element => {
    const initialState: ArticleWithUsers[] = [];
    const [articles, setArticles] = useState(initialState);
    const dispatch = useAppDispatch();
    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<SearchArticlesResult>>('/article/searchArticles');
        const {articles, currentUser} = data;
        setArticles(articles);
        console.log(articles);
        if(currentUser) {
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
            <Stack>
                {articles.map(article => {
                    return (
                        <StackItem key={article.id}>
                            <Box>
                                <Link as={ReactLink}  to={`/articles/${article.id}`} colorScheme="teal" m={4} >
                                    <Flex>
                                        <Image src="https://picsum.photos/100" alt="some image" />
                                        <Box ml={5}>
                                            <Heading>{article.title}</Heading>
                                            <Text>{article.text}</Text>
                                        </Box>
                                    </Flex>
                                </Link>
                            </Box>
                        </StackItem>
                    )
                })};
            </Stack>
        </Box>
    )
}

export default Home;

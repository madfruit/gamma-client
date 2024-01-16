import React, {useEffect, useState} from "react";
import {Box} from '@chakra-ui/react';
import request from "../helpers/request";
import {ArticleWithUsers, SearchArticlesResult} from "package-types";
import {AxiosResponse} from 'axios';
import ArticlesList from "../components/articles/articlesList";
import Paginator from "../components/paginator";


const Home: React.FC = (): JSX.Element => {
    const initialState: ArticleWithUsers[] = [];
    const [articles, setArticles] = useState(initialState);
    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<SearchArticlesResult>>('/article/searchArticles');
        const {articles: fetchedArticles} = data;
        setArticles(fetchedArticles);
    }
    useEffect(() => {
        fetchData();
    }, []);
    const onPageClick = async (page: number) => {
        const {data} = await request.get<undefined, AxiosResponse<SearchArticlesResult>>(`/article/searchArticles?page=${page}`);
        const {articles} = data;
        articles.length && setArticles(articles);
    }
    return (
        <Box>
            <ArticlesList articles={articles} review={false} />
            <Paginator render={onPageClick} />
        </Box>
    )
}

export default Home;

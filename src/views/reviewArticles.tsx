import React, {useEffect, useState} from "react";
import {Box, Stack} from '@chakra-ui/react';
import request from "../helpers/request";
import {ArticleWithUsers, GetArticlesForReviewResult} from "package-types";
import {AxiosResponse} from 'axios';
import ArticlesList from "../components/articles/articlesList";
import Paginator from "../components/paginator";

const ReviewArticles: React.FC = (): JSX.Element => {
    const initialState: ArticleWithUsers[] = [];
    const [articles, setArticles] = useState(initialState);
    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<GetArticlesForReviewResult>>('/article/getArticlesForReview?page=1');
        const {articles} = data;
        setArticles(articles);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const onPageClick = async (page: number)  => {
        const {data} = await request.get<undefined, AxiosResponse<GetArticlesForReviewResult>>(`/article/getArticlesForReview?page=${page}`);
        const {articles} = data;
        if(articles.length) {
            setArticles(articles);
            return true;
        }
        return false;
    }

    return (
        <Box>
            <Stack>
                return (
                <ArticlesList articles={articles} review={true} />
                )
            </Stack>
            <Paginator render={onPageClick} />
        </Box>
    )
}

export default ReviewArticles;

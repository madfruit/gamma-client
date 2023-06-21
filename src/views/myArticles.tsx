import React, {useEffect, useState} from "react";
import request from "../helpers/request";
import {ArticleWithUsers, SearchArticlesResult} from "package-types";
import {AxiosResponse} from 'axios';
import {useAppSelector} from "../hooks";
import {useNavigate} from "react-router-dom";
import ArticlesList from "../components/articles/articlesList";
import {Box} from "@chakra-ui/react";
import Paginator from "../components/paginator";


const MyArticles: React.FC = (): JSX.Element => {
    const initialState: ArticleWithUsers[] = [];
    const [articles, setArticles] = useState(initialState);
    const navigate = useNavigate();
    const {value: user} = useAppSelector(state => state.user);
    const fetchData = async () => {
        if(!user) {
            return navigate('/error401');
        }
        const {data} = await request.get<undefined, AxiosResponse<SearchArticlesResult>>(`/article/getArticlesByAuthor?authorId=${user.id}&page=1`);
        const {articles} = data;
        setArticles(articles);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const onPageClick = (page: number) => async () => {
        if(!user) {
            return navigate('/error401');
        }
        const {data} = await request.get<undefined, AxiosResponse<SearchArticlesResult>>(`/article/getArticlesByAuthor?authorId=${user.id}&page=${page}`);
        const {articles} = data;
        setArticles(articles);
    }

    return (
        <Box>
            <ArticlesList articles={articles} review={false} />
            <Paginator items={articles} onPageClick={onPageClick} />
        </Box>
    )
}

export default MyArticles;

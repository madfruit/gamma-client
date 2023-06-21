import React, {useEffect, useState} from "react";
import {Box} from '@chakra-ui/react';
import request from "../helpers/request";
import {ArticleWithUsers, GetArticleResult} from "package-types";
import {AxiosResponse} from 'axios';
import {useParams} from "react-router-dom";
import Article from '../components/articles/article'
import CommentArea from "../components/articles/commentArea";

interface ArticleProps {

}

const ArticleView: React.FC<ArticleProps> = (props): JSX.Element => {
    const {id} = useParams();
    const [article, setArticle] = useState<ArticleWithUsers | undefined>(undefined);
    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<GetArticleResult>>(`/article/getArticle/${id}`);
        const {article: fetchedArticle} = data;
        console.log(article);
        if (fetchedArticle) {
            setArticle(fetchedArticle);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Box>
        <Article article={article} />
            { article && (
                <CommentArea articleId={article.id} comments={article.comments}/>
            )
            }
        </Box>
    )
}

export default ArticleView;

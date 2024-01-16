import React, {useState} from "react";
import {Box, Text, Heading, Button, Textarea, } from '@chakra-ui/react';
import request from "../../helpers/request";
import {
    AddCommentPayload,
    AddCommentResult,
    CommentWithUser
} from "package-types";
import {AxiosResponse} from 'axios';
import {useAppSelector} from "../../hooks";
import sanitize from "sanitize-html";
import CommentsList from "./commentList";

interface CommentAreaProps {
    articleId: string
    comments?: CommentWithUser[];
}

const CommentArea: React.FC<CommentAreaProps> = (props): JSX.Element => {
    const currentUser = useAppSelector(state => state.user.value);
    const [commentText, setCommentText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {comments: availableComments, articleId} = props;
    let initialCommentsState: CommentWithUser[] = [];
    if(availableComments) {
        initialCommentsState = availableComments;
    }
    const [comments, setComments] = useState(initialCommentsState);

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    }

    const onAddCommentClick = async () => {
        if (!currentUser) {
            return;
        }
        if (!commentText.trim()) {
            return;
        }
        const sanitizedText = sanitize(commentText);
        const {data} = await request.post<AddCommentPayload, AxiosResponse<AddCommentResult>>(`/article/comment`, {
            articleId,
            text: sanitizedText
        });
        console.log(data);
        if (!data.comment) {
            setErrorMessage('Помилка при додаванні коментаря! Спробуйте ще раз');
            return;
        }
        const newComment: CommentWithUser = {
            id: data.comment.id,
            author: currentUser,
            text: data.comment.text,
            authorId: currentUser.id,
            articleId,
            createdAt: data.comment.createdAt
        }
        const newComments = comments.slice();
        newComments.push(newComment);
        setComments(newComments);
        setCommentText('');
    }


    return (
        <Box m={5}>
            {currentUser && (
                <Box>
                    <Heading mb={3}>Додати коментар:</Heading>
                    <Box>
                        <Textarea value={commentText} onChange={onTextChange} w={600}/>
                    </Box>
                    <Button mt={5} onClick={onAddCommentClick}>
                        Готово
                    </Button>
                    <Text color={'red'}>{errorMessage}</Text>
                </Box>
            )
            }
            <Heading mt={3}>Коментарі: </Heading>
            <CommentsList comments={comments} renderDeleteButton={false} renderReportButton={true} renderArticleLink={false} />
        </Box>
    )
}

export default CommentArea;

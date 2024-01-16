import React, {useEffect, useState} from "react";
import {Box, Text, Image, Flex, Link, IconButton, CloseButton, Divider} from '@chakra-ui/react';
import {WarningIcon} from '@chakra-ui/icons';
import {AddReportResult, CommentWithUser, DeleteCommentResult, Role} from "package-types";
import {Link as ReactLink} from "react-router-dom";
import {useAppSelector} from "../../hooks";
import request from "../../helpers/request";
import {AxiosResponse} from "axios";

interface CommentProps {
    comments: CommentWithUser[];
    renderDeleteButton: boolean;
    renderReportButton: boolean;
    renderArticleLink: boolean;
}

const CommentsList: React.FC<CommentProps> = (props): JSX.Element => {
    const currentUser = useAppSelector(state => state.user.value);
    const {comments} = props;
    const [stateComments, setStateComments] = useState(comments);
    const removeComment = (commentId: string) => async () => {
        const {data} = await request.delete<undefined, AxiosResponse<DeleteCommentResult>>(`/article/deleteComment/${commentId}`);
        if(data.success) {
            setStateComments(stateComments.filter(c => c.id !== commentId));
        }
    }

    const onAddReportClick = (commentId: string) => async () => {
        try {
            await request.post<undefined, AxiosResponse<AddReportResult>>(`/article/reportComment/${commentId}`);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setStateComments(comments);
    }, [comments])

    return (
        <Box>
        {
            stateComments.map((comment) => {
                return (
                    <Box key={comment.id} m={5} w={600}>
                        <Flex>
                            <Box>
                            <Image
                                src={comment.author ? comment.author.avatar
                                        ? comment.author.avatar
                                        : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`
                                    : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                w={50} borderRadius={25}/>
                                <Box />
                                </Box>
                            {comment.author
                                ? (
                                    <Link as={ReactLink} to={`/users/${comment.author.id}`}>
                                        <Text fontSize={'2xl'} key={comment.id}
                                              ml={5}>{comment.author.nickname}</Text>
                                    </Link>)
                                : (
                                    <Text fontSize={'2xl'} key={comment.id}
                                          ml={5}>Видалений користувач</Text>
                                )
                            }
                            <Text ml={100}>{new Date(comment.createdAt).toLocaleString('uk-UA')}</Text>
                            <Flex>
                                { currentUser && currentUser.id !== comment.authorId &&
                                    <IconButton ml={5} icon={<WarningIcon/>} aria-label={'Поскаржитись на коментар'}
                                                onClick={onAddReportClick(comment.id)}/>
                                }
                                { currentUser && currentUser.role === Role.MODERATOR &&
                                <CloseButton mt={1} onClick={removeComment(comment.id)} />
                                }
                            </Flex>
                        </Flex>
                        <Text dangerouslySetInnerHTML={{__html: comment.text}}/>
                        <Divider/>
                    </Box>
                )
            })
        }
        </Box>
    )
}

export default CommentsList;

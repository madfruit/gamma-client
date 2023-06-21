import React from "react";
import {Box, Text, Image, Flex, Link, IconButton, CloseButton, Divider} from '@chakra-ui/react';
import {WarningIcon} from '@chakra-ui/icons';
import {CommentWithUser, Role} from "package-types";
import {Link as ReactLink} from "react-router-dom";
import {useAppSelector} from "../../hooks";

interface CommentProps {
    comment: CommentWithUser;
    renderDeleteButton: boolean;
    renderReportButton: boolean;
    removeComment: Function;
    addReport?: Function;
}

const Comment: React.FC<CommentProps> = (props): JSX.Element => {
    const currentUser = useAppSelector(state => state.user.value);
    const {comment, renderReportButton, removeComment, addReport} = props;

    return (
        <Box key={comment.id} m={5} w={600}>
            <Flex>
                <Image
                    src={comment.author ? comment.author.avatar
                            ? comment.author.avatar
                            : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`
                        : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                    w={50} borderRadius={25}/>
                {comment.author
                    ? (
                        <Link as={ReactLink} to={`/users/${comment.author.id}`}>
                            <Text fontSize={'2xl'} key={comment.id}
                                  ml={5}>{comment.author.nickname}</Text>
                        </Link>)
                    : (
                        <Text w={500} fontSize={'2xl'} key={comment.id}
                              ml={5}>Видалений користувач</Text>
                    )
                }
                <Text ml={100}>{new Date(comment.createdAt).toLocaleString('uk-UA')}</Text>
                <Box>
                    {renderReportButton && addReport && (
                        <IconButton ml={5} icon={<WarningIcon/>} aria-label={'Поскаржитись на коментар'}
                                    onClick={addReport(comment.id)}/>
                    )}
                    { currentUser && currentUser.role === Role.MODERATOR &&
                    <CloseButton onClick={removeComment(comment.id)} />
                    }
                </Box>
            </Flex>
            <Text dangerouslySetInnerHTML={{__html: comment.text}}/>
            <Divider/>
        </Box>
    )
}

export default Comment;

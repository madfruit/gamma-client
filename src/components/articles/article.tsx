import React from "react";
import {Box, Text, Heading, Image, Flex, Link} from '@chakra-ui/react';
import {ViewIcon} from '@chakra-ui/icons';
import {ArticleWithUsers} from "package-types";
import {Link as ReactLink} from "react-router-dom";

interface ArticleProps {
    article?: ArticleWithUsers;
}

const Article: React.FC<ArticleProps> = (props): JSX.Element => {
    const {article} = props;
    console.log(article);
    return (
        <Box m={10}>
            {article &&
                <Box>
                    <Flex>
                        <Image
                            src={article.image ? article.image : `${process.env.PUBLIC_URL}/images/image-placeholder.png`}
                            w={400} borderRadius={10} m={5} alt={'article title pic here'}/>
                        <Box>
                            <Heading m={5} dangerouslySetInnerHTML={{__html: article.title}}/>
                            <Flex>
                                <ViewIcon m={1}/>
                                <Text>{article.viewCount}</Text>
                            </Flex>
                            <Flex m={5}>
                                {
                                    article.tags && article.tags.map((tag, key) => {
                                        return (<Text m={1} key={key}>#{tag}</Text>)
                                    })
                                }
                            </Flex>
                        </Box>
                    </Flex>
                    <Box>
                        <Text dangerouslySetInnerHTML={{__html: article.text}}/>
                    </Box>
                    {article.author
                        ? <Box>
                            <Text>Author: </Text>
                            <Link as={ReactLink} to={`/users/${article.authorId}`}>
                                <Image w={100} borderRadius={50}
                                       src={article.author.avatar ? article.author.avatar : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                       alt={'no avatar here'}/>
                                <Text>{article.author.nickname}</Text>
                            </Link>
                        </Box>
                        : <Box>
                            <Image w={100} borderRadius={50}
                                   src={`${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                   alt={'no avatar here'}/>
                            <Text>Видалений автор</Text>
                        </Box>
                    }
                    {article.reviewer
                        ? <Box>
                            <Text>Reviewer: </Text>
                            <Link as={ReactLink} to={`/users/${article.authorId}`}>
                                <Image
                                    w={100} borderRadius={50}
                                    src={article.reviewer.avatar ? article.reviewer.avatar : `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                    alt={'no avatar here'}/>
                                <Text>{article.reviewer.nickname}</Text>
                            </Link>
                        </Box>
                        : article.reviewerId
                            ?
                            <Box>
                                <Image w={100} borderRadius={50}
                                       src={`${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`}
                                       alt={'no avatar here'}/>
                                <Text>Видалений рецензент</Text>
                            </Box>
                            : <Box>
                                <Text>Рецензії не було</Text>
                            </Box>
                    }
                </Box>
            }
        </Box>
    )
}

export default Article;

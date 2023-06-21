import React, {useEffect, useState} from "react";
import {
    Box,
    Text,
    Heading,
    Stack,
    StackItem,
    Image,
    Flex,
    Link,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Select
} from '@chakra-ui/react';
import {ArticleWithUsers, DeleteArticleResult, Role, SearchArticlesResult} from "package-types";
import {Link as ReactLink} from "react-router-dom";
import {useAppSelector} from "../../hooks";
import request from "../../helpers/request";
import {AxiosResponse} from "axios";

interface ArticlesListProps {
    articles: ArticleWithUsers[];
    review: boolean;
}

const ArticlesList: React.FC<ArticlesListProps> = (props): JSX.Element => {
    const {articles: fetchedArticles, review} = props;
    const [articles, setArticles] = useState(fetchedArticles);
    const [searchText, setSearchText] = useState('');
    const [orderBy, setOrderBy] = useState('viewCount');
    const [order, setOrder] = useState('DESC');
    const currentUser = useAppSelector(state => state.user.value);
    const handleClick = async () => {
        const {data} = await request.get<undefined, AxiosResponse<SearchArticlesResult>>(`/article/searchArticles?text=${searchText}&order=${order}&orderBy=${orderBy}&page=1`);
        setArticles(data.articles);
    }

    const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const safeText = text.replace('#', '%');
        setSearchText(safeText);
    }

    const onOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrder(e.target.value);
    }

    const onOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderBy(e.target.value);
    }

    const onDeleteButtonClick = (articleId: string) => async () => {
        if (currentUser && currentUser.role === Role.AUTHOR) {
            try {
                const {data} = await request.delete<undefined, AxiosResponse<DeleteArticleResult>>(`/article/delete/${articleId}`);
                if (data.success) {
                    const deletedArticle = articles.find(a => a.id === articleId);
                    if (deletedArticle) {
                        const newArticles = [...articles].filter(a => a.id !== articleId);
                        setArticles(newArticles);
                    }

                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        setArticles(fetchedArticles)
    }, [fetchedArticles]);
    return (
        <Box>
            <Flex>
                <InputGroup size='lg' m={8} w={1200}>
                    <Input onChange={onSearchTextChange}
                           placeholder={'Шукайте за назвою, текстом, або тегами (#тег1;#тег2;...)'}/>
                    <InputRightElement mt={1} width='6.5rem' height={'2.5rem'}>
                        <Button m={2} h='1.75rem' size='lg' onClick={handleClick}>Шукати</Button>
                    </InputRightElement>
                </InputGroup>
                <Flex m={3}>
                    <Box mr={3}>
                        <Text ml={3}>Сортвувати за:</Text>
                        <Select onChange={onOrderByChange} w={60}>
                            <option value="viewCount">Кількість переглядів</option>
                            <option value="createdAt">Дата написання</option>
                        </Select>
                    </Box>
                    <Box>
                        <Text ml={3}>Порядок сортування:</Text>
                        <Select onChange={onOrderChange} w={60}>
                            <option value="DESC">За спаданням</option>
                            <option value="ASC">За зростанням</option>
                        </Select>
                    </Box>
                </Flex>
            </Flex>
            <Stack>
                {articles.map(article => {
                    return (
                        <StackItem key={article.id}>
                            <Box w={'auto'}>
                                <Flex>
                                    <Box>
                                        <Image src={article.image} w={150} alt="some image"/>
                                        <Box></Box>
                                    </Box>
                                    <Box ml={5}>
                                        <Link as={ReactLink}
                                              to={(currentUser)
                                                  && currentUser.role === Role.AUTHOR && review
                                                  ? `/articles/review/${article.id}`
                                                      : article.posted
                                                      ? `/articles/${article.id}`
                                                  : `/articles/edit/${article.id}`
                                              } colorScheme="teal" m={4}>
                                            <Heading dangerouslySetInnerHTML={{__html: article.title}} w={800}/>
                                        </Link>
                                        <Flex wrap={'wrap'}>
                                            {article.tags && article.tags.map((tag, key) => {
                                                return (<Text m={1} key={key}>#{tag}</Text>)
                                            })}
                                        </Flex>
                                        <Text maxW={'prose'} dangerouslySetInnerHTML={{__html: article.text}}/>
                                        {!article.posted && (
                                            <Text>Not posted yet</Text>
                                        )
                                        }
                                    </Box>
                                    {currentUser && currentUser.role === Role.AUTHOR &&
                                    <Button m={6} onClick={onDeleteButtonClick(article.id)}>Видалити статтю</Button>
                                    }
                                </Flex>
                            </Box>
                        </StackItem>
                    )
                })};
            </Stack>
        </Box>
    )
}

export default ArticlesList;

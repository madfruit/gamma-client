import React, {useEffect, useState} from "react";
import request from "../helpers/request";
import {
    DeleteCommentResult,
    DeleteReportResult,
    GetReportsResult,
    ReportWithUser
} from "package-types";
import {AxiosResponse} from 'axios';
import {Box, Flex, Text, Image, Link, Button} from "@chakra-ui/react";
import Comment from '../components/articles/comment';
import Paginator from '../components/paginator';
import {Link as ReactLink} from 'react-router-dom';

const GetReports: React.FC = (): JSX.Element => {
    const initialReportsState: ReportWithUser[] = [];
    const [reports, setReports] = useState<undefined | ReportWithUser[]>(initialReportsState);
    const fetchData = async () => {
        const {data} = await request.get<undefined, AxiosResponse<GetReportsResult>>('/article/getReports');
        const {reports} = data;
        setReports(reports);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const removeComment = (commentId: string) => async () => {
        if(reports) {
            const {data} = await request.delete<undefined, AxiosResponse<DeleteCommentResult>>(`/article/deleteComment/${commentId}`);
            if (data.success) {
                setReports(reports.filter(r => r.comment.id !== commentId));
            }
        }
    }

    const removeReport = (reportId: string) => async () => {
        try {
            const {data} = await request.delete<undefined, AxiosResponse<DeleteReportResult>>(`/article/deleteReport/${reportId}`);
            if (data.success) {
                setReports(reports!.filter(r => r.id !== reportId));
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onPageClick = async (page: number) => {
        const {data} = await request.get<undefined, AxiosResponse<GetReportsResult>>(`/article/getReports?page=${page}`);
        const {reports} = data;

        if(reports.length) {
            setReports(reports);
            return true;
        }
        return false;
    }

    const onDeleteUserClick = (userId: string) => async () => {
        const {data} = await request.delete<undefined, AxiosResponse<DeleteReportResult>>(`/users/deleteUser/${userId}`);
        if(data.success) {
            if(reports) {
                const newReports = reports.map((report) => {
                    if (report.user && report.user.id === userId) {
                        report.user = undefined;
                    }
                    if (report.comment.author && report.comment.author.id === userId) {
                        report.comment.author = undefined;
                    }
                    return report;
                });
                setReports(newReports);
            }
        }
    }

    return (
        <Box m={5}>
            {reports && (
                <Box>
                    {reports.map((report) => {
                        return <Box key={report.id}>
                            { report.user
                                ? <Flex m={2}>
                                    <Image src={report.user.avatar ?? `${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`} alt={'could not load avatar'} w={50} borderRadius={25}/>
                                    <Link m={3} as={ReactLink} to={`/users/${report.user.id}`}>{report.user.nickname}</Link>
                                </Flex>
                                : <Flex m={2}>
                                    <Image src={`${process.env.PUBLIC_URL}/images/avatar-placeholder.jpg`} w={50} borderRadius={25} />
                                    <Text m={3}>Видалений користувач</Text>
                                </Flex>
                            }
                            <Button m={2} onClick={removeReport(report.id)}>Видалити скаргу</Button>
                            <Link as={ReactLink} to={`/articles/${report.comment.articleId}`}>Стаття</Link>
                            { report.comment.author &&
                                <Button onClick={onDeleteUserClick(report.comment.authorId)} background={'red'} ml={3}>Видалити
                                    автора коментаря</Button>
                            }
                            <Comment comment={report.comment} renderDeleteButton={true} renderReportButton={false} removeComment={removeComment}/>
                        </Box>
                    })}
                    <Paginator render={onPageClick} />
                </Box>
            )
            }
        </Box>
    )
}

export default GetReports;

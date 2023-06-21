import * as React from "react"
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import {
    ChakraProvider,
} from "@chakra-ui/react"
import theme from './theme'
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./views/home";
import Login from "./views/login";
import Register from "./views/register";
import {Provider} from 'react-redux';
import {store} from "./store";
import Logout from "./components/logout";
import Admin from "./views/admin";
import WriteArticle from "./views/writeArticle";
import ReviewArticles from "./views/reviewArticles";
import ReviewArticle from "./views/reviewArticle";
import MyArticles from "./views/myArticles";
import ArticleView from "./views/article";
import User from "./views/user";
import GetReports from "./views/getReports";
import EditArticle from "./views/editArticle";
import page404 from "./views/errors/page404";
import page403 from "./views/errors/page403";
import page401 from "./views/errors/page401";
import ManageRoles from "./views/manageRoles";
import {useEffect} from "react";

export const App: React.FC = (): JSX.Element => {

    useEffect(() => {
        document.title = 'gamma';
    })

    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Provider store={store}>
                    <Header/>
                    <Routes>
                        <Route path="/" Component={Home}/>
                        <Route path="/articles/:id" Component={ArticleView}/>
                        <Route path="/users/login" Component={Login}/>
                        <Route path="/users/register" Component={Register}/>
                        <Route path="/users/logout" Component={Logout}/>
                        <Route path="/users/:userId" Component={User}/>
                        <Route path="/admin" Component={Admin}/>
                        <Route path="/admin/manageRoles" Component={ManageRoles}/>
                        <Route path="/articles/writeArticle" Component={WriteArticle}/>
                        <Route path="/admin/reviewArticles" Component={ReviewArticles}/>
                        <Route path="/admin/getReports" Component={GetReports}/>
                        <Route path="/articles/review/:id" Component={ReviewArticle}/>
                        <Route path="/articles/myArticles" Component={MyArticles}/>
                        <Route path="/articles/edit/:articleId" Component={EditArticle}/>
                        <Route path="/error404" Component={page404} />
                        <Route path="/error403" Component={page403} />
                        <Route path="/error401" Component={page401} />
                        <Route path="*" Component={page404} />
                    </Routes>
                    <Footer />
                </Provider>
            </BrowserRouter>
        </ChakraProvider>
    );
}

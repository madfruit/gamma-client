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
import Home from "./views/home";
import Login from "./views/login";
import Register from "./views/register";
import {Provider} from 'react-redux';
import {store} from "./store";
import Article from "./views/article";
import Logout from "./components/logout";
import Admin from "./views/admin";
import WriteArticle from "./views/writeArticle";

export const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Provider store={store}>
                    <Header/>
                    <Routes>
                        <Route path="/" Component={Home}/>
                        <Route path="/articles/:id" Component={Article}/>
                        <Route path="/users/login" Component={Login}/>
                        <Route path="/users/register" Component={Register}/>
                        <Route path="/users/logout" Component={Logout}/>
                        <Route path="/admin" Component={Admin}/>
                        <Route path="/admin/writeArticle" Component={WriteArticle}/>
                        {/*<Route path="/admin/reviewArticle" Component={Admin}/>*/}
                    </Routes>
                </Provider>
            </BrowserRouter>
        </ChakraProvider>
    );
}

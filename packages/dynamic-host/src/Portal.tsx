import { Menu } from 'antd';
import axios from 'axios';
import React, { createElement, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Switch, useLocation } from 'react-router-dom';
import NotFound from './NotFound';
import { importRemote } from '@module-federation/utilities';

// const App1 = React.lazy(() => import('app1/App1'));
// const App2 = React.lazy(() => import('app2/App2'));

/**
 * 实现一个基座页面
 * @returns
 */
const Home: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="text-primary">基座页面</h1>
            <p className="mt-2 text-xl">欢迎首页</p>
        </div>
    );
};

const Root: React.FC = () => {
    const { pathname } = useLocation();

    const [routes, setRoutes] = React.useState<
        {
            path: string;
            component: React.LazyExoticComponent<any>;
        }[]
    >();

    useEffect(() => {
        axios
            .get<{
                routes: { path: string; scope: string; module: string; url: string; remoteEntryFileName: string }[];
            }>('http://localhost:3004/env-config.json')
            .then(({ data }) => {
                setRoutes(
                    data.routes.map(item => ({
                        path: item.path,
                        component: React.lazy(() => importRemote(item)),
                    }))
                );
            });
    }, []);

    return (
        <div className="flex">
            <aside style={{ width: 300, height: 'calc(100vh)' }}>
                <Menu
                    className="h-full"
                    selectedKeys={[pathname]}
                    items={[
                        {
                            key: '/',
                            title: 'Home',
                            label: <NavLink to="/">Home</NavLink>,
                        },
                        {
                            key: '/app1',
                            title: 'App1',
                            label: <NavLink to="/app1">App1</NavLink>,
                        },
                        {
                            key: '/app2',
                            title: 'App2',
                            label: <NavLink to="/app2">App2</NavLink>,
                        },
                        {
                            key: '/app2/app3',
                            title: 'App3',
                            label: <NavLink to="/app2/app3">App3</NavLink>,
                        },
                    ]}
                />
            </aside>

            <div id="detail" className="flex-1">
                <h1 className="mb-3 text-center">基于 Module Federation 的微前端</h1>
                <Switch>
                    <Route exact path="/" component={Home} />

                    {routes?.map(route => (
                        <Route
                            key={route.path}
                            render={() => (
                                <React.Suspense fallback={`Loading ${route.path}`}>
                                    {createElement(route.component)}
                                </React.Suspense>
                            )}
                        />
                    ))}
                    <Route path="*" component={NotFound} />
                </Switch>
            </div>
        </div>
    );
};

const Portoal: React.FC = () => {
    return (
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    );
};

export default Portoal;

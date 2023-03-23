import { Card, Tabs } from 'antd';
import React from 'react';
import { NavLink, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import './tailwind.css';

const App1: React.FC = () => {
    const { pathname } = useLocation();
    const routeMatch = useRouteMatch();
    const history = useHistory();

    return (
        <div className="px-3">
            <div className="text-center">
                <h1 className="text-error">App1 子应用1</h1>

                <h3>子应用模块 {routeMatch.path}</h3>
            </div>

            <Card className="mt-3 mx-8" title="Card2" size="small">
                <div>antd card</div>

                <div className="text-error">text-error</div>
                <div className="text-success">text-success</div>
                <div className="text-warning">text-warning</div>
                <div className="text-info">text-info</div>
            </Card>
        </div>
    );
};

export default App1;

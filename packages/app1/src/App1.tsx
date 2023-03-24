import { Button, Card, Form, Input, InputNumber, Tabs } from 'antd';
import React from 'react';
import { NavLink, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import './tailwind.css';
// utils 使用 module federation 的方式引入 shared/utils
import { randomString } from 'shared/utils';

const App1: React.FC = () => {
    const { pathname } = useLocation();
    const routeMatch = useRouteMatch();
    const history = useHistory();
    const [number, setNumber] = React.useState<number | null>(20);

    return (
        <div className="px-3">
            <div className="text-center">
                <h1 className="text-error">App1 子应用1</h1>

                <h3>子应用模块 {routeMatch.path}</h3>
            </div>

            <Form className="mx-8">
                <div className="flex gap-1 items-center">
                    <div>使用 shared/utils 生成</div>
                    <InputNumber
                        value={number}
                        onChange={value => setNumber(value)}
                        addonAfter="位"
                        precision={0}
                        min={1}
                    />
                    <Button
                        className="btn btn-primary"
                        onClick={() => {
                            alert(randomString(number));
                        }}
                    >
                        随机数
                    </Button>
                </div>
            </Form>

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

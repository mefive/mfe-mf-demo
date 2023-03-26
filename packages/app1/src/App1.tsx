import { Button, Card, Form, InputNumber } from 'antd';
import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { randomString } from 'shared/utils';
import './tailwind.css';

const App1: React.FC = () => {
    const { pathname } = useLocation();
    const routeMatch = useRouteMatch();
    const [number, setNumber] = React.useState<number>(20);

    return (
        <div className="px-3">
            <div className="text-center">
                <h1 className="text-error">App1 子应用1</h1>

                <h1 className="text-error">当前路径：{pathname}</h1>

                <h3>子应用模块 {routeMatch.path}</h3>
            </div>

            <Form className="mx-8">
                <div className="flex gap-1 items-center">
                    <div>使用 shared/utils 生成</div>
                    <InputNumber
                        value={number}
                        onChange={value => setNumber(value ?? 0)}
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

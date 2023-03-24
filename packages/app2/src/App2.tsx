import { Divider, Table } from 'antd';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import * as shared from '@mfe/shared';
import './tailwind.css';

const App2: React.FC = () => {
    const routeMatch = useRouteMatch();

    console.log('utils', shared);

    return (
        <div className="px-3">
            <div className="text-center">
                <h1 className="text-secondary">App2 子页面2</h1>
                <h3>子页面路径 {routeMatch.path}</h3>
            </div>

            <Divider />

            <Table
                className="mt-3"
                columns={[
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: 'Age',
                        dataIndex: 'age',
                        key: 'age',
                    },
                    {
                        title: 'Address',
                        dataIndex: 'address',
                        key: 'address',
                    },
                ]}
                dataSource={[
                    {
                        key: '1',
                        name: 'John Brown',
                        age: 32,
                        address: 'New York No. 1 Lake Park',
                    },
                    {
                        key: '2',
                        name: 'Jim Green',
                        age: 42,
                        address: 'London No. 1 Lake Park',
                    },
                    {
                        key: '3',
                        name: 'Joe Black',
                        age: 32,
                        address: 'Sidney No. 1 Lake Park',
                    },
                ]}
            />
        </div>
    );
};

export default App2;

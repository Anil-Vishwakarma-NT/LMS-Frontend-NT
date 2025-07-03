import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#7FB3D5', '#76D7C4', '#F7DC6F', '#F5B7B1', '#B39DDB'];


const DonutChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={250} >
            <PieChart>
                <Pie
                    data={data}
                    dataKey="number"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    fill="#8884d8"
                    paddingAngle={0}
                    marginBottom={15}
                    marginLeft={60}
                    paddingRight={100}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    style={{ paddingRight: 30 }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DonutChart;

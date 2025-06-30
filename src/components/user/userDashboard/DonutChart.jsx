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
                    innerRadius={30}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    paddingBottom={5}
                // label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DonutChart;

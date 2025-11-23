import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import './OverTimeChart.css';

function OverTimeChart({ title, isOpen, onClose, data, averageExpenses, lineColour }) {
    if (!isOpen) return null;

    const chartData = data || [];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="expenses-tooltip" style={{ border: `2px solid ${lineColour}` }}>
                    <p className="tooltip-date">{payload[0].payload.date}</p>
                    <p className="tooltip-value">€{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title} by month</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <ResponsiveContainer width="100%" height={450}>
                        <LineChart data={chartData} margin={{ top: 30, right: 100, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#456882" opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                stroke="#D2C1B6"
                                tick={{ fontSize: 12, fill: '#D2C1B6' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                stroke="#D2C1B6"
                                tick={{ fontSize: 12, fill: '#D2C1B6' }}
                                tickFormatter={(value) => `€${value.toLocaleString()}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine
                                y={averageExpenses}
                                stroke="#D2C1B6"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                label={{
                                    value: `€${averageExpenses.toLocaleString()}`,
                                    position: 'right',
                                    fill: '#D2C1B6',
                                    fontSize: 13,
                                    fontWeight: 'bold'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expenses"
                                stroke={lineColour}
                                strokeWidth={1.5}
                                dot={{ fill: lineColour, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default OverTimeChart;

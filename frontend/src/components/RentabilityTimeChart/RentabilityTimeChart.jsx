import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from 'recharts';
import './RentabilityTimeChart.css';

function RentabilityTimeChart({isOpen, onClose, data, latestRentability }) {
    if (!isOpen) return null;

    const chartData = data || [];
    const lineColour = latestRentability < 0 ? '#ef4444' : '#22c55e';

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="expenses-tooltip" style={{ border: `2px solid ${lineColour}` }}>
                    <p className="tooltip-date">{payload[0].payload.date}</p>
                    <p className="tooltip-value">{payload[0].value.toFixed(2)}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Rentability by month</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart data={chartData} margin={{ top: 30, right: 100, left: 10, bottom: 5 }}>
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
                                tickFormatter={(value) => `${value.toFixed(2)}%`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={0} stroke="#D2C1B6" strokeWidth={2} />
                            <Bar dataKey="rentability">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.rentability < 0 ? '#ef4444' : '#22c55e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default RentabilityTimeChart;

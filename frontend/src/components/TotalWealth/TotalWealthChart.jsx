import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import './TotalWealth.css';

function TotalWealthChart({ data, isExpanded, setIsExpanded }) {
    // Prepare cash chart data
    const cashChartData = data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => {
            const date = new Date(item.date);
            const invested = item.kutxa_etf + item.degiro + item.revolut + item.crypto
            const total = item.kutxa_cash + invested
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                cash: item.kutxa_cash || 0,
                invested: invested || 0,
                total: total || 0
            };
        });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="cash-tooltip">
                    <p className="tooltip-date">{data.date}</p>
                    <p className="tooltip-label">Total Cash: <span className="cash-value">€{data.cash.toLocaleString()}</span></p>
                    <p className="tooltip-label">Total Invested: <span className="investment-value">€{data.invested.toLocaleString()}</span></p>
                    <p className="tooltip-total">Total: €{data.total.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {isExpanded && (
                <div className="cash-modal-overlay" onClick={() => setIsExpanded(false)}>
                    <div className="cash-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cash-modal-header">
                            <h2>Total wealth history</h2>
                            <button className="cash-close-btn" onClick={() => setIsExpanded(false)}>×</button>
                        </div>
                        <div className="cash-modal-body">
                            <ResponsiveContainer width="100%" height={450}>
                                <LineChart data={cashChartData} margin={{ top: 30, right: 100, left: 10, bottom: 5 }}>
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
                                    <Line
                                        type="monotone"
                                        dataKey="cash"
                                        stroke="#56a84fff"
                                        strokeWidth={1}
                                        dot={{ fill: '#56a84fff', r: 3 }}
                                        activeDot={{ r: 6 }}
                                        name="Cash"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="invested"
                                        stroke="#fbbf24"
                                        strokeWidth={1}
                                        dot={{ fill: '#fbbf24', r: 3 }}
                                        activeDot={{ r: 6 }}
                                        name="Invested"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#D2C1B6"
                                        strokeWidth={1.5}
                                        dot={{ fill: '#D2C1B6', r: 4 }}
                                        activeDot={{ r: 7 }}
                                        name="Total"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TotalWealthChart;

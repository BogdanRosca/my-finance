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

function InvestmentChart({ data, isExpandedInvestment, setIsExpandedInvestment }) {
    // Prepare cash chart data
    const cashChartData = data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => {
            const date = new Date(item.date);
            const total = item.revolut + item.degiro + item.kutxa_etf + item.crypto;
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                revolut: item.revolut || 0,
                degiro: item.degiro || 0,
                kutxa: item.kutxa_etf || 0,
                crypto: item.crypto || 0,
                total: total || 0
            };
        });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="cash-tooltip">
                    <p className="tooltip-date">{data.date}</p>
                    <p className="tooltip-label">Revolut: <span className="revolut-value">€{data.revolut.toLocaleString()}</span></p>
                    <p className="tooltip-label">Kutxa: <span className="kutxa-value">€{data.kutxa.toLocaleString()}</span></p>
                    <p className="tooltip-label">Degiro: <span className="degiro-value">€{data.degiro.toLocaleString()}</span></p>
                    <p className="tooltip-label">Crypto: <span className="crypto-value">€{data.crypto.toLocaleString()}</span></p>
                    <p className="tooltip-total">Total: €{data.total.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {isExpandedInvestment && (
                <div className="cash-modal-overlay" onClick={() => setIsExpandedInvestment(false)}>
                    <div className="cash-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cash-modal-header">
                            <h2>Total wealth history</h2>
                            <button className="cash-close-btn" onClick={() => setIsExpandedInvestment(false)}>×</button>
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
                                        dataKey="revolut"
                                        stroke="#56a84fff"
                                        strokeWidth={1}
                                        dot={{ fill: '#56a84fff', r: 2 }}
                                        activeDot={{ r: 6 }}
                                        name="Revolut"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="kutxa"
                                        stroke="#c02b2bff"
                                        strokeWidth={1}
                                        dot={{ fill: '#c02b2bff', r: 2 }}
                                        activeDot={{ r: 6 }}
                                        name="Kutxa"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="degiro"
                                        stroke="#42d5f6ff"
                                        strokeWidth={1.5}
                                        dot={{ fill: '#42d5f6ff', r: 2 }}
                                        activeDot={{ r: 7 }}
                                        name="Degiro"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="crypto"
                                        stroke="#c9d36eff"
                                        strokeWidth={1.5}
                                        dot={{ fill: '#D2C1B6', r: 2 }}
                                        activeDot={{ r: 7 }}
                                        name="Crypto"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#D2C1B6"
                                        strokeWidth={1.5}
                                        dot={{ fill: '#D2C1B6', r: 3 }}
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

export default InvestmentChart;

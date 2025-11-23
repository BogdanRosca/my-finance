import { useState } from 'react';
import TotalWealthChart from './TotalWealthChart';
import InvestmentChart from './InvestmentChart';
import './TotalWealth.css';


function TotalWealth({ lastMonth, historicData }) {
    const [isExpandedTotal, setIsExpandedTotal] = useState(false);
    const [isExpandedInvestment, setIsExpandedInvestment] = useState(false);
    
    const startOfYear = historicData[1]
    const totalStartOfYear = startOfYear.kutxa_cash + startOfYear.revolut + startOfYear.kutxa_etf + startOfYear.degiro + startOfYear.crypto;

    const previousMonth = historicData[10]
    const totalWealthPrevious = previousMonth.kutxa_cash + previousMonth.revolut + previousMonth.kutxa_etf + previousMonth.degiro + previousMonth.crypto;

    const totalCash = lastMonth.kutxa_cash;
    const totalInvestment = lastMonth.revolut + lastMonth.kutxa_etf + lastMonth.degiro + lastMonth.crypto;
    const totalWealth = totalCash + totalInvestment;

    const totalWealthDeltaMonth = totalWealth - totalWealthPrevious
    const totalWealthDeltaYear = totalWealth - totalStartOfYear

    return (
        <>
            <div className="cash-card">
                <div className="cash-card-header">
                    <h3>Wealth Overview</h3>
                </div>
                <div className="cash-card-content">
                    <div className="cash-total"  onClick={() => setIsExpandedTotal(true)}>
                        <div className="total-main">
                            <p className="total-label">Total wealth</p>
                            <p className="total-value">€{totalWealth.toLocaleString()}</p>
                        </div>
                        <div className={`total-delta ${totalWealthDeltaYear >= 0 ? 'positive' : 'negative'}`}>
                            <p className="delta-label">Year to date</p>
                            <p className="delta-value">{totalWealthDeltaYear >= 0 ? '▲' : '▼'} €{totalWealthDeltaYear.toLocaleString()}</p>
                        </div>
                        <div className={`total-delta ${totalWealthDeltaMonth >= 0 ? 'positive' : 'negative'}`}>
                            <p className="delta-label">Since last month</p>
                            <p className="delta-value">{totalWealthDeltaMonth >= 0 ? '▲' : '▼'} €{totalWealthDeltaMonth.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="cash-breakdown">
                        <div className="breakdown-item kutxa">
                            <p className="breakdown-label">Cash</p>
                            <p className="breakdown-value">€{totalCash.toLocaleString()}</p>
                        </div>
                        <div className="breakdown-item revolut" onClick={() => setIsExpandedInvestment(true)}>
                            <p className="breakdown-label">Investment</p>
                            <p className="breakdown-value">€{totalInvestment.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <TotalWealthChart data={historicData} isExpandedTotal={isExpandedTotal} setIsExpandedTotal={setIsExpandedTotal} />
            <InvestmentChart data={historicData} isExpandedInvestment={isExpandedInvestment} setIsExpandedInvestment={setIsExpandedInvestment} />
        </>
    );
}

export default TotalWealth;

import { useState } from 'react'
import EmergencyFundCard from '../components/EmergencyFundCard/EmergencyFundCard'
import CurrentAndAverageCard from '../components/CurrentAndAverageCard/CurrentAndAverageCard'
import OverTimeChart from '../components/OverTimeChart/OverTimeChart'
import { useFetchOverviewData } from '../hooks/useFetchOverviewData'
import '../App.css'

function Home() {
    const { latestData, averageIncome, averageExpenses, averageInvestment, monthName, loading, error, allData } = useFetchOverviewData()
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
    const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false)
    const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false)

    // Prepare income chart data
    const incomeChartData = allData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => {
            const date = new Date(item.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                expenses: item.income || 0
            };
        });

    // Prepare expenses chart data
    const expensesChartData = allData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => {
            const date = new Date(item.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                expenses: item.expenses || 0
            };
        });

    // Prepare investment chart data
    const investmentChartData = allData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => {
            const date = new Date(item.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                expenses: item.investment || 0
            };
        });

    return (
        <main className="app-main" style={{ textAlign: 'center', padding: '2rem' }}>

            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                {loading && <p>Loading latest data...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                {latestData && (
                    <>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            maxWidth: '800px',
                            margin: '0 auto 1rem auto',
                            justifyContent: 'flex-start'
                        }}>
                            <div onClick={() => setIsIncomeModalOpen(true)} style={{ cursor: 'pointer', flex: 1 }}>
                                <CurrentAndAverageCard
                                    title="Income"
                                    currentValue={latestData.income}
                                    averageValue={averageIncome}
                                    monthName={monthName}
                                    reverseColors={false}
                                />
                            </div>
                            <div onClick={() => setIsExpensesModalOpen(true)} style={{ cursor: 'pointer', flex: 1 }}>
                                <CurrentAndAverageCard
                                    title="Expenses"
                                    currentValue={latestData.expenses}
                                    averageValue={averageExpenses}
                                    monthName={monthName}
                                    reverseColors={true}
                                />
                            </div>
                            <div onClick={() => setIsInvestmentModalOpen(true)} style={{ cursor: 'pointer', flex: 1 }}>
                                <CurrentAndAverageCard
                                    title="Investments"
                                    currentValue={latestData.investment}
                                    averageValue={averageInvestment}
                                    monthName={monthName}
                                    reverseColors={false}
                                />
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            maxWidth: '800px',
                            margin: '0 auto',
                            justifyContent: 'flex-start'
                        }}>
                            <EmergencyFundCard
                                currentAmount={latestData.kutxa_cash}
                                targetAmount={3 * averageExpenses}
                                title="Emergency Fund"
                            />
                            <EmergencyFundCard
                                currentAmount={latestData.revolut + Math.max(0, latestData.kutxa_cash - 3 * averageExpenses)}
                                targetAmount={6 * averageExpenses}
                                title="Peace of Mind Fund"
                            />
                        </div>
                    </>
                )}
            </div>

            <OverTimeChart
                title= 'Income'
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                data={incomeChartData}
                averageExpenses={averageIncome}
                lineColour = '#22be78ff'
            />

            <OverTimeChart
                title= 'Expenses'
                isOpen={isExpensesModalOpen}
                onClose={() => setIsExpensesModalOpen(false)}
                data={expensesChartData}
                averageExpenses={averageExpenses}
                lineColour = '#bf3333ff'
            />

            <OverTimeChart
                title= 'Investment'
                isOpen={isInvestmentModalOpen}
                onClose={() => setIsInvestmentModalOpen(false)}
                data={investmentChartData}
                averageExpenses={averageInvestment}
                lineColour = '#e4ed7bff'
            />
        </main>
    )
}

export default Home

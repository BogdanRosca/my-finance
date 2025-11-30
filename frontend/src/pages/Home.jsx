import { useState } from 'react'
import EmergencyFundCard from '../components/EmergencyFundCard/EmergencyFundCard'
import CurrentAndAverageCard from '../components/CurrentAndAverageCard/CurrentAndAverageCard'
import OverTimeChart from '../components/OverTimeChart/OverTimeChart'
import TotalWealth from '../components/TotalWealth/WealthOverview'
import { useFetchOverviewData } from '../hooks/useFetchOverviewData'
import { useFetchUserSettings } from '../hooks/useFetchUserSettings'
import '../App.css'

function Home() {
    const { latestData, averageIncome, averageExpenses, averageInvestment, monthName, loading, error, allData } = useFetchOverviewData()
    const { emergencyBudget, peaceOfMindBudget, loading: settingsLoading, error: settingsError } = useFetchUserSettings(1)
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
        <main className="app-main" style={{ textAlign: 'center' }}>

            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                {(loading || settingsLoading) && <p>Loading latest data...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {settingsError && <p style={{ color: 'red' }}>Settings Error: {settingsError}</p>}

                {latestData && (
                    <>
                        <div style={{
                            maxWidth: '800px',
                            margin: '0 auto 1rem auto',
                            background: 'linear-gradient(135deg, #1a3a52 0%, #234c6a 100%)',
                            border: '1px solid #456882',
                            borderRadius: '12px',
                            padding: '1.5rem'
                        }}>
                        
                        <div className="cash-card-header">
                            <h3>Last Month Overview</h3>
                        </div>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-start'
                            }}>
                                <div onClick={() => setIsIncomeModalOpen(true)} style={{ cursor: 'pointer', flex: 1 }}>
                                    <CurrentAndAverageCard
                                        title="Income"
                                        subTitle="Average"
                                        currentValue={latestData.income}
                                        averageValue={averageIncome}
                                        monthName={monthName}
                                        reverseColors={false}
                                    />
                                    <OverTimeChart
                                        title= 'Income'
                                        isOpen={isIncomeModalOpen}
                                        onClose={() => setIsIncomeModalOpen(false)}
                                        data={incomeChartData}
                                        averageExpenses={averageIncome}
                                        lineColour = '#22be78ff'
                                    />
                                </div>
                                <div onClick={() => setIsExpensesModalOpen(true)} style={{ cursor: 'pointer', flex: 1 }}>
                                    <CurrentAndAverageCard
                                        title="Expenses"
                                        subTitle="Average"
                                        currentValue={latestData.expenses}
                                        averageValue={averageExpenses}
                                        monthName={monthName}
                                        reverseColors={true}
                                    />
                                    <OverTimeChart
                                        title= 'Expenses'
                                        isOpen={isExpensesModalOpen}
                                        onClose={() => setIsExpensesModalOpen(false)}
                                        data={expensesChartData}
                                        averageExpenses={averageExpenses}
                                        lineColour = '#bf3333ff'
                                    />

                                </div>
                                <div onClick={() => setIsInvestmentModalOpen(true)} style={{ cursor: 'pointer', flex: 1 }}>
                                    <CurrentAndAverageCard
                                        title="Investments"
                                        subTitle="Average"
                                        currentValue={latestData.investment}
                                        averageValue={averageInvestment}
                                        monthName={monthName}
                                        reverseColors={false}
                                    />
                                    <OverTimeChart
                                        title= 'Investment'
                                        isOpen={isInvestmentModalOpen}
                                        onClose={() => setIsInvestmentModalOpen(false)}
                                        data={investmentChartData}
                                        averageExpenses={averageInvestment}
                                        lineColour = '#e4ed7bff'
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{
                            maxWidth: '800px',
                            margin: '0 auto 1rem auto'
                        }}>
                            <TotalWealth 
                                lastMonth={latestData}
                                historicData={allData}
                            />
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
                                targetAmount={emergencyBudget * averageExpenses}
                                title="Emergency Fund"
                            />
                            <EmergencyFundCard
                                currentAmount={latestData.revolut + latestData.kutxa_cash -  2 * averageExpenses}
                                targetAmount={peaceOfMindBudget * averageExpenses}
                                title="Peace of Mind Fund"
                            />
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

export default Home

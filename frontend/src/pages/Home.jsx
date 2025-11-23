import { useState, useEffect } from 'react'
import EmergencyFundCard from '../components/EmergencyFundCard/EmergencyFundCard'
import CurrentAndAverageCard from '../components/CurrentAndAverageCard/CurrentAndAverageCard'
import OverTimeChart from '../components/OverTimeChart/OverTimeChart'
import '../App.css'

function Home() {
    const [latestData, setLatestData] = useState(null)
    const [averageIncome, setAverageIncome] = useState(0)
    const [averageExpenses, setAverageExpenses] = useState(0)
    const [averageInvestment, setAverageInvestment] = useState(0)
    const [monthName, setMonthName] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [allData, setAllData] = useState([])
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
    const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false)
    const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/overview')
                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const data = await response.json()

                // Store all data for chart
                setAllData(data)

                // Calculate average income, expenses, and investment
                if (data.length > 0) {
                    const totalIncome = data.reduce((sum, item) => sum + (item.income || 0), 0)
                    const totalExpenses = data.reduce((sum, item) => sum + (item.expenses || 0), 0)
                    const totalInvestment = data.reduce((sum, item) => sum + (item.investment || 0), 0)
                    setAverageIncome(Math.round(totalIncome / data.length))
                    setAverageExpenses(Math.round(totalExpenses / data.length))
                    setAverageInvestment(Math.round(totalInvestment / data.length))
                }

                // Sort by date descending and take the first one
                const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date))
                if (sortedData.length > 0) {
                    setLatestData(sortedData[0])

                    // Extract month name from date
                    const date = new Date(sortedData[0].date)
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December']
                    setMonthName(monthNames[date.getMonth()])
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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

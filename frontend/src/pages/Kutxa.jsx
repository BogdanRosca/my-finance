import { useState } from 'react'
import CurrentAndAverageCard from '../components/CurrentAndAverageCard/CurrentAndAverageCard'
import ReturnsCard from '../components/ReturnsCard/ReturnsCard'
import OverTimeChart from '../components/OverTimeChart/OverTimeChart'
import RentabilityTimeChart from '../components/RentabilityTimeChart/RentabilityTimeChart'
import { useFetchOverviewData } from '../hooks/useFetchOverviewData'
import { useFetchUserSettings } from '../hooks/useFetchUserSettings'
import '../App.css'

function Kutxa() {
    const { latestData, monthName, loading, error, allData } = useFetchOverviewData()
    const { loading: settingsLoading, error: settingsError } = useFetchUserSettings(1)
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
    const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false)

    // Prepare income chart data
    const cashChartData = allData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => {
            const date = new Date(item.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                expenses: item.kutxa_cash || 0
            };
        });

    // Prepare expenses chart data
    const rentabilityChartData = allData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((item, index, array) => {
            const date = new Date(item.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const previousValue = index > 0 ? array[index - 1].kutxa_etf : 0;
            const difference = item.kutxa_etf - previousValue;
            
            return {
                date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                rentability: (item.kutxa_etf - previousValue - 330) / item.kutxa_etf * 100
            };
        })
        .filter((item, index) => index > 0);

        const previousMonth = allData.length >= 2 
            ? [...allData].sort((a, b) => new Date(a.date) - new Date(b.date))[allData.length - 2].kutxa_etf
            : 0;

        const startOfYear = allData.find(item => item.date === '2025-01-01')?.kutxa_etf || 0;
        
        const latestRentability = rentabilityChartData.length > 0 
            ? rentabilityChartData[rentabilityChartData.length - 1].rentability 
            : 0;

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
                                justifyContent: 'flex-start',
                                alignItems: 'stretch'
                            }}>
                                <div onClick={() => setIsIncomeModalOpen(true)} style={{ cursor: 'pointer', flex: 1, display: 'flex' }}>
                                    <CurrentAndAverageCard
                                        title="Cash"
                                        subTitle="Target"
                                        currentValue={latestData.kutxa_cash}
                                        averageValue={10000}
                                        monthName={monthName}
                                        reverseColors={false}
                                    />
                                    <OverTimeChart
                                        title= 'Cash'
                                        isOpen={isIncomeModalOpen}
                                        onClose={() => setIsIncomeModalOpen(false)}
                                        data={cashChartData}
                                        averageExpenses={10000}
                                        lineColour = '#22be78ff'
                                    />
                                </div>
                                <div onClick={() => setIsExpensesModalOpen(true)} style={{ cursor: 'pointer', flex: 1, display: 'flex' }}>
                                    <ReturnsCard
                                        title="Investment founds"
                                        currentValue={latestData.kutxa_etf}
                                        previousMonth={previousMonth}
                                        startOfYear={startOfYear}
                                        reverseColors={false}
                                    />
                                    <RentabilityTimeChart
                                        isOpen={isExpensesModalOpen}
                                        onClose={() => setIsExpensesModalOpen(false)}
                                        data={rentabilityChartData}
                                        latestRentability={latestRentability}
                                    />

                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

export default Kutxa

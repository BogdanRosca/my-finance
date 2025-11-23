import { useState, useEffect } from 'react'

export function useFetchOverviewData() {
    const [latestData, setLatestData] = useState(null)
    const [averageIncome, setAverageIncome] = useState(0)
    const [averageExpenses, setAverageExpenses] = useState(0)
    const [averageInvestment, setAverageInvestment] = useState(0)
    const [monthName, setMonthName] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [allData, setAllData] = useState([])

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

                if (data.length > 0) {
                    setLatestData(data[0])

                    // Extract month name from date
                    const date = new Date(data[0].date)
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

    return {
        latestData,
        averageIncome,
        averageExpenses,
        averageInvestment,
        monthName,
        loading,
        error,
        allData
    }
}

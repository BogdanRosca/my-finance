import { useState, useEffect } from 'react'
import StockChart from '../components/StockChart'
import '../App.css'

function StockDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [timeRange, setTimeRange] = useState('1year')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [responseStock, responseTransactions] = await Promise.all([
                    fetch('/Alphabet.json'),
                    fetch('/Alphabet_transactions.json'),
                ])

                if (!responseStock.ok) {
                    throw new Error('Failed to fetch stock data')
                }

                const jsonData = await responseStock.json()
                let transactions = {}

                if (responseTransactions.ok) {
                    transactions = await responseTransactions.json()
                }

                setData({ ...jsonData, transactions })
                setError(null)
            } catch (err) {
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="app">
            <header className="app-header">
                <h1>Stock Price Chart</h1>
            </header>

            <main className="app-main">
                {loading && (
                    <div className="loading">
                        <p>Loading stock data...</p>
                    </div>
                )}

                {error && (
                    <div className="error">
                        <p>Error: {error}</p>
                    </div>
                )}

                {data && (
                    <div className="chart-container">
                        <StockChart data={data} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                    </div>
                )}
            </main>
        </div>
    )
}

export default StockDashboard

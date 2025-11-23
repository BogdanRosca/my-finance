import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  Label,
} from 'recharts'
import './StockChart.css'

function StockChart({ data, timeRange: initialTimeRange = '1year' }) {
  const [timeRange, setTimeRange] = useState(initialTimeRange)
  const [visibleLines, setVisibleLines] = useState({
    average: true,
  })

  const handleLegendClick = (e) => {
    const dataKey = e.dataKey
    setVisibleLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }))
  }

  // Calculate P/L
  const calculatePL = useMemo(() => {
    if (!data || !data['Time Series (Daily)'] || !data.transactions) {
      return 0
    }

    const transactions = data.transactions
    const latestDate = Object.keys(data['Time Series (Daily)']).sort().pop()
    const currentPrice = parseFloat(data['Time Series (Daily)'][latestDate]['4. close'])

    let totalBuyCost = 0
    let totalSellRevenue = 0
    let availableStocks = 0

    Object.entries(transactions).forEach(([date, transaction]) => {
      const price = parseFloat(transaction.price)
      const units = parseInt(transaction.units)
      const exchangeRate = parseFloat(transaction.exchangeRate) || 1

      if (transaction.type === 'Buy') {
        totalBuyCost += price * units * exchangeRate
        availableStocks += units
      } else if (transaction.type === 'Sell') {
        totalSellRevenue += price * units * exchangeRate
        availableStocks -= units
      }
    })

    const currentValue = availableStocks * currentPrice
    const pl = totalSellRevenue + currentValue - totalBuyCost

    return pl
  }, [data])

  // Calculate Average Return %
  const calculateAverageReturn = useMemo(() => {
    if (!data || !data['Time Series (Daily)'] || !data.transactions) {
      return 0
    }

    const transactions = data.transactions
    const latestDate = Object.keys(data['Time Series (Daily)']).sort().pop()
    const currentPrice = parseFloat(data['Time Series (Daily)'][latestDate]['4. close'])

    let totalBuyCost = 0
    let totalSellRevenue = 0
    let availableStocks = 0

    Object.entries(transactions).forEach(([date, transaction]) => {
      const price = parseFloat(transaction.price)
      const units = parseInt(transaction.units)
      const exchangeRate = parseFloat(transaction.exchangeRate) || 1

      if (transaction.type === 'Buy') {
        totalBuyCost += price * units * exchangeRate
        availableStocks += units
      } else if (transaction.type === 'Sell') {
        totalSellRevenue += price * units * exchangeRate
        availableStocks -= units
      }
    })

    if (totalBuyCost === 0) return 0

    const currentValue = availableStocks * currentPrice
    const pl = totalSellRevenue + currentValue - totalBuyCost
    const returnPercentage = (pl / totalBuyCost) * 100

    return returnPercentage
  }, [data])

  // Calculate Average Buy Price in EUR
  const calculateAverageBuyPriceEUR = useMemo(() => {
    if (!data || !data.transactions) return 0

    const transactions = data.transactions
    let totalBuyCostEUR = 0
    let totalBuyUnits = 0

    Object.entries(transactions).forEach(([date, transaction]) => {
      if (transaction.type === 'Buy') {
        const price = parseFloat(transaction.price)
        const units = parseInt(transaction.units)
        totalBuyCostEUR += price * units
        totalBuyUnits += units
      }
    })

    if (totalBuyUnits === 0) return 0
    return totalBuyCostEUR / totalBuyUnits
  }, [data])

  // Calculate Average Sell Price in EUR
  const calculateAverageSellPriceEUR = useMemo(() => {
    if (!data || !data.transactions) return 0

    const transactions = data.transactions
    let totalSellRevenueEUR = 0
    let totalSellUnits = 0

    Object.entries(transactions).forEach(([date, transaction]) => {
      if (transaction.type === 'Sell') {
        const price = parseFloat(transaction.price)
        const units = parseInt(transaction.units)
        totalSellRevenueEUR += price * units
        totalSellUnits += units
      }
    })

    if (totalSellUnits === 0) return 0
    return totalSellRevenueEUR / totalSellUnits
  }, [data])

  // Calculate P/L in EUR
  const calculatePLEUR = useMemo(() => {
    if (!data || !data.transactions) return 0

    const transactions = data.transactions
    let totalBuyCostEUR = 0
    let totalSellRevenueEUR = 0
    let availableStocks = 0

    Object.entries(transactions).forEach(([date, transaction]) => {
      const price = parseFloat(transaction.price)
      const units = parseInt(transaction.units)

      if (transaction.type === 'Buy') {
        totalBuyCostEUR += price * units
        availableStocks += units
      } else if (transaction.type === 'Sell') {
        totalSellRevenueEUR += price * units
        availableStocks -= units
      }
    })

    const plEUR = totalSellRevenueEUR - totalBuyCostEUR
    return plEUR
  }, [data])

  const chartData = useMemo(() => {
    if (!data || !data['Time Series (Daily)']) {
      return []
    }

    const timeSeries = data['Time Series (Daily)']
    let dates = Object.keys(timeSeries).sort()

    // Filter dates based on time range
    const now = new Date()
    let cutoffDate = new Date()

    switch (timeRange) {
      case '30days':
        cutoffDate.setDate(now.getDate() - 30)
        break
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case '3years':
        cutoffDate.setFullYear(now.getFullYear() - 3)
        break
      case 'all':
      default:
        cutoffDate = new Date('1900-01-01')
    }

    const cutoffString = cutoffDate.toISOString().split('T')[0]
    dates = dates.filter((date) => date >= cutoffString)

    return dates.map((date) => {
      const dayData = timeSeries[date]
      const open = parseFloat(dayData['1. open'])
      const close = parseFloat(dayData['4. close'])
      return {
        date,
        average: (open + close) / 2,
        high: parseFloat(dayData['2. high']),
        low: parseFloat(dayData['3. low']),
        volume: parseInt(dayData['5. volume']),
      }
    })
  }, [data, timeRange])

  // Find the data point for the transaction
  const transactionDate = '2024-03-14'
  const transactionPoint = useMemo(() => {
    if (!chartData || chartData.length === 0) return null
    return chartData.find((d) => d.date === transactionDate)
  }, [chartData])

  // Get all transaction points
  const transactionPoints = useMemo(() => {
    if (!chartData || !data.transactions) return []
    return Object.entries(data.transactions).map(([date, transaction]) => {
      const point = chartData.find((d) => d.date === date)
      return point ? { date, ...transaction, price: parseFloat(transaction.price), average: point.average } : null
    }).filter(Boolean)
  }, [chartData, data.transactions])

  if (!chartData || chartData.length === 0) {
    return <div>No data available</div>
  }

  const metadata = data['Meta Data'] || {}

  return (
    <div className="stock-chart">
      <div className="metadata">
        <h2>{metadata['2. Symbol'] || 'Stock'}</h2>
        <p>Last Updated: {metadata['3. Last Refreshed']}</p>

      </div>

      <div className="pl-stats">
        <div className="stat-item">
          <span className="stat-label">P/L</span>
          <span className="stat-value">€{calculatePLEUR.toFixed(2)}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Avg Return</span>
          <span className="stat-value">{calculateAverageReturn.toFixed(2)}%</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Avg Buy Price</span>
          <span className="stat-value">€{calculateAverageBuyPriceEUR.toFixed(2)}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Avg Sell Price</span>
          <span className="stat-value">€{calculateAverageSellPriceEUR.toFixed(2)}</span>
        </div>
      </div>

      <div className="time-range-filters">
        <button
          className={`filter-btn ${timeRange === '30days' ? 'active' : ''}`}
          onClick={() => setTimeRange('30days')}
        >
          30 Days
        </button>
        <button
          className={`filter-btn ${timeRange === '6months' ? 'active' : ''}`}
          onClick={() => setTimeRange('6months')}
        >
          6 Months
        </button>
        <button
          className={`filter-btn ${timeRange === '1year' ? 'active' : ''}`}
          onClick={() => setTimeRange('1year')}
        >
          1 Year
        </button>
        <button
          className={`filter-btn ${timeRange === '3years' ? 'active' : ''}`}
          onClick={() => setTimeRange('3years')}
        >
          3 Years
        </button>
        <button
          className={`filter-btn ${timeRange === 'all' ? 'active' : ''}`}
          onClick={() => setTimeRange('all')}
        >
          All Time
        </button>
      </div>

      <div className="charts-wrapper">
        <div className="chart-section">
          <h3>Stock Price</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval={Math.floor(chartData.length / 5)}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => `Date: ${label}`}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    const transaction = transactionPoints.find((t) => t.date === data.date)
                    if (transaction) {
                      const convertedPrice = parseFloat(transaction.price) * (parseFloat(transaction.exchangeRate) || 1)
                      return (
                        <div className="custom-tooltip">
                          <p>{`Date: ${data.date}`}</p>
                          <p className="transaction-info">{transaction.type}</p>
                          <p className="transaction-info">{transaction.units} x ${convertedPrice.toFixed(2)}</p>
                        </div>
                      )
                    }
                    return (
                      <div className="custom-tooltip">
                        <p>{`Date: ${payload[0].payload.date}`}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value.toFixed(2)}`}
                          </p>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#667eea"
                dot={false}
                name="Median"
                strokeOpacity={visibleLines.average ? 1 : 0}
                isAnimationActive={false}
              />
              {transactionPoint && (
                <ReferenceDot
                  x={transactionDate}
                  y={transactionPoint.average}
                  r={3}
                  fill="#ef4444"
                  stroke="#991b1b"
                  strokeWidth={2}
                />
              )}
              {transactionPoints.map((transaction) => (
                <ReferenceDot
                  key={transaction.date}
                  x={transaction.date}
                  y={transaction.average}
                  r={3}
                  fill={transaction.type === 'Sell' ? '#198d44ff' : '#ef4444'}
                  stroke={transaction.type === 'Sell' ? '#0b4d23ff' : '#991b1b'}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>Trading Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval={Math.floor(chartData.length / 5)}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Bar dataKey="volume" fill="#667eea" name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Highest Close:</span>
          <span className="stat-value">
            ${Math.max(...chartData.map((d) => d.close)).toFixed(2)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Lowest Close:</span>
          <span className="stat-value">
            ${Math.min(...chartData.map((d) => d.close)).toFixed(2)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Close:</span>
          <span className="stat-value">
            $
            {(
              chartData.reduce((sum, d) => sum + d.close, 0) / chartData.length
            ).toFixed(2)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Volume:</span>
          <span className="stat-value">
            {(chartData.reduce((sum, d) => sum + d.volume, 0) / 1e6).toFixed(
              2
            )}
            M
          </span>
        </div>
      </div>
    </div>
  )
}

export default StockChart

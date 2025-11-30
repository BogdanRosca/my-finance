import './ReturnsCard.css';

const ReturnsCard = ({ title, currentValue, previousMonth, startOfYear, monthName = 'Latest Month', reverseColors = false }) => {
    const differenceMonth = currentValue - previousMonth - 330;
    const returnMonth = (differenceMonth / currentValue * 100).toFixed(2);
    const differenceYear = currentValue - startOfYear - 330 * 10;
    const returnYear = (differenceYear / currentValue * 100).toFixed(2);
    const isHigher = currentValue > previousMonth;
    const isEqual = currentValue === previousMonth;

    // Apply reverse color logic for expenses (higher = bad, lower = good)
    // For income/investments: higher = good (green), lower = bad (red)
    // For expenses: higher = bad (red), lower = good (green)
    let color;
    if (isEqual) {
        color = '#666';
    } else if (reverseColors) {
        // Reverse logic: higher is bad (red), lower is good (green)
        color = isHigher ? '#f44336' : '#4caf50';
    } else {
        // Normal logic: higher is good (green), lower is bad (red)
        color = isHigher ? '#4caf50' : '#f44336';
    }

    const signMonth = differenceMonth > 0 ? '+' : '';
    const signYear = differenceYear > 0 ? '+' : '';

    return (
        <div className="currentAndAverageCard">
            <h4>{title}</h4>

            <div>
                <div className="label">
                    {monthName}
                </div>
                <div className="currentValue">
                    €{typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue}
                </div>

                <h4> 
                    Rentability
                </h4>
                
                <div className="rentability-container">
                    <div className="rentability-section">
                        <div className="label">
                            Last month
                        </div>
                        <div className="averageValue">
                            €{differenceMonth}
                        </div>

                        {!isEqual && (
                            <div className="difference" style={{ color: color }}>
                                {differenceMonth > 0 ? '▲' : '▼'} {signMonth}{returnMonth} %
                            </div>
                        )}
                    </div>
                    
                    <div className="rentability-section">
                        <div className="label">
                            Year to date
                        </div>
                        <div className="averageValue">
                            €{differenceYear}
                        </div>

                        {!isEqual && (
                            <div className="difference" style={{ color: color }}>
                                {differenceYear > 0 ? '▲' : '▼'} {signYear}{returnYear} %
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnsCard;

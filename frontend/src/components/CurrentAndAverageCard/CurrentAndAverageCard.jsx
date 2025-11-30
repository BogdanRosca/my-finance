import './CurrentAndAverageCard.css';

const CurrentAndAverageCard = ({ title, subTitle, currentValue, averageValue, monthName = 'Latest Month', reverseColors = false }) => {
    const difference = currentValue - averageValue;
    const isHigher = currentValue > averageValue;
    const isEqual = currentValue === averageValue;

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

    const sign = difference > 0 ? '+' : '';

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

                <div className="label">
                    {subTitle}
                </div>
                <div className="averageValue">
                    €{typeof averageValue === 'number' ? averageValue.toLocaleString() : averageValue}
                </div>

                {!isEqual && (
                    <div className="difference" style={{ color: color }}>
                        {difference > 0 ? '▲' : '▼'} {sign}{difference}€
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentAndAverageCard;

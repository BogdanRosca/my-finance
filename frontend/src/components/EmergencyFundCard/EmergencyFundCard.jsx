import React from 'react';
import './EmergencyFundCard.css';

const EmergencyFundCard = ({ currentAmount, targetAmount = 10000, title = "Emergency Fund" }) => {
    const percentage = Math.min((currentAmount / targetAmount) * 100, 100);
    const isGoalMet = currentAmount >= targetAmount;

    return (
        <div className="emergencyFundCard">
            <h3>{title}</h3>
            <div className="amountInfo">
                <span>Current: €{currentAmount}</span>
                <span>Target: €{targetAmount}</span>
            </div>

            <div className="progressBar">
                <div className={`progressBarFill ${isGoalMet ? 'goalMet' : 'notMet'}`} style={{ width: `${percentage}%` }}>
                    {percentage.toFixed(0)}%
                </div>
            </div>

            {isGoalMet && (
                <p className="goalMessage">
                    🎉 Goal secured!
                </p>
            )}
        </div>
    );
};

export default EmergencyFundCard;

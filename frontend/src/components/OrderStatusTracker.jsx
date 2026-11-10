import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, PackageCheck, XCircle } from 'lucide-react';

const steps = [
  { key: 'Placed', label: 'Order Placed', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'Preparing', label: 'Kitchen Preparing', icon: ChefHat },
  { key: 'Out for Delivery', label: 'On The Way', icon: Bike },
  { key: 'Delivered', label: 'Delivered', icon: PackageCheck }
];

const OrderStatusTracker = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="cancelled-banner">
        <XCircle size={22} color="#EF4444" />
        <div>
          <h4>This Order Was Cancelled</h4>
          <p>If you have any questions or concerns, please reach out to our 24/7 customer support.</p>
        </div>
        <style>{`
          .cancelled-banner {
            display: flex;
            align-items: center;
            gap: 14px;
            background: #FEF2F2;
            border: 1px solid #FCA5A5;
            padding: 16px 20px;
            border-radius: 14px;
            color: #991B1B;
            margin: 16px 0;
          }
          .cancelled-banner h4 {
            color: #991B1B;
            font-size: 0.98rem;
            margin-bottom: 2px;
          }
          .cancelled-banner p {
            font-size: 0.85rem;
            color: #B91C1C;
          }
        `}</style>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === currentStatus);
  const activeIndex = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="status-tracker-box">
      <div className="tracker-steps">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.key} className={`tracker-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="tracker-node">
                <Icon size={18} />
              </div>
              <span className="tracker-label">{step.label}</span>
              {idx < steps.length - 1 && (
                <div className={`tracker-line ${idx < activeIndex ? 'completed-line' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .status-tracker-box {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px 20px;
          border: 1px solid #F3F4F6;
          margin: 18px 0;
        }
        .tracker-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        .tracker-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
          text-align: center;
          z-index: 2;
        }
        .tracker-node {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #F3F4F6;
          color: #9CA3AF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          border: 3px solid #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .tracker-step.completed .tracker-node {
          background: #FFF2EC;
          color: #FF6B35;
          border-color: #FFD4C2;
        }
        .tracker-step.current .tracker-node {
          background: #FF6B35;
          color: #FFFFFF;
          border-color: #FF8F54;
          box-shadow: 0 4px 14px rgba(255, 107, 53, 0.4);
          transform: scale(1.1);
        }
        .tracker-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #9CA3AF;
        }
        .tracker-step.completed .tracker-label {
          color: #374151;
        }
        .tracker-step.current .tracker-label {
          color: #FF6B35;
          font-weight: 700;
        }
        .tracker-line {
          position: absolute;
          top: 20px;
          left: 50%;
          width: 100%;
          height: 3px;
          background: #F3F4F6;
          z-index: -1;
        }
        .tracker-line.completed-line {
          background: #FF6B35;
        }
        @media (max-width: 640px) {
          .tracker-label {
            font-size: 0.7rem;
          }
          .tracker-node {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderStatusTracker;


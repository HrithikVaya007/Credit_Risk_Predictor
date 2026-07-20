import "./PredictionCard.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function PredictionCard({ prediction }) {

    const isLowRisk = prediction.prediction === 0;

    return (

        <div className="prediction-container">

            <div className="prediction-card">

                <h2>Prediction Result</h2>

                <div className="prediction-status">

                    {isLowRisk ? (

                        <>
                            <FaCheckCircle className="success-icon"/>

                            <h3>Low Credit Risk</h3>
                        </>

                    ) : (

                        <>
                            <FaTimesCircle className="danger-icon"/>

                            <h3>High Credit Risk</h3>
                        </>

                    )}

                </div>

                <div className="prediction-details">

                    <div>

                        <span>Default Probability</span>

                        <h2>
                            {prediction.default_probability}
                        </h2>

                    </div>

                    <div>

                        <span>Recommendation</span>

                        <h3>

                            {prediction.loan_recommendation}

                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default PredictionCard;
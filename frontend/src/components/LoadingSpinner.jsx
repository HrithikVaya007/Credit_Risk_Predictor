import './LoadingSpinner.css';

function LoadingSpinner() {
    return (
        <div className='loading-spinner'>
            <div className='loading-overlay'>
                <div className='loading-circle'>
                    <h2>Analyzing Credit Risk</h2>

                    <p>
                         Our Machine Learning model is evaluating the customer's
                    financial profile.
                    </p>
                </div>
            </div>
        </div>
    );

}
export default LoadingSpinner;
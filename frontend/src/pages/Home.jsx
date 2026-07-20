import { useState } from "react";

import Navbar from "../components/Navbar";
import LoanForm from "../components/LoanForm";
import LoadingSpinner from "../components/LoadingSpinner";
import PredictionCard from "../components/PredictionCard";

function Home() {

    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);

    return (
        <div className="home">

            <Navbar />

            {loading && <LoadingSpinner />}

            <LoanForm
                loading={loading}
                setLoading={setLoading}
                setPrediction={setPrediction}
            />

            {prediction && (
                <PredictionCard
                    prediction={prediction}
                />
            )}

        </div>
    );

}

export default Home;
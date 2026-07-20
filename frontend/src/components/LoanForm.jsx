import {useState} from "react";
import {FaRobot} from "react-icons/fa";
import "./LoanForm.css";


function LoanForm({loading,setLoading,setPrediction}) {
    const [formData, setFormData] = useState({
  CODE_GENDER: "",
  CNT_CHILDREN: "",
  DAYS_BIRTH: "",
  NAME_FAMILY_STATUS: "",
  NAME_EDUCATION_TYPE: "",
  NAME_HOUSING_TYPE: "",
  NAME_INCOME_TYPE: "",
  OCCUPATION_TYPE: "",
  ORGANIZATION_TYPE: "",
  DAYS_EMPLOYED: "",
  AMT_INCOME_TOTAL: "",
  AMT_CREDIT: "",
  AMT_ANNUITY: "",
  AMT_GOODS_PRICE: "",
  FLAG_OWN_CAR: "",
  FLAG_OWN_REALTY: "",
  OWN_CAR_AGE: "",
  CNT_FAM_MEMBERS: "",
  NAME_TYPE_SUITE: "",
  REGION_RATING_CLIENT: "",
  REGION_POPULATION_RELATIVE: ""
});

const [errors, setErrors] = useState({});
const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};

const validateForm = () => {

    const newErrors = {};

    if (!formData.CODE_GENDER)
        newErrors.CODE_GENDER = "Please select a gender.";

    if (formData.CNT_CHILDREN === "")
        newErrors.CNT_CHILDREN = "Enter number of children.";

    if (formData.DAYS_BIRTH === "")
        newErrors.DAYS_BIRTH = "Age is required.";
    else if (Number(formData.DAYS_BIRTH) < 18 || Number(formData.DAYS_BIRTH) > 100)
        newErrors.DAYS_BIRTH = "Age must be between 18 and 100.";

    if (!formData.NAME_FAMILY_STATUS)
        newErrors.NAME_FAMILY_STATUS = "Select family status.";

    if (!formData.NAME_EDUCATION_TYPE)
        newErrors.NAME_EDUCATION_TYPE = "Select education.";

    if (!formData.NAME_HOUSING_TYPE)
        newErrors.NAME_HOUSING_TYPE = "Select housing type.";

    if (!formData.NAME_INCOME_TYPE)
        newErrors.NAME_INCOME_TYPE = "Select income type.";

    if (formData.DAYS_EMPLOYED === "")
        newErrors.DAYS_EMPLOYED = "Years employed is required.";
    else if (Number(formData.DAYS_EMPLOYED) < 0)
        newErrors.DAYS_EMPLOYED = "Cannot be negative.";

    if (formData.AMT_INCOME_TOTAL === "")
        newErrors.AMT_INCOME_TOTAL = "Annual income is required.";
    else if (formData.AMT_INCOME_TOTAL <= 0)
        newErrors.AMT_INCOME_TOTAL = "Income must be greater than 0.";

    if (formData.AMT_CREDIT === "")
        newErrors.AMT_CREDIT = "Credit amount is required.";

    if (formData.AMT_ANNUITY === "")
        newErrors.AMT_ANNUITY = "Loan annuity is required.";

    if (formData.AMT_GOODS_PRICE === "")
        newErrors.AMT_GOODS_PRICE = "Goods price is required.";

    if (!formData.FLAG_OWN_CAR)
        newErrors.FLAG_OWN_CAR = "Select Yes or No.";

    if (!formData.FLAG_OWN_REALTY)
        newErrors.FLAG_OWN_REALTY = "Select Yes or No.";

    if (formData.CNT_FAM_MEMBERS === "")
        newErrors.CNT_FAM_MEMBERS = "Family members required.";

    if (!formData.NAME_TYPE_SUITE)
        newErrors.NAME_TYPE_SUITE = "Select accompaniment.";

    if (!formData.REGION_RATING_CLIENT)
        newErrors.REGION_RATING_CLIENT = "Select region rating.";

    if (formData.REGION_POPULATION_RELATIVE === "")
        newErrors.REGION_POPULATION_RELATIVE = "Population value required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
        setLoading(true);

        const payload = {
            ...formData,
            DAYS_BIRTH: Math.round(Number(formData.DAYS_BIRTH) * -365),
            DAYS_EMPLOYED: Math.round(Number(formData.DAYS_EMPLOYED) * -365),
            CNT_CHILDREN: parseInt(formData.CNT_CHILDREN),
            CNT_FAM_MEMBERS: parseFloat(formData.CNT_FAM_MEMBERS),
            AMT_INCOME_TOTAL: parseFloat(formData.AMT_INCOME_TOTAL),
            AMT_CREDIT: parseFloat(formData.AMT_CREDIT),
            AMT_ANNUITY: parseFloat(formData.AMT_ANNUITY),
            AMT_GOODS_PRICE: parseFloat(formData.AMT_GOODS_PRICE),
            OWN_CAR_AGE: formData.OWN_CAR_AGE === "" ? null : parseFloat(formData.OWN_CAR_AGE),
            REGION_RATING_CLIENT: parseInt(formData.REGION_RATING_CLIENT),
            REGION_POPULATION_RELATIVE: parseFloat(formData.REGION_POPULATION_RELATIVE),
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        setPrediction(data);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
}

return(
    <div className="loan-container">
        <div className="loan-wrapper">
            {/*Left Panel*/}
            <div className="loan-animation">
                <div className="animation-ring"></div>
                <div className="animation-ring2"></div>
                <div className="animation-ring3"></div>
            </div>
            <h1 className="loan-title">Credit Predictor</h1>
            <p className="loan-description">Predict the likelihood of a loan default using our machine learning model.</p>

            <div className="loan-feature">
                <div className="loan-feature-item">
                    <div className="loan-feature-icon"><FaRobot/></div>
                    <span>AI-Powered Predictions</span>
                </div>
            </div>

        </div>
        {/*Right Panel*/}
        <form className="loan-form" onSubmit={handleSubmit}>
            <label>
                <span>Gender</span>
                <select
                    name="CODE_GENDER"
                    value={formData.CODE_GENDER}
                    onChange={handleChange}
                >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    </select>
                     {errors.CODE_GENDER && (
        <p className="error">{errors.CODE_GENDER}</p>
    )}

                
            </label>
            <label>
                <span>Number of Children</span>
                <input
                    type="number"
                    name="CNT_CHILDREN"
                    value={formData.CNT_CHILDREN}
                    onChange={handleChange}
                />
             {errors.CNT_CHILDREN && (
        <p className="error">{errors.CNT_CHILDREN}</p>
    )}

            </label>
            <label>
                <span>Age (years)</span>
                <input
                    type="number"
                    name="DAYS_BIRTH"
                    value={formData.DAYS_BIRTH}
                    onChange={handleChange}
                />
                {errors.DAYS_BIRTH && (
                    <p className="error">{errors.DAYS_BIRTH}</p>
                )}
            </label>
            <label>
                <span>Family Status</span>
                <select
                    name="NAME_FAMILY_STATUS"
                    value={formData.NAME_FAMILY_STATUS}
                    onChange={handleChange}
                >
                    <option value="">Select Family Status</option>
                    <option value="Single / not married">Single</option>
                    <option value="Married">Married</option>
                    <option value="Separated">Separated</option>
                    <option value="Civil marriage">Civil Marriage</option>
                    <option value="Widow">Widow</option>
                </select>
                {errors.NAME_FAMILY_STATUS && (
                    <p className="error">{errors.NAME_FAMILY_STATUS}</p>
                )}
            </label>
            <label>
                <span>Education Type</span>
                <select
                    name="NAME_EDUCATION_TYPE"
                    value={formData.NAME_EDUCATION_TYPE}
                    onChange={handleChange}
                >
                    <option value="">Select Education Type</option>
                    <option value="Secondary / secondary special">Secondary</option>
                    <option value="Higher education">Higher Education</option>
                    <option value="Incomplete higher">Incomplete Higher</option>
                    <option value="Lower secondary">Lower Secondary</option>
                    <option value="Academic degree">Academic Degree</option>
                </select>
                {errors.NAME_EDUCATION_TYPE && (
                    <p className="error">{errors.NAME_EDUCATION_TYPE}</p>
                )}
            </label>
            <label>
                <span>Housing Type</span>
                <select
                    name="NAME_HOUSING_TYPE"
                    value={formData.NAME_HOUSING_TYPE}
                    onChange={handleChange}
                >
                    <option value="">Select Housing Type</option>
                    <option value="House / apartment">House / Apartment</option>
                    <option value="With parents">With Parents</option>
                    <option value="Municipal apartment">Municipal Apartment</option>
                    <option value="Rented apartment">Rented Apartment</option>
                    <option value="Office apartment">Office Apartment</option>
                    <option value="Co-op apartment">Co-op Apartment</option>
                </select>
                {errors.NAME_HOUSING_TYPE && (
                    <p className="error">{errors.NAME_HOUSING_TYPE}</p>
                )}
            </label>
            <label>
                <span>Income Type</span>
                <select
                    name="NAME_INCOME_TYPE"
                    value={formData.NAME_INCOME_TYPE}
                    onChange={handleChange}
                >
                    <option value="">Select Income Type</option>
                    <option value="Working">Working</option>
                    <option value="Commercial associate">Commercial Associate</option>
                    <option value="Pensioner">Pensioner</option>
                    <option value="State servant">State Servant</option>
                    <option value="Student">Student</option>
                </select>
                {errors.NAME_INCOME_TYPE && (
                    <p className="error">{errors.NAME_INCOME_TYPE}</p>
                )}
            </label>

<label>
    <span>Occupation</span>
    <input
        type="text"
        name="OCCUPATION_TYPE"
        value={formData.OCCUPATION_TYPE}
        onChange={handleChange}
        placeholder="e.g. Laborers"
       
    />
    {errors.OCCUPATION_TYPE && (
        <p className="error">{errors.OCCUPATION_TYPE}</p>
    )}
</label>

<label>
    <span>Organization Type</span>
    <input
        type="text"
        name="ORGANIZATION_TYPE"
        value={formData.ORGANIZATION_TYPE}
        onChange={handleChange}
        placeholder="e.g. Business Entity Type 3"
    />
    {errors.ORGANIZATION_TYPE && (
        <p className="error">{errors.ORGANIZATION_TYPE}</p>
    )}
</label>

<label>
    <span>Years Employed</span>
    <input
        type="number"
        name="DAYS_EMPLOYED"
        value={formData.DAYS_EMPLOYED}
        onChange={handleChange}
    />
    {errors.DAYS_EMPLOYED && (
        <p className="error">{errors.DAYS_EMPLOYED}</p>
    )}
</label>

<label>
    <span>Annual Income</span>
    <input
        type="number"
        name="AMT_INCOME_TOTAL"
        value={formData.AMT_INCOME_TOTAL}
        onChange={handleChange}
    />
    {errors.AMT_INCOME_TOTAL && (
        <p className="error">{errors.AMT_INCOME_TOTAL}</p>
    )}
</label>

<label>
    <span>Credit Amount</span>
    <input
        type="number"
        name="AMT_CREDIT"
        value={formData.AMT_CREDIT}
        onChange={handleChange}
    />
    {errors.AMT_CREDIT && (
        <p className="error">{errors.AMT_CREDIT}</p>
    )}
</label>

<label>
    <span>Loan Annuity</span>
    <input
        type="number"
        name="AMT_ANNUITY"
        value={formData.AMT_ANNUITY}
        onChange={handleChange}
    />
    {errors.AMT_ANNUITY && (
        <p className="error">{errors.AMT_ANNUITY}</p>
    )}
</label>

<label>
    <span>Goods Price</span>
    <input
        type="number"
        name="AMT_GOODS_PRICE"
        value={formData.AMT_GOODS_PRICE}
        onChange={handleChange}
    />
    {errors.AMT_GOODS_PRICE && (
        <p className="error">{errors.AMT_GOODS_PRICE}</p>
    )}
</label>

<label>
    <span>Owns Car</span>
    <select
        name="FLAG_OWN_CAR"
        value={formData.FLAG_OWN_CAR}
        onChange={handleChange}
    >
        <option value="">Select</option>
        <option value="Y">Yes</option>
        <option value="N">No</option>
    </select>
    {errors.FLAG_OWN_CAR && (
        <p className="error">{errors.FLAG_OWN_CAR}</p>
    )}
</label>

<label>
    <span>Car Age</span>
    <input
        type="number"
        name="OWN_CAR_AGE"
        value={formData.OWN_CAR_AGE}
        onChange={handleChange}
    />
    {errors.OWN_CAR_AGE && (
        <p className="error">{errors.OWN_CAR_AGE}</p>
    )}
</label>

<label>
    <span>Owns Realty</span>
    <select
        name="FLAG_OWN_REALTY"
        value={formData.FLAG_OWN_REALTY}
        onChange={handleChange}
    >
        <option value="">Select</option>
        <option value="Y">Yes</option>
        <option value="N">No</option>
    </select>
    {errors.FLAG_OWN_REALTY && (
        <p className="error">{errors.FLAG_OWN_REALTY}</p>
    )}
</label>

<label>
    <span>Family Members</span>
    <input
        type="number"
        name="CNT_FAM_MEMBERS"
        value={formData.CNT_FAM_MEMBERS}
        onChange={handleChange}
    />
    {errors.CNT_FAM_MEMBERS && (
        <p className="error">{errors.CNT_FAM_MEMBERS}</p>
    )}
</label>

<label>
    <span>Accompanied By</span>
    <select
        name="NAME_TYPE_SUITE"
        value={formData.NAME_TYPE_SUITE}
        onChange={handleChange}
    >
        <option value="">Select</option>
        <option value="Family">Family</option>
        <option value="Spouse, partner">Spouse / Partner</option>
        <option value="Children">Children</option>
        <option value="Other_A">Other</option>
        <option value="Unaccompanied">Unaccompanied</option>
    </select>
    {errors.NAME_TYPE_SUITE && (
        <p className="error">{errors.NAME_TYPE_SUITE}</p>
    )}
</label>

<label>
    <span>Region Rating</span>
    <select
        name="REGION_RATING_CLIENT"
        value={formData.REGION_RATING_CLIENT}
        onChange={handleChange}
    >
        <option value="">Select</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
    </select>
    {errors.REGION_RATING_CLIENT && (
        <p className="error">{errors.REGION_RATING_CLIENT}</p>
    )}
</label>

<label>
    <span>Region Population Relative</span>
    <input
        type="number"
        step="0.0001"
        name="REGION_POPULATION_RELATIVE"
        value={formData.REGION_POPULATION_RELATIVE}
        onChange={handleChange}
    />
    {errors.REGION_POPULATION_RELATIVE && (
        <p className="error">{errors.REGION_POPULATION_RELATIVE}</p>
    )}
</label>

<button className="predict-btn" type="submit" disabled={loading}>
    {loading ? "Loading..." : "Predict Credit Risk"}
</button>
        </form>
    </div>
);

}

export default LoanForm;
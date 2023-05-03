import React, { useState } from "react";

const ImageAttributesForm = ({ onSubmit, initialValues, isFilter }) => {
    const [values, setValues] = useState(initialValues || {});

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                System:
                <input name="system" value={values.system || ""} onChange={handleChange} />
            </label>
            <label>
                Page:
                <input name="page" value={values.page || ""} onChange={handleChange} />
            </label>
            <label>
                Business Process:
                <input name="businessProcess" value={values.businessProcess || ""} onChange={handleChange} />
            </label>
            <label>
                Domain:
                <input name="domain" value={values.domain || ""} onChange={handleChange} />
            </label>
            <label>
                CRUD:
                <input name="crud" value={values.crud || ""} onChange={handleChange} />
            </label>
            <button type="submit">{isFilter ? "Apply Filters" : "Save"}</button>
        </form>
    );
};

export default ImageAttributesForm;

import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import axios from 'axios'

function Form() {
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    })
    
    const [errors, setErrrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    })

    const [buttonDisabled, setButtonDisabled] = useState(true)

    const formSchema = yup.object().shape({
        name: yup
            .string()
            .required("please enter a name"),
        email: yup
            .string()
            .email("please enter a valid email address")
            .required('email is required'),
        password: yup
            .string()
            .min(6, "password must be at least 6 characters").required("password is required"),
        terms: yup
            .boolean()
            .oneOf([true], 'must agree to terms and conditions')
    })
    
    const handleChange = e => {
        e.persist()
        console.log('name of input that fired event', e.target.name)
        const newForm = {
            ...newUser,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        }

        setNewUser(newForm)
    }

    useEffect(() => {
        formSchema.isValid(newUser).then(valid => {
            setButtonDisabled(!valid)
        })
    }, [newUser])

    const submitForm = e => {
        e.preventDefault();
        console.log('form submitted')
    }

    return (
        <div>
            <form onSubmit={submitForm}>
                <label htmlFor='name'>Name: <br />
                    <input type='text' id='name' name='name' placeholder='Enter Name' onChange={handleChange} />
                </label><br />
                <label htmlFor='email'>Email: <br />
                    <input type='text' id='email' name='email' placeholder='Enter Email Address' onChange={handleChange} />
                </label><br />
                <label htmlFor='password'>Choose a Password: <br />
                    <input type='text' id='password' name='password' placeholder='Enter Password' onChange={handleChange} />
                </label><br />
                <label htmlFor='terms'>Please Agree to the Terms and Conditions: <br />
                    <input type='checkbox' id='terms' name='terms' onChange={handleChange} />
                </label><br />
                <button type='submit' disabled={buttonDisabled} >Submit</button>
            </form>
        </div>
    )
}

export default Form
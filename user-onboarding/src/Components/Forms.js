import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import axios from 'axios'

function Form() {
    const [post, setPost] = useState([])

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    })
    
    const [errors, setErrors] = useState({
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
    
    const validateFunction = e => {
        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(valid => {
            setErrors({
                ...errors,
                [e.target.name]: ""
            })
        })
        .catch(err => {
            setErrors({
                ...errors,
                [e.target.name]: err.errors[0]
            })
        })
    }
    
    const handleChange = e => {
        e.persist()
        console.log('name of input that fired event', e.target.name)
        const newForm = {
            ...newUser,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        }
        
        validateFunction(e)
        setNewUser(newForm)
    }

    useEffect(() => {
        formSchema.isValid(newUser).then(valid => {
            setButtonDisabled(!valid)
        })
    }, [newUser])

    const submitForm = e => {
        e.preventDefault();
        axios
        .post('https://reqres.in/api/users', newUser)
        .then(res => {
            // console.log(res.data)
            setPost([...post, res.data])
            setNewUser({
                name: "",
                email: "",
                password: "",
                terms: ""
            })
        })
        .catch(err => {
            console.log('error', err)
        })
        console.log('form submitted')
    }

    useEffect(() => {
        console.log(post)
    }, [post])
    return (
        <div>
            <form onSubmit={submitForm}>
                <label htmlFor='name'><span>Name:</span> <br />
                    <input data-cy='name' type='text' id='name' name='name' placeholder='Enter Name' value={newUser.name} onChange={handleChange} />
                </label>{errors.name.length > 0 ? <p className='error' >{errors.name}</p> : null}<br />
                <label htmlFor='email'><span>Email:</span> <br />
                    <input data-cy='email' type='text' id='email' name='email' placeholder='Enter Email Address' value={newUser.email} onChange={handleChange} />
                </label>{errors.email.length > 0 ? <p className='error' >{errors.email}</p> : null}<br />
                <label htmlFor='password'><span>Choose a Password:</span> <br />
                    <input data-cy='password' type='password' id='password' name='password' placeholder='Enter Password' value={newUser.password} onChange={handleChange} />
                </label>{errors.password.length > 0 ? <p className='error' >{errors.password}</p> : null}<br />
                <label htmlFor='terms'><span>Please Agree to the Terms and Conditions:</span> <br />
                    <input data-cy='terms' className='checkbox' type='checkbox' id='terms' name='terms' checked={newUser.terms} onChange={handleChange} />
                </label>{/*errors.terms.length > 0 ? <p>{errors.terms}</p> : null*/}<br />
                <button data-cy='submit' className='submitButton' type='submit' disabled={buttonDisabled} >Submit</button>
            </form>
            <pre>{JSON.stringify(post, null, 2)}</pre>
        </div>
    )
}

export default Form
import React, { Component } from 'react';
import Button from "../../../components/UI/Button/Button";
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';

class ContactData extends Component{
    state = {
        orderForm:{

            name: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation:{
                    required:true
                },
                valid:false,
                touched:false,
                valueType:'name'
            },
            country: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation:{
                    required:true
                },
                valid:false,
                touched:false,
                valueType:'country'
            },
            zipCode: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'ZIP CODE'
                },
                value: '',
                validation:{
                    required:true,
                    minLength:5,
                    maxLength:5
                },
                valid:false,
                touched:false,
                valueType:'zip code'
            },
            street: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation:{
                    required:true
                },
                valid:false,
                touched:false,
                valueType:'street address'
            },
            email: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation:{
                    required:true
                },
                valid:false,
                touched:false,
                valueType:'email address'
            },
            deliveryMethod:{
                elementType: 'select',
                elementConfig:{
                    options:[
                        {value:'fastest',displayValue: 'Fastest'},
                        {value:'cheapest',displayValue: 'Cheapest'},
                    ]
                },
                value: '',
                validation:{},
                valid:true
            }
        },
        loading:false,
        formIsValid:false
    };
    checkValidity(value,rules){
        let isValid = true;

        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.minLength && isValid;
        }
        return isValid;
    }
    orderHandler = (e) =>{
        e.preventDefault();
        this.setState({loading:true});
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.totalPrice,
            orderData:formData

        };
        axios.post('/orders.json',order)
            .then(response => {
                this.setState({loading:false})
                this.props.history.push('/');
            })
            .catch(e =>{
                this.setState({loading:false})
            })
    };
    inputChangedHandler = (e,inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = e.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm:updatedOrderForm,formIsValid})
    };

    render(){
        const formElementArray = [];
        for (let key in this.state.orderForm){
            formElementArray.push({
                id:key,
                config:this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {
                    formElementArray.map(formElement => (
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value= {formElement.config.value}
                            changed={(e)=>this.inputChangedHandler(e,formElement.id)}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            valueType={formElement.config.valueType}
                        />
                    ))
                }
                <Button disabled={!this.state.formIsValid} className={classes.Input} btnType="Success">ORDER</Button>
            </form>
        );
        if(this.state.loading){
            form = <Spinner/>;
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
};
const mapStateToProps = state => {
    return {
        ings:state.ingredients,
        totalPrice:state.totalPrice
    }
}
export default connect(mapStateToProps)(ContactData);
import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth'
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from 'react-router-dom';


class Auth extends Component{
    state = {
        controls:{
            email: {
                elementType: 'input',
                elementConfig:{
                    type: 'email',
                    placeholder: 'Your Email Address'
                },
                value: '',
                validation:{
                    required:true,
                    isEmail:true
                },
                valid:false,
                touched:false,
                valueType: 'email address'
            },
            password: {
                elementType: 'input',
                elementConfig:{
                    type: 'password',
                    placeholder: 'Your Password'
                },
                value: '',
                validation:{
                    required:true,
                    minLength:6
                },
                valid:false,
                touched:false,
                valueType: 'password'
            },
        },
        isSignup:true
    };
    componentDidMount(){
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        }
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
        if(rules.isEmail){
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    };

    inputChangedHandler = (e,controlName) => {
            const updatedControls = {
                ...this.state.controls,
                [controlName]:{
                    ...this.state.controls[controlName],
                    value:e.target.value,
                    valid: this.checkValidity(e.target.value,this.state.controls[controlName].validation),
                    touched:true
                }
            };
            this.setState({controls:updatedControls})

    };
    submitHandler = (e) => {
        e.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value,this.state.isSignup);
    };
    switchAuthModeHandler = () => {
      this.setState(prevState => {
          return {isSignup: !prevState.isSignup}
      })
    };
    render(){
        const formElementArray = [];
        for (let key in this.state.controls){
            formElementArray.push({
                id:key,
                config:this.state.controls[key]
            });
        }
        let form = formElementArray.map(formElement => (
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
        ));
        if(this.props.loading){
          form = <Spinner/>
        };
        let errorMessage = null;
        if(this.props.error){
            errorMessage = (
              <p>{this.props.error.message}</p>
            );
        }
        let authRedirect = null;
        if(this.props.isAuthenticated){
            authRedirect= <Redirect to={this.props.authRedirectPath} />;
        }
        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignup? 'SIGNIN':'SIGNUP'}</Button>
            </div>
        )
    }
};
const mapStateToProps = state =>{
    return{
        loading:state.auth.loading,
        error:state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger:state.burgerBuilder.building,
        authRedirectPath:state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email,password,isSignup) => dispatch(actions.auth(email,password,isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Auth);
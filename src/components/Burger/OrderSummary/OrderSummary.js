import React from 'react';
import Aux from '../../../hoc/ReactAux/ReactAux';
import Button from "../../UI/Button/Button";

class OrderSummary extends React.Component {

    componentWillUpdate(){
        console.log('[order summary] will update');
    }

    render(){
        const ingredients = Object.keys(this.props.ingredients)
            .map(igKey => {
                return (
                    <li key={igKey}>
               <span style={{
                   textTransform: 'capitalize'
               }}> {igKey} </span>: {this.props.ingredients[igKey]}
                    </li>
                )
            });
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious burger with following ingredients:</p>
                <ul>
                    {ingredients}
                </ul>
                <p><strong>Total Price:</strong> {this.props.price.toFixed(2)}</p>
                <p>Continue to checkout?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCancelHandler}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinueHandler}>CONTINUE</Button>
            </Aux>
        )
    }

};
export default OrderSummary;
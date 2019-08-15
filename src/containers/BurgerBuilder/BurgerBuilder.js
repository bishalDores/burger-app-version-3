import React, { Component } from 'react';
import Aux from '../../hoc/ReactAux/ReactAux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from '../../axios-orders';
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';



class BurgerBuilder extends Component{
    state = {
        // ingredients:null,
        // totalPrice: 4,
        purchasable:false,
        purchasing:false,
        loading:false,
        error:false
    };
    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce(((sum,el)=>{
                return sum + el
            }),0);
        this.setState({purchasable: sum > 0})
    }
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // };


    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0){
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceDeduction;
    //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients)
    // };
    purchaseHandler = () => {
        this.setState({purchasing:true})
    };
    purchaseCancelHandler = () => {
        this.setState({purchasing:false})
    };
    purchaseContinueHandler = () => {
        // alert("you will continue");
        // this.setState({loading:true});
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Bishal Peter Dores',
        //         address: {
        //             country: 'Bangladesh',
        //             zipCode: '1215',
        //             street: 'East Razabazar'
        //         },
        //         email: 'bishalpd@gmail.com'
        //     },
        //     deliveryMethod: 'fastest'
        // };
        // axios.post('/orders.json',order)
        //     .then(response => {
        //         this.setState({loading:false,purchasing:false})
        //     })
        //     .catch(e =>{
        //         this.setState({loading:false,purchasing:false})
        //     })
        const queryParams = [];
        for (let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search:'?' + queryString
        });
    };
    componentDidMount(){
        console.log(this.props.ings)
        // axios.get("https://burger-app-2a5d9.firebaseio.com/ingredients.json")
        //     .then(response => {
        //         this.setState({ingredients:response.data})
        //     })
        //     .catch(error => {this.setState({error:true})})
    }

    render(){
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null ;



        let burger = this.state.error? <p>Application cant be loaded !!</p>:<Spinner/>;

        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientAdded = {this.props.onIngredientAdded}
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        disabled = {disabledInfo}
                        price={this.props.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary ingredients={this.props.ings}
                                         purchaseCancelHandler={this.purchaseCancelHandler}
                                         purchaseContinueHandler={this.purchaseContinueHandler}
                                         price={this.props.totalPrice}/>;
        }
        if(this.state.loading){
            orderSummary = <Spinner/>
        }


        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}
const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        totalPrice:state.totalPrice
    }
};
const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName) => dispatch({type:actionTypes.ADD_INGREDIENT,ingredientName:ingName}),
        onIngredientRemoved: (ingName) => dispatch({type:actionTypes.REMOVE_INGREDIENT,ingredientName:ingName})

    }
};
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));
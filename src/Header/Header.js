import React, { Component } from "react";
import deepcopy from "deepcopy";
import { bindActionCreators } from 'redux'
import * as pageActions from '../actions/PageActions'
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import BigNumber from "bignumber.js";
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SelectField from 'material-ui/SelectField';
import "./Header.css";

/** Функция обрезает число до 15 чисел, для использования в библиотеке BigNumber */
function trim_digits(number_) {
    var count = 15;
    var s = number_.toString();
    if (s.indexOf(".") > -1)
        return parseFloat(s.length > count + 1 ? s.substr(0, count + 1) : s);
    else
        return parseFloat(s.length > count ? s.substr(0, count) : s);
}

/** Обрезает число до 14 знаков после запятой */
function trim(number) {
    return trim_digits(number);
}

/** Обрезает число до указанного количества знаков после запятой */
function trim_float(number, count) {
    var count_ = 1;
    for (var i = 0; i < count; i++) {
        count_ = count_ * 10;
    }
    return (Math.floor(number * count_)) / count_;
}

const style = {
    margin: 12,
};


class HeaderCnt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.ref__base_course_item = React.createRef();
        this.props.pageActions.getCoursesFromSite();
    }

    convert_courses(first_item, first_item_amount, second_item) {
        var base_currency = this.props.base_currency;
        //Переводим из начальной валюты в базовую
        var amount_to_base_currency = new BigNumber(trim(first_item.value)).multipliedBy(trim(first_item_amount));
        //Переводим из базовой валюты в конечную
        var amount_end_currency = amount_to_base_currency.dividedBy(second_item.value);
        return trim_float(amount_end_currency.toNumber(), 6);
    }

    getCurrencyByCode(code) {
        for (var i = 0; i < this.props.courses_list.length; i++) {
            if (this.props.courses_list[i].code === code)
                return this.props.courses_list[i];
        }
        return {
            code: "",
            description: "",
            nominal: 0,
            value: 0
        }
    }

    convert_courses(first_item, first_item_amount, second_item) {
        var base_currency = this.props.base_currency;
        //Переводим из начальной валюты в базовую
        var amount_to_base_currency = new BigNumber(trim(first_item.value)).multipliedBy(trim(first_item_amount));
        //Переводим из базовой валюты в конечную
        var amount_end_currency = amount_to_base_currency.dividedBy(second_item.value);
        return trim_float(amount_end_currency.toNumber(), 6);
    }

    onChangeBaseCourse(event, index, item) {
        console.log(arguments);
        var new_base_currency = this.getCurrencyByCode(item);
        this.props.pageActions.setBaseCurrency(new_base_currency);
    }
    handleToggle = () => this.setState({ open: !this.state.open });

    handleClose = () => this.setState({ open: false });


    render() {
        const RightMenu = (props) => (
            <div className="header__wrap_base_currency_select">
            <SelectField
            className="header__base_currency__select"
                value={this.props.base_currency.code}
                onChange={this.onChangeBaseCourse.bind(this)}
            >
                {
                    this.props.courses_list.map((item, index) => {
                        return (
                            <MenuItem  key={index} value={item.code} primaryText={item.code+" "+item.description} />
                        )
                    })
                }
            </SelectField>
            </div>
          );
        return (
            <div>
                <AppBar
                    title="Курсы валют, данные взятые с ЦБ РФ"
                    iconElementRight={<RightMenu />}
                    onLeftIconButtonClick={() => {
                        this.setState({ open: !this.state.open })
                    }}
                />

                <Drawer docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({ open })}>
                    <MenuItem onClick={() => { this.props.history.push("/courseslist"); this.handleClose() }}>Список курсов</MenuItem>
                    <MenuItem onClick={() => { this.props.history.push("/coursesconverter"); this.handleClose() }}>Конвертер курсов</MenuItem>
                </Drawer>


            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        courses_list: state.courses.courses_list,
        first_course_item: state.courses.first_course_item,
        second_course_item: state.courses.second_course_item,
        first_course_amount: state.courses.first_course_amount,
        second_course_amount: state.courses.second_course_amount,
        base_currency: state.courses.base_currency
    }
}

function mapDispatchToProps(dispatch) {
    return {
        pageActions: bindActionCreators(pageActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderCnt));
import React, { Component } from "react";
import deepcopy from "deepcopy";
import { bindActionCreators } from 'redux'
import * as pageActions from '../actions/PageActions'
import { connect } from 'react-redux'
import BigNumber from "bignumber.js";
import Paper from 'material-ui/Paper';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import "./CoursesList.css";


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



class CoursesListCnt extends Component {
    constructor(props) {
        super(props);
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


    getCourseByBaseCurrency(currentCurrency) {
        var first_base_currency = this.getCurrencyByCode("RUB");
        var base_currency = this.props.base_currency;
        var new_amount = (new BigNumber(trim(first_base_currency.value)).dividedBy(trim(base_currency.value)).multipliedBy(trim(currentCurrency.value)));
        return trim_float(new_amount.toNumber(), 6);
    }

    addToFavorites(item) {
        var courses_list = deepcopy(this.props.courses_list);
        for (var i = 0; i < courses_list.length; i++) {
            if (item.code == courses_list[i].code) {
                courses_list[i]["favorite"] = true;
            }
        }
        this.props.pageActions.setCoursesList(courses_list);
    }

    removeFromFavorites(item) {
        var courses_list = deepcopy(this.props.courses_list);
        for (var i = 0; i < courses_list.length; i++) {
            if (item.code == courses_list[i].code) {
                courses_list[i]["favorite"] = false;
            }
        }
        this.props.pageActions.setCoursesList(courses_list);
    }

    compare(a, b) {
        if (!a.favorite) {
            return 1;
        }
        if (a.favorite) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }

    render() {
        const style = {
            height: "100%",
            width: 1100,
            margin: 20,
            textAlign: 'center',
            display: 'inline-block',
        };
        const styles={
            headline: {
                fontSize: 24,
                fontWeight: 400,
            }
        }
        return (
            <div className="contaner">

                <Paper style={style} zDepth={1} >
                    <h2 style={styles.headline}>Список курсов валют</h2>
                    <Table >
                        <TableHeader displaySelectAll={false}
                            adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Код валюты</TableHeaderColumn>
                                <TableHeaderColumn>Курс</TableHeaderColumn>
                                <TableHeaderColumn>Номинал</TableHeaderColumn>
                                <TableHeaderColumn>Текстовое описание</TableHeaderColumn>
                                <TableHeaderColumn>Избранное</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                this.props.courses_list.sort(this.compare).map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableRowColumn>{item.code}</TableRowColumn>
                                            <TableRowColumn>{this.getCourseByBaseCurrency(item)}</TableRowColumn>
                                            <TableRowColumn>{item.nominal}</TableRowColumn>
                                            <TableRowColumn>{item.description}</TableRowColumn>
                                            <TableRowColumn>
                                                {
                                                    item.favorite
                                                        ?
                                                        <img width="18" className="selected_star" onClick={this.removeFromFavorites.bind(this, item)} src="/star_select.png" />
                                                        :
                                                        ""
                                                }
                                                {
                                                    !item.favorite
                                                        ?
                                                        <img width="18" className="unselected_star" onClick={this.addToFavorites.bind(this, item)} src="/star_unselect.png" />
                                                        :
                                                        ""
                                                }
                                            </TableRowColumn>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        courses_list: state.courses.courses_list,
        base_currency: state.courses.base_currency
    }
}

function mapDispatchToProps(dispatch) {
    return {
        pageActions: bindActionCreators(pageActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesListCnt);
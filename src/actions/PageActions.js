import { SET_COURSES_LIST, SET_EXCHANGE_ITEMS, SET_BASE_CURRENCY } from '../constants/Page'
import $ from "jquery";

export function setCoursesList(courses_list) {

    return {
        type: SET_COURSES_LIST,
        payload: courses_list
    }

}

export function setExchangeItems(first_course_item, first_course_amount, second_course_item, second_course_amount) {

    return {
        type: SET_EXCHANGE_ITEMS,
        payload: { first_course_item, first_course_amount, second_course_item, second_course_amount }
    }

}


export function getCoursesFromSite() {
    return (dispatch) => {
        $.get("http://185.28.101.235/courses")
        .then((val) => {
            if (val.success) {
                dispatch({
                    type: SET_COURSES_LIST,
                    payload: val.values
                })
            }
        })
        .catch((e)=> {
            console.log(e);
        })
    }
}

export function setBaseCurrency(base_currency) {
    return (dispatch) => {
                dispatch({
                    type: SET_BASE_CURRENCY,
                    payload: {
                        base_currency
                    }
                })
    }
}
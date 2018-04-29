import { SET_COURSES_LIST, SET_EXCHANGE_ITEMS, SET_BASE_CURRENCY } from '../constants/Page'

const initialState = {
    courses_list: [
        {
            code: "",
            description: "",
            nominal: 1,
            value: 1
        },
        {
            code: "",
            description: "",
            nominal: 1,
            value: 1
        }
    ],
    first_course_item: {
        code: "",
        description: "",
        nominal: 0,
        value: 0
    },
    second_course_item: {
        code: "",
        description: "",
        nominal: 0,
        value: 0
    },
    first_course_amount: 1,
    second_course_amount: 1,
    base_currency: {
        code: "",
        description: "",
        nominal: 1,
        value: 0
    }
}

export default function courses(state = initialState, action) {
    switch (action.type) {
        case SET_EXCHANGE_ITEMS:
            return {
                ...state,
                first_course_item: action.payload.first_course_item,
                first_course_amount: action.payload.first_course_amount,
                second_course_item: action.payload.second_course_item,
                second_course_amount: action.payload.second_course_amount
            }
        case SET_COURSES_LIST:
        return {
            ...state,
            courses_list: action.payload,
            first_course_item: state.first_course_item.code !=="" ? state.first_course_item : (action.payload.length>0 ? action.payload[0] : state.first_course_item),
            second_course_item: state.second_course_item.code !=="" ? state.second_course_item : (action.payload.length>0 ? action.payload[0] : state.second_course_item),
            base_currency: state.base_currency.code !=="" ? state.base_currency : (action.payload.length>0 ? action.payload[0] : state.base_currency)
        }
        case SET_BASE_CURRENCY:
        return {
            ...state,
            base_currency: action.payload.base_currency
        }
        default:
            return state
    }

}
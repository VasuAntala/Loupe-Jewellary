import { CREATE_PRODUCT_REQUEST, CREATE_PRODUCT_FAILURE, CREATE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAILURE, DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_SUCCESS, FIND_PRODUCTS_FAILURE, FIND_PRODUCTS_REQUEST, FIND_PRODUCTS_SUCCESS, FIND_PRODUCT_BY_ID_FAILURE, FIND_PRODUCT_BY_ID_REQUEST, FIND_PRODUCT_BY_ID_SUCCESS, UPDATE_PRODUCT_FAILURE, UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS } from "./ActionType"

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    deletedProduct: null,
    updatedProduct: null,
}

export const customerProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case FIND_PRODUCTS_REQUEST:
        case FIND_PRODUCT_BY_ID_REQUEST:
        case DELETE_PRODUCT_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
        case CREATE_PRODUCT_REQUEST:
            return { ...state, loading: true, error: null }

        case FIND_PRODUCTS_SUCCESS:
            return { ...state, loading: false, error: null, products: action.payload }
        case FIND_PRODUCT_BY_ID_SUCCESS:
            return { ...state, loading: false, error: null, product: action.payload }
        case DELETE_PRODUCT_SUCCESS: {
            const deletedId = action.payload;
            let updatedList = state.products;
            if (updatedList?.content) {
                updatedList = {
                    ...updatedList,
                    content: updatedList.content.filter((p) => p._id !== deletedId)
                };
            }
            return { ...state, loading: false, error: null, deletedProduct: deletedId, products: updatedList }
        }
        case CREATE_PRODUCT_SUCCESS: {
            const created = action.payload;
            let updatedList = state.products;
            if (updatedList?.content) {
                updatedList = {
                    ...updatedList,
                    content: [created, ...updatedList.content]
                };
            }
            return { ...state, loading: false, error: null, products: updatedList };
        }
        case UPDATE_PRODUCT_SUCCESS: {
            const updated = action.payload;
            let updatedList = state.products;
            if (updatedList?.content) {
                updatedList = {
                    ...updatedList,
                    content: updatedList.content.map((p) => p._id === updated._id ? updated : p)
                };
            }
            return { ...state, loading: false, error: null, updatedProduct: updated, products: updatedList }
        }

        case FIND_PRODUCTS_FAILURE:
        case FIND_PRODUCT_BY_ID_FAILURE:
        case DELETE_PRODUCT_FAILURE:
        case UPDATE_PRODUCT_FAILURE:
        case CREATE_PRODUCT_FAILURE:
            return { ...state, loading: false, error: action.payload }

        default:
            return state;
    }
}

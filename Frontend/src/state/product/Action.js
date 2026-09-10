import axios from "axios";
import { api, API_URL, API_BASE_URL } from "../../config/apiConfig";
import { toastNotify } from '../shared/toast';
import {
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  FIND_PRODUCTS_FAILURE,
  FIND_PRODUCTS_REQUEST,
  FIND_PRODUCTS_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
} from "./ActionType";

export const findProducts = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCTS_REQUEST });

  const {
    category, // product-name
    type, // jewellery-type (gold, diamond, ...)
    color,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    occasion,
    sort,
    collectionName,
    // stock,
    pageNumber,
    pageSize, // total products in 1 page
    search,
  } = reqData;
  console.log('reqData for findProducts', reqData);

  try {
    const { data } = await axios.get(`${API_URL}/api/products`, {
      params: {
        color,
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        type,
        category,
        occasion,
        sort,
        pageNumber,
        pageSize,
        collectionName,
        search: search || '',
      },
    });

    dispatch({ type: FIND_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const findProductById = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });

  const { productId } = reqData;

  try {
    const { data } = await api.get(`${API_BASE_URL}/api/products/id/${productId}`);

    dispatch({ type: FIND_PRODUCT_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_PRODUCT_BY_ID_FAILURE, payload: error.message });
  }
};

export const createProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST })

    const { data } = await api.post(`${API_BASE_URL}/api/admin/products`, product);
    console.log('created product:', data)

    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: data,
    })
    toastNotify({ type: 'success', title: 'Product created', description: 'Product added successfully.' });

    // Refresh global product list so customer site reflects changes
    try {
      const refreshPayload = {
        category: 'jewellery',
        color: [],
        minPrice: 0,
        maxPrice: 1000000,
        minDiscount: 0,
        maxDiscount: 100,
        sort: 'low_to_high',
        pageNumber: 1,
        pageSize: 12,
        occasion: [],
        type: [],
      };
      await dispatch(findProducts(refreshPayload));
    } catch { }
  } catch (error) {
    dispatch({ type: CREATE_PRODUCT_FAILURE, payload: error.message });
  }
}

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST })

    const { data } = await api.delete(`${API_BASE_URL}/api/admin/products/${productId}`)
    console.log("deleted product:", data)

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId,
    })
    toastNotify({ type: 'success', title: 'Product deleted', description: 'Product removed successfully.' });

    // Refresh global product list so customer site reflects changes
    try {
      const refreshPayload = {
        category: 'jewellery',
        color: [],
        minPrice: 0,
        maxPrice: 1000000,
        minDiscount: 0,
        maxDiscount: 100,
        sort: 'low_to_high',
        pageNumber: 1,
        pageSize: 12,
        occasion: [],
        type: [],
      };
      await dispatch(findProducts(refreshPayload));
    } catch { }
  } catch (error) {
    dispatch({ type: DELETE_PRODUCT_FAILURE, payload: error.message });
  }
}

export const updateProduct = ({ productId, updates }) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const { data } = await api.put(`${API_BASE_URL}/api/admin/products/${productId}`, updates);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    toastNotify({ type: 'success', title: 'Product updated', description: 'Changes saved successfully.' });

    // Refresh global product list so customer site reflects changes
    try {
      const refreshPayload = {
        category: 'jewellery',
        color: [],
        minPrice: 0,
        maxPrice: 1000000,
        minDiscount: 0,
        maxDiscount: 100,
        sort: 'low_to_high',
        pageNumber: 1,
        pageSize: 12,
        occasion: [],
        type: [],
      };
      await dispatch(findProducts(refreshPayload));
    } catch { }
  } catch (error) {
    dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: error.message });
  }
}

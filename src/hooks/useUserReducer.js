import { useReducer, useCallback } from 'react';
import axios from 'axios';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_USERS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const useUserReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchUsers = useCallback(async () => {
    dispatch({ type: 'FETCH_USERS_REQUEST' });
    try {
      const response = await axios.get('../src/data/users.json');
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
    }
  }, []);

  return { state, fetchUsers };
};

export default useUserReducer;
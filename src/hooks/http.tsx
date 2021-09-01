import { useCallback, useReducer } from "react";
import Ingredient from "../models/ingredient";

type HttpObj = {
  loading: boolean;
  error: string | undefined;
  data: Response;
  extra: string | Ingredient | undefined;
  identifier: string | undefined;
};

type HttpActionType =
  | { type: "SEND"; requestIdentifier: string | undefined }
  | {
      type: "RESPONSE";
      responseData: any;
      extra: Ingredient | string | undefined;
    }
  | { type: "ERROR"; errorMessage: string }
  | { type: "CLEAR" };

const initialState = {
  loading: false,
  error: undefined,
  data: undefined,
  extra: undefined,
  identifier: undefined,
};

const httpReducer = (currentHttpState: HttpObj, action: HttpActionType) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: undefined,
        data: undefined,
        extra: undefined,
        identifier: action.requestIdentifier,
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return {
        ...currentHttpState,
        loading: false,
        error: action.errorMessage,
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("No se ejecuta");
  }
};

// the hook should be just caring about the http request, not about what we do with the response
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const sendRequest = useCallback(
    (
      url: RequestInfo,
      method: string,
      body?: BodyInit,
      reqExtra?: Ingredient | string,
      reqIdentifier?: string
    ) => {
      dispatchHttp({ type: "SEND", requestIdentifier: reqIdentifier });

      fetch(url, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((resData) =>
          dispatchHttp({
            type: "RESPONSE",
            responseData: resData,
            extra: reqExtra,
          })
        )
        .catch((err: Error) => {
          dispatchHttp({ type: "ERROR", errorMessage: err.message });
        });
    },
    []
  );

  const clear = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  return {
    sendRequest: sendRequest,
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    requestExtra: httpState.extra,
    requestIdentifier: httpState.identifier,
    clear: clear,
  };
};

export default useHttp;

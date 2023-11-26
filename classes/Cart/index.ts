import RDK, { Data, KeyValue, Response } from '@retter/rdk';
import { CartInput } from './rio';
const rdk = new RDK();


interface CartPrivateState {
    items: CartInput[]
}

interface CartData<I = any, O = any> extends Data<any, any, KeyValue, CartPrivateState> {

}
export async function authorizer(data: Data): Promise<Response> {
    const { identity, methodName } = data.context;
    if (methodName === 'setState' && identity === 'developer') return { statusCode: 204 };

    return { statusCode: 403 };
}

export async function init(data: Data<any, any, KeyValue, CartPrivateState>): Promise<Data> {
    data.state.private = {
        items: []
    };
    return data;
}

export async function getState(data: Data): Promise<Response> {
    return {
        statusCode: 200,
        body: data.state,
        headers: { 'x-rio-state-version': data.version.toString() }
    };
}

export async function setState(data: Data): Promise<Data> {
    const { state, version } = data.request.body || {};
    if (data.version === version) {
        data.state = state;
        data.response = { statusCode: 204 };
    } else {
        data.response = {
            statusCode: 409,
            body: {
                message: `Your state version (${version}) is behind the current version (${data.version}).`,
            },
        }
    }
    return data;
}

export async function update(data: CartData<CartInput>): Promise<Data> {
    data.response = {
        statusCode: 200,
        body: {
            message: "Updated!! Success",
        },
    };
    return data;
}

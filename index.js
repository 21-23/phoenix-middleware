const createPhoenix = require('phoenix');

export const CONNECTED = '@@phoenix/CONNECTED';
export const DISCONNECTED = '@@phoenix/DISCONNECTED';
export const MESSAGE = '@@phoenix/MESSAGE';
export const SEND = '@@phoenix/SEND';
export const DISCONNECT = '@@phoenix/DISCONNECT';

export default function createPhoenixMiddleware(options, client = WebSocket) {

    let phoenix = null;

    return function ({ dispatch }) {

        if (!phoenix) {
            phoenix = createPhoenix(client, options);

            phoenix
                .on('connected', () => {
                    dispatch({ type: CONNECTED });
                })
                .on('disconnected', () => {
                    dispatch({ type: DISCONNECTED });
                })
                .on('message', (message) => {
                    dispatch({ type: MESSAGE, payload: message });
                });
        }

        return function (next) {
            return function (action) {
                if (action.type === SEND) {
                    phoenix.send(action.payload);
                }

                if (action.type === DISCONNECT) {
                    phoenix.destroy();
                }

                return next(action);
            };
        };
    };
}

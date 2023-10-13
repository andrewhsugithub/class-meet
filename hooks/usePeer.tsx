const ADD_PEER_STREAM = "ADD_PEER_STREAM" as const;
const REMOVE_PEER = "REMOVE_PEER" as const;
const ADD_PEER_NAME = "ADD_PEER_NAME" as const;

export const addPeerStream = (peerId: string, stream: MediaStream) => ({
  type: ADD_PEER_STREAM,
  payload: { peerId, stream },
});

export const addPeerNameAction = (peerId: string, username: string) => ({
  type: ADD_PEER_NAME,
  payload: { peerId, username },
});

export const removePeer = (peerId: string) => ({
  type: REMOVE_PEER,
  payload: { peerId },
});

export type PeerState = Record<
  string,
  { stream?: MediaStream; username?: string }
>; // userId -> stream
type PeerAction =
  | ReturnType<typeof addPeerStream>
  | ReturnType<typeof removePeer>
  | ReturnType<typeof addPeerNameAction>;

export const peerReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER_STREAM:
      console.log("adding peer");
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      };
    case REMOVE_PEER:
      //   const { [action.payload.peerId]: _, ...rest } = state;
      console.log("removing peer");
      const { [action.payload.peerId]: deleted, ...rest } = state;
      return rest;
    case ADD_PEER_NAME:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          username: action.payload.username,
        },
      };
    default:
      return state;
  }
};

const ADD_PEER = "ADD_PEER" as const;
const REMOVE_PEER = "REMOVE_PEER" as const;

export const addPeer = (peerId: string, stream: MediaStream) => ({
  type: ADD_PEER,
  payload: { peerId, stream },
});

export const removePeer = (peerId: string) => ({
  type: REMOVE_PEER,
  payload: { peerId },
});

export type PeerState = Record<string, { stream: MediaStream }>; // userId -> stream
type PeerAction = ReturnType<typeof addPeer> | ReturnType<typeof removePeer>;

export const peerReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER:
      console.log("adding peer");
      return {
        ...state,
        [action.payload.peerId]: {
          stream: action.payload.stream,
        },
      };
    case REMOVE_PEER:
      //   const { [action.payload.peerId]: _, ...rest } = state;
      console.log("removing peer");
      const { [action.payload.peerId]: deleted, ...rest } = state;
      return rest;
    default:
      return state;
  }
};

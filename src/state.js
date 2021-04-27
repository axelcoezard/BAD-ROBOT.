let defaultState = {
    audio: {
        connection: null,
        setConnection: async (a) => this.connection = a,

        dispatcher: null,
        setDispatcher: async (a) => this.dispatcher = a, 

        isPlaying: false,
        setIsPlaying: async (a) => this.isPlaying = a,
        
        volume: 5,
        setVolume: async (a) => this.volume = a,

        queue: [],
        setQueue: async (a) => this.queue = a,
    }
};

export default defaultState;
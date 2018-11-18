exports.Stream = class Stream {

  constructor(connection, streamType) {

    return connection.stream('streaming/' + streamType)

  }

}

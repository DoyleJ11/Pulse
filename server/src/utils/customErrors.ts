export class CustomError extends Error {
  constructor(
    message: string,
    public status: number = 500,
  ) {
    super(message);
  }
}

export class RoomError extends CustomError {
  public roomCode?: string;
  public action?: string;
  constructor(message: string, roomCode?: string, action?: string) {
    super(message, 404);
    this.name = "RoomError";
    this.roomCode = roomCode;
    this.action = action;
  }
}

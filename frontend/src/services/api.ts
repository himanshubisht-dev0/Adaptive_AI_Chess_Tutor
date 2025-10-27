// Add new methods to existing API class
class ChessTutorAPI {
  // ... existing methods ...

  // Authentication
  async signUp(username: string, email: string, password: string) {
    const response = await this.client.post('/auth/signup', {
      username, email, password
    });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  }

  async signIn(email: string, password: string) {
    const response = await this.client.post('/auth/signin', {
      email, password
    });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  }

  // Game management
  async createGame(gameType: string, whitePlayer: string, blackPlayer: string, stockfishLevel?: number) {
    const response = await this.client.post('/game/create', {
      game_type: gameType,
      white_player: whitePlayer,
      black_player: blackPlayer,
      stockfish_level: stockfishLevel
    });
    return response.data.game;
  }

  async makeMove(gameId: string, move: string, userId: string) {
    const response = await this.client.post('/game/move', {
      game_id: gameId,
      move,
      user_id: userId
    });
    return response.data;
  }

  async getUserGames(userId: string) {
    const response = await this.client.get(`/game/user/${userId}`);
    return response.data.games;
  }
}

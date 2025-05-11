const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2/promise');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, '../protos/recommendation.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const recommendationProto = grpc.loadPackageDefinition(packageDefinition).recommendation;

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',  
  database: 'recommendation_service',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize DB (create tables if they don't exist)
async function initializeDatabase() {
  try {
    const conn = await pool.getConnection();
    
    // Create films table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS films (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        release_year INT NOT NULL,
        rating FLOAT
      )
    `);
    
    // Check if we need to add sample data
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM films');
    
    if (rows[0].count === 0) {
      // Add sample films
      await conn.query(`
      INSERT INTO films (title, genre, release_year, rating) VALUES
    ('Citizen Kane', 'Drama', 1941, 8.3),
    ('The Godfather', 'Crime', 1972, 9.2),
    ('Casablanca', 'Romance', 1942, 8.5),
    ('Raging Bull', 'Biography', 1980, 8.2),
    ('Singin in the Rain', 'Musical', 1952, 8.3),
    ('Gone with the Wind', 'Drama', 1939, 8.2),
    ('Lawrence of Arabia', 'Adventure', 1962, 8.3),
    ('Schindlers List', 'Biography', 1993, 9.0),
    ('Vertigo', 'Mystery', 1958, 8.3),
    ('The Wizard of Oz', 'Adventure', 1939, 8.1),
    ('City Lights', 'Comedy', 1931, 8.5),
    ('The Searchers', 'Western', 1956, 7.9),
    ('Star Wars: Episode IV - A New Hope', 'Sci-Fi', 1977, 8.6),
    ('Psycho', 'Horror', 1960, 8.5),
    ('2001: A Space Odyssey', 'Sci-Fi', 1968, 8.3),
    ('Sunset Boulevard', 'Drama', 1950, 8.4),
    ('The Graduate', 'Comedy', 1967, 8.0),
    ('The General', 'Comedy', 1926, 8.1),
    ('On the Waterfront', 'Drama', 1954, 8.1),
    ('Its a Wonderful Life', 'Drama', 1946, 8.6),
    ('Chinatown', 'Mystery', 1974, 8.2),
    ('Some Like It Hot', 'Comedy', 1959, 8.2),
    ('The Grapes of Wrath', 'Drama', 1940, 8.0),
    ('E.T. the Extra-Terrestrial', 'Sci-Fi', 1982, 7.9),
    ('To Kill a Mockingbird', 'Drama', 1962, 8.3),
    ('Mr. Smith Goes to Washington', 'Drama', 1939, 8.1),
    ('High Noon', 'Western', 1952, 8.0),
    ('All About Eve', 'Drama', 1950, 8.2),
    ('Double Indemnity', 'Film-Noir', 1944, 8.3),
    ('Apocalypse Now', 'Drama', 1979, 8.4),
    ('The Maltese Falcon', 'Film-Noir', 1941, 8.0),
    ('The Godfather: Part II', 'Crime', 1974, 9.0),
    ('One Flew Over the Cuckoos Nest', 'Drama', 1975, 8.7),
    ('Snow White and the Seven Dwarfs', 'Animation', 1937, 7.6),
    ('Annie Hall', 'Comedy', 1977, 8.0),
    ('The Bridge on the River Kwai', 'Adventure', 1957, 8.1),
    ('The Best Years of Our Lives', 'Drama', 1946, 8.0),
    ('The Treasure of the Sierra Madre', 'Adventure', 1948, 8.2),
    ('Dr. Strangelove', 'Comedy', 1964, 8.4),
    ('The Sound of Music', 'Biography', 1965, 8.1),
    ('King Kong', 'Adventure', 1933, 7.9),
    ('Bonnie and Clyde', 'Biography', 1967, 7.8),
    ('Midnight Cowboy', 'Drama', 1969, 7.8),
    ('The Philadelphia Story', 'Comedy', 1940, 7.9),
    ('Shane', 'Western', 1953, 7.6),
    ('It Happened One Night', 'Comedy', 1934, 8.1),
    ('A Streetcar Named Desire', 'Drama', 1951, 7.9),
    ('Rear Window', 'Mystery', 1954, 8.5),
    ('Intolerance', 'Drama', 1916, 7.7),
    ('The Lord of the Rings: The Fellowship of the Ring', 'Adventure', 2001, 8.8),
    ('West Side Story', 'Crime', 1961, 7.6),
    ('Taxi Driver', 'Crime', 1976, 8.2),
    ('The Deer Hunter', 'Drama', 1978, 8.1),
    ('M*A*S*H', 'Comedy', 1970, 7.4),
    ('North by Northwest', 'Adventure', 1959, 8.3),
    ('Jaws', 'Adventure', 1975, 8.1),
    ('Rocky', 'Drama', 1976, 8.1),
    ('The Gold Rush', 'Adventure', 1925, 8.2),
    ('Nashville', 'Drama', 1975, 7.7),
    ('Duck Soup', 'Comedy', 1933, 7.7),
    ('Sullivans Travels', 'Comedy', 1941, 7.9),
    ('American Graffiti', 'Comedy', 1973, 7.4),
    ('Cabaret', 'Drama', 1972, 7.8),
    ('Network', 'Drama', 1976, 8.1),
    ('The African Queen', 'Adventure', 1951, 7.7),
    ('Raiders of the Lost Ark', 'Action', 1981, 8.4),
    ('Whos Afraid of Virginia Woolf?', 'Drama', 1966, 8.0),
    ('Unforgiven', 'Western', 1992, 8.2),
    ('Tootsie', 'Comedy', 1982, 7.4),
    ('A Clockwork Orange', 'Crime', 1971, 8.3),
    ('Saving Private Ryan', 'Drama', 1998, 8.6),
    ('The Shawshank Redemption', 'Drama', 1994, 9.3),
    ('Butch Cassidy and the Sundance Kid', 'Biography', 1969, 8.0),
    ('The Silence of the Lambs', 'Crime', 1991, 8.6),
    ('In the Heat of the Night', 'Crime', 1967, 7.9),
    ('Forrest Gump', 'Drama', 1994, 8.8),
    ('All the Presidents Men', 'Drama', 1976, 7.9),
    ('Modern Times', 'Comedy', 1936, 8.5),
    ('The Wild Bunch', 'Western', 1969, 7.9),
    ('The Apartment', 'Comedy', 1960, 8.3),
    ('Spartacus', 'Biography', 1960, 7.9),
    ('Sunrise', 'Drama', 1927, 8.2),
    ('Titanic', 'Drama', 1997, 7.9),
    ('Easy Rider', 'Adventure', 1969, 7.3),
    ('A Night at the Opera', 'Comedy', 1935, 7.9),
    ('Platoon', 'Drama', 1986, 8.1),
    ('12 Angry Men', 'Drama', 1957, 9.0),
    ('Bringing Up Baby', 'Comedy', 1938, 7.8),
    ('The Sixth Sense', 'Drama', 1999, 8.2),
    ('Swing Time', 'Comedy', 1936, 7.6),
    ('Sophies Choice', 'Drama', 1982, 7.6),
    ('Goodfellas', 'Biography', 1990, 8.7),
    ('The French Connection', 'Action', 1971, 7.7),
    ('Pulp Fiction', 'Crime', 1994, 8.9),
    ('The Last Picture Show', 'Drama', 1971, 8.0),
    ('Do the Right Thing', 'Comedy', 1989, 8.0),
    ('Blade Runner', 'Sci-Fi', 1982, 8.1),
    ('Yankee Doodle Dandy', 'Biography', 1942, 7.7),
    ('Toy Story', 'Animation', 1995, 8.3),
    ('Ben-Hur', 'Adventure', 1959, 8.1),
    ('The Jazz Singer', 'Drama', 1927, 6.5),
    ('My Fair Lady', 'Drama', 1964, 7.8),
    ('A Place in the Sun', 'Drama', 1951, 7.8),
    ('The Apartment', 'Comedy', 1960, 8.3),
    ('Goodfellas', 'Biography', 1990, 8.7),
    ('Pulp Fiction', 'Crime', 1994, 8.9),
    ('The Searchers', 'Western', 1956, 7.9),
    ('Bringing Up Baby', 'Comedy', 1938, 7.8),
    ('Unforgiven', 'Western', 1992, 8.2),
    ('Guess Whos Coming to Dinner', 'Comedy', 1967, 7.8),
    ('Yankee Doodle Dandy', 'Biography', 1942, 7.7)

      `);
      
      console.log('Added sample film data');
    }
    
    conn.release();
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Service implementation
const getRecommendations = async (call, callback) => {
  try {
    const { user_id, genres } = call.request;
    
    let query = 'SELECT * FROM films';
    let params = [];
    
    // Filter by genres if provided
    if (genres && genres.length > 0) {
      query += ' WHERE genre IN (?)';
      params.push(genres);
    }
    
    // Order by rating
    query += ' ORDER BY rating DESC LIMIT 10';
    
    // Execute query
    const [rows] = await pool.query(query, params);
    
    // Map to response format
    const films = rows.map(film => ({
      id: film.id.toString(),
      title: film.title,
      genre: film.genre,
      release_year: film.release_year,
      rating: film.rating
    }));
    
    // Return response
    callback(null, { films });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Internal server error'
    });
  }
};

// Start gRPC server
function startServer() {
  const server = new grpc.Server();
  
  server.addService(recommendationProto.RecommendationService.service, {
    getRecommendations
  });
  
  server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Failed to bind server:', error);
      return;
    }
    
    console.log(`Recommendation service running on port ${port}`);
    server.start();
  });
}

// Initialize database then start server
initializeDatabase().then(() => {
  startServer();
});
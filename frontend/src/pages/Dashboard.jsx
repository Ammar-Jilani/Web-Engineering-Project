import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({
        title: "",
        description: "",
        actors: [],
        director: "",
        writer: "",
        genre: "",
        releaseDate: "",
    });
    const [userRole, setUserRole] = useState("");
    const [reviewData, setReviewData] = useState({ movieId: "", rating: "", review: "" });
    const [reviewVisible, setReviewVisible] = useState({});
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);

        const fetchMoviesAndWatchlist = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                } else {
                    const movieResponse = await axios.get("http://localhost:3000/api/movies", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setMovies(movieResponse.data);

                    const watchlistResponse = await axios.get("http://localhost:3000/api/movies/watchlist", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setWatchlist(watchlistResponse.data);
                }
            } catch (err) {
                setError("Failed to load data.");
            }
        };

        fetchMoviesAndWatchlist();
    }, [navigate]);

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/movies", newMovie, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovies([...movies, response.data]);
            setNewMovie({ title: "", description: "", actors: [], director: "", writer: "", genre: "", releaseDate: "" });
        } catch (err) {
            setError("Failed to add movie.");
        }
    };

    const handleDeleteMovie = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/movies/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovies(movies.filter((movie) => movie._id !== id));
        } catch (err) {
            setError("Failed to delete movie.");
        }
    };

    const handleReviewToggle = (movieId) => {
        setReviewVisible((prev) => ({
            ...prev,
            [movieId]: !prev[movieId],
        }));
        setReviewData({ movieId, rating: "", review: "" });
    };

    const handleReviewMovie = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://localhost:3000/api/movies/reviews`,
                { movieId: reviewData.movieId, review: reviewData.review, rating: reviewData.rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Review added successfully!");
            setReviewData({ movieId: "", rating: "", review: "" });
            setReviewVisible({});
        } catch (err) {
            setError("Failed to review movie.");
        }
    };

    const handleWatchlistToggle = async (movieId) => {
        try {
            const token = localStorage.getItem("token");
            const isInWatchlist = watchlist.includes(movieId);

            if (isInWatchlist) {
                await axios.put(
                    `http://localhost:3000/api/movies/watchlist`,
                    { movieId, action: "remove" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setWatchlist(watchlist.filter((id) => id !== movieId));
            } else {
                await axios.put(
                    `http://localhost:3000/api/movies/watchlist`,
                    { movieId, action: "add" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setWatchlist([...watchlist, movieId]);
            }
        } catch (err) {
            setError("Failed to update watchlist.");
        }
    };

    const handleActorChange = (e) => {
        const value = e.target.value;
        setNewMovie((prevState) => ({
            ...prevState,
            actors: value ? value.split(",").map((actor) => actor.trim()) : [],
        }));
    };

    const renderAdminDashboard = () => (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <h3>Movies</h3>
            <table className="movie-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actors</th>
                        <th>Director</th>
                        <th>Writer</th>
                        <th>Genre</th>
                        <th>Release Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.description}</td>
                            <td>{movie.actors.join(", ")}</td>
                            <td>{movie.director}</td>
                            <td>{movie.writer}</td>
                            <td>{movie.genre}</td>
                            <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Add Movie</h3>
            <form onSubmit={handleAddMovie} className="add-movie-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Actors (comma-separated)"
                    value={newMovie.actors.join(", ")}
                    onChange={handleActorChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Director"
                    value={newMovie.director}
                    onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Writer"
                    value={newMovie.writer}
                    onChange={(e) => setNewMovie({ ...newMovie, writer: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Genre"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={newMovie.releaseDate}
                    onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                    required
                />
                <button type="submit" className="auth-button">Add Movie</button>
            </form>
        </div>
    );

    const renderUserDashboard = () => (
        <div className="dashboard-container">
            <h2>User Dashboard</h2>
            <table className="movie-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actors</th>
                        <th>Director</th>
                        <th>Writer</th>
                        <th>Genre</th>
                        <th>Release Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.description}</td>
                            <td>{movie.actors.join(", ")}</td>
                            <td>{movie.director}</td>
                            <td>{movie.writer}</td>
                            <td>{movie.genre}</td>
                            <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                            <td>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <button onClick={() => handleWatchlistToggle(movie._id)}>
                                        {watchlist.includes(movie._id) ? "Remove from Watchlist" : "Add to Watchlist"}
                                    </button>
                                    <button onClick={() => handleReviewToggle(movie._id)}>
                                        {reviewVisible[movie._id] ? "Cancel Review" : "Write Review"}
                                    </button>
                                    {reviewVisible[movie._id] && (
                                        <form onSubmit={handleReviewMovie} style={{ marginTop: "10px" }}>
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                placeholder="Rating"
                                                value={reviewData.rating}
                                                onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                                                required
                                            />
                                            <textarea
                                                placeholder="Write your review"
                                                value={reviewData.review}
                                                onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                                                required
                                            ></textarea>
                                            <button type="submit">Submit Review</button>
                                        </form>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            {error && <p className="error">{error}</p>}
            {userRole === "admin" ? renderAdminDashboard() : renderUserDashboard()}
        </div>
    );
};

export default Dashboard;

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

import './App.module.css';

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            toast.error('Please enter your search query.');
            return;
        }

        try {
            setMovies([]);
            setError(null);
            setIsLoading(true);

            const results = await fetchMovies(query);

            if (results.length === 0) {
                toast.error('No movies found for your request.');
            } else {
                setMovies(results);
            }
        } catch (err) {
            setError('There was an error fetching movies.');
            toast.error('There was an error, please try again...');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleModalClose = () => {
        setSelectedMovie(null);
    };

    return (
        <div>
            <Toaster position="top-right" />

            <SearchBar onSubmit={handleSearch} />

            {isLoading && <Loader />}
            {error && <ErrorMessage />}

            {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleMovieSelect} />}

            {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleModalClose} />}
        </div>
    );
}

export default App;

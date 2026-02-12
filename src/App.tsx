import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import type { Movie } from './types/movie';
import { fetchMovies } from './services/movieService';

import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import SearchBar from './components/SearchBar/SearchBar';
import MovieGrid from './components/MovieGrid/MovieGrid';
import MovieModal from './components/MovieModal/MovieModal'; // <-- Додано імпорт MovieModal

import './App.module.css';

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // <-- Додано новий стан

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            toast.error('Please enter your search query.');
            return;
        }

        try {
            setMovies([]); // Очищаємо попередні результати
            setError(null);
            setIsLoading(true); // Починаємо завантаження

            const results = await fetchMovies(query);

            if (results.length === 0) {
                toast.error('No movies found for your request.');
            } else {
                setMovies(results);
            }
        } catch (err) {
            setError('There was an error fetching movies.'); // Встановлюємо помилку
            toast.error('There was an error, please try again...');
        } finally {
            setIsLoading(false); // Завершуємо завантаження
        }
    };

    // Функція для вибору фільму (відкриття модалки)
    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    // Функція для закриття модалки
    const handleModalClose = () => {
        setSelectedMovie(null);
    };

    return (
        <div>
            {/* Toaster для відображення сповіщень */}
            <Toaster position="top-right" />

            <SearchBar onSubmit={handleSearch} />

            {isLoading && <Loader />}
            {error && <ErrorMessage />}

            {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleMovieSelect} />} {/* <-- Передаємо handleMovieSelect */}

            {/* Умовний рендеринг MovieModal */}
            {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleModalClose} />} {/* <-- Додано MovieModal */}
        </div>
    );
}

export default App;
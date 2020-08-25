import React from 'react'
import styles from './favs.module.css'
import Card from '../card/Card'
import { connect } from 'react-redux'

function FavPage({ movies = [0] }) {

    function renderMovie(film, i) {
        return (
            <Card hide {...film} key={i} />
        )
    }
    return (
        <div className={styles.container}>
            <h2>Favoritos</h2>
            {movies.map(renderMovie)}
            {!movies.length && <h3>No hay personajes agregados</h3>}
        </div>
    )
}

function mapStateToProps({movies}){
    return {
        movies: movies.favorites
    }
}

export default connect(mapStateToProps) (FavPage)
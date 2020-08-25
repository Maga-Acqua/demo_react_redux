import React, { useState, useEffect } from 'react'
import Card from '../card/Card'
import styles from './home.module.css'
import { connect } from 'react-redux'
import { removeMoviesAction, addToFavoritesAction } from '../../redux/moviesDuck'

//Home toma como parametros Props, inyectados a traves de connect()
 function Home({films, removeMoviesAction, addToFavoritesAction}) {


    function renderMovie() {
        let film = films[0]
        return (
            <Card 
                rightClick= {addFav}
                leftClick= {nextMovie} 
                {...film} />
        )
    }

    //Posibilita otras acciones como la inclusion de animaciones o notificaciones
    function nextMovie(){
        removeMoviesAction();
    }

    function addFav(){
        addToFavoritesAction();
    }

    return (
        <div className={styles.container}>
            <h2>Movies</h2>
            <div>
                {renderMovie()}
            </div>
        </div>
    )
}
function mapStateToProps(state) {
    return {
        films: state.movies.array
    }
}
//connect () recibe acciones a tratar como Props

export default connect(mapStateToProps, {removeMoviesAction, addToFavoritesAction})(Home)
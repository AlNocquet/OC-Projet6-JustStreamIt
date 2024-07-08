# Just_Stream_It

Cette page HTML affiche des données de films provenant d'une API, triés par catégories et par meilleurs imbd.


## Technologie :

HTML, CSS, JavaScript

## Author :

Alice Nocquet


## Installation de l'API

Information sur l'API consultablie ici : https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR

Étapes à effectuer une seule fois :

```bash
$ git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
$ cd OCMovies-API-EN-FR
$ python3 -m venv env (Sous Windows => python -m venv env)
$ source env/bin/activate (Sous Windows => env\Scripts\activate)
$ pip install -r requirements.txt
$ python manage.py create_db
```

## Lancement de l'API

A effectuer à chaque utilisation : 

```bash
$ source env/bin/activate (Sous Windows => env\Scripts\activate)
$ python manage.py runserver
```


## Installation des fichiers HTML, CSS, JavaScript :

```bash
$ git clone 
```

## UTILISATION :

L’interface du site est responsive et est donc utilisable sur tous supports : ordinateur, tablette, mobile.

Cliquez sur le fichier JustStreamIt.html pour l'ouvrir avec votre navigateur.

Le site est organisé en 5 sections, avec accès aux détails d'une catégorie ou d'un film en les sélectionnant : 

 - En tête d'affiche, le film le mieux noté, toutes catégories confondues avec résumé;
 - Les 6 films les mieux notés toutes catégories confondues ;
 - Les 6 films les mieux notés des catégories suivantes : Fantastique, SCI-FI ;
 - Les 6 films les mieux notés selon la catégories de votre choix.

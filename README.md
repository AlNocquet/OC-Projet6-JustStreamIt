# Just_Stream_It

This HTML page displays movie data retrieved from an API, sorted by highest IMDb score and by category, with the option to choose the category.


## Technology

HTML, CSS, JavaScript


## Author

Alice Nocquet


## API Installation

API information available here: https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR

Steps to perform **once**:

```bash
$ git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
$ cd OCMovies-API-EN-FR
$ python3 -m venv env              # On Windows: python -m venv env
$ source env/bin/activate          # On Windows: env\Scripts\activate
$ pip install -r requirements.txt
$ python manage.py create_db
```


## API Launch

Steps to perform **each time** you use the project:

```bash
$ source env/bin/activate          # On Windows: env\Scripts\activate
$ python manage.py runserver
```


## HTML, CSS, JavaScript Files Setup

```bash
$ git clone https://github.com/AlNocquet/OC-Projet6-JustStreamIt.git
```


## USAGE

The site interface is fully responsive and usable on all devices: desktop, tablet, and mobile.

To launch the app, open the `JustStreamIt.html` file with your web browser.

The homepage is divided into 4 sections, each offering access to detailed movie information:

- A featured movie: the highest-rated film across all categories, including its description  
- The top 6 highest-rated movies overall  
- The top 6 highest-rated movies in the **Fantasy** and **Sci-Fi** categories  
- The top 6 highest-rated movies in a **category of your choice**

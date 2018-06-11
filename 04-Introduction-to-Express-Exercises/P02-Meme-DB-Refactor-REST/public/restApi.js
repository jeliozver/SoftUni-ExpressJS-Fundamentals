$(() => {
    const BASE_URL = 'http://localhost:8000/api/';
    const GENRE_ENTITY = 'genre';
    const MEME_ENTITY = 'meme';
    const HEADER = {};
    const RESULTS = {};
    const GENRES_BTN = $('#genres-btn');
    const MEMES_BTN = $('#memes-btn');
    const QUERY_BTN = $('#query-btn');
    const DDOS_BTN = $('#ddos');

    $('.ddos').css('display', 'none');
    MEMES_BTN.prop('disabled', true);
    QUERY_BTN.prop('disabled', true);

    GENRES_BTN.on('click', () => {
        console.log('Seeding genres...');
        seedGenres().then(() => {
            console.log('Genres seeded!');
            console.log('Getting all genres..');
            getAllGenres().then(() => {
                console.log('Genres are here!');
                console.log('Getting first created genre only..');
                getSingleGenre().then(() => {
                    console.log('First created genre is here!');
                    console.log('Updating second genre....');
                    updateGenre().then(() => {
                        console.log('Updated second genre successfully!');
                        console.log('Deleting third genre...');
                        deleteGenre().then(() => {
                            console.log('Deleted third genre successfully!');
                            console.log('Getting all genres after all actions...');
                            getAllGenres().then(() => {
                                console.log('All genres after actions are here!');
                                console.log(RESULTS);
                                MEMES_BTN.prop('disabled', false);
                                GENRES_BTN.prop('disabled', true);
                            });
                        }).catch((err) => {
                            console.log(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    });

    MEMES_BTN.on('click', () => {
        console.log('Seeding memes...');
        seedMemes().then(() => {
            console.log('Memes seeded!');
            console.log('Getting all memes..');
            getAllMemes().then(() => {
                console.log('Memes are here!');
                console.log('Getting first created meme only..');
                getSingleMeme().then(() => {
                    console.log('First created meme is here!');
                    console.log('Updating second meme....');
                    updateMemeAndGenre().then(() => {
                        console.log('Updated second meme successfully!');
                        console.log('Deleting third meme...');
                        deleteMeme().then(() => {
                            console.log('Deleted third meme successfully!');
                            console.log('Getting all memes after all actions...');
                            getAllMemes().then(() => {
                                console.log('All memes after actions are here!');
                                console.log('And finally here are the results after all actions!');
                                console.log(RESULTS);
                                MEMES_BTN.prop('disabled', true);
                                QUERY_BTN.prop('disabled', false);
                            });
                        }).catch((err) => {
                            console.log(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    });

    QUERY_BTN.on('click', () => {
        let query = '?query={"privacy":"off"}&sort={"dateStamp":-1}';
        let queryTwo = '?query={"privacy":"off","votes":{"$gte":10}}';
        request('GET', `${BASE_URL}${MEME_ENTITY}${query}`, HEADER, {}).then((res) => {
            console.log(JSON.parse(res));
        }).catch((err) => {
            console.log(err);
        });

        request('GET', `${BASE_URL}${MEME_ENTITY}${queryTwo}`, HEADER, {}).then((res) => {
            console.log(JSON.parse(res));
        }).catch((err) => {
            console.log(err);
        });
    });

    async function seedGenres() {
        await request('POST', `${BASE_URL}${GENRE_ENTITY}`, HEADER, { 'genreName': '4chan' }).then((res) => {
            console.log(res);
            RESULTS['firstGenre'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });

        await request('POST', `${BASE_URL}${GENRE_ENTITY}`, HEADER, { 'genreName': 'doge' }).then((res) => {
            console.log(res);
            RESULTS['secondGenre'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });

        await request('POST', `${BASE_URL}${GENRE_ENTITY}`, HEADER, { 'genreName': 'character' }).then((res) => {
            console.log(res);
            RESULTS['thirdGenre'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getAllGenres() {
        await request('GET', `${BASE_URL}${GENRE_ENTITY}`, HEADER, {}).then((res) => {
            console.log(res);
            RESULTS['allGenres'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getSingleGenre() {
        await request('GET', `${BASE_URL}${GENRE_ENTITY}/${RESULTS.firstGenre._id}`, HEADER, {}).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function updateGenre() {
        await request('PUT', `${BASE_URL}${GENRE_ENTITY}/${RESULTS.secondGenre._id}`, HEADER, { 'genreName': 'noMoreDoge' })
            .then((res) => {
                console.log(res);
                RESULTS['secondGenreUpdated'] = JSON.parse(res);
            }).catch((err) => {
                console.log(err);
            });
    }

    async function deleteGenre() {
        await request('DELETE', `${BASE_URL}${GENRE_ENTITY}/${RESULTS.thirdGenre._id}`, HEADER, {})
            .then((res) => {
                console.log(res);
                RESULTS['thirdGenreDeleted'] = JSON.parse(res);
            }).catch((err) => {
                console.log(err);
            });
    }

    async function seedMemes() {
        await request('POST', `${BASE_URL}${MEME_ENTITY}`, HEADER, {
            'memeName': 'Trollface',
            'description': 'Trollface is a rage comic character wearing a mischievous smile',
            'memeSrc': 'http://i0.kym-cdn.com/photos/images/newsfeed/000/096/044/trollface.jpg',
            'privacy': 'off',
            'genre': `${RESULTS.firstGenre._id}`
        }).then((res) => {
            console.log(res);
            RESULTS['firstMeme'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });

        await request('POST', `${BASE_URL}${MEME_ENTITY}`, HEADER, {
            'memeName': 'Doge',
            'description': 'Doge is a slang term for "dog" that is primarily associated with pictures of Shiba Inus',
            'memeSrc': 'http://i0.kym-cdn.com/entries/icons/original/000/013/564/doge.jpg',
            'privacy': 'off',
            'genre': `${RESULTS.secondGenre._id}`
        }).then((res) => {
            console.log(res);
            RESULTS['secondMeme'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });

        await request('POST', `${BASE_URL}${MEME_ENTITY}`, HEADER, {
            'memeName': 'Forever Alone',
            'description': 'Forever Alone is rage comic character that is used to express loneliness and disappointment with life',
            'memeSrc': 'http://i0.kym-cdn.com/entries/icons/mobile/000/003/619/ForeverAlone.jpg',
            'privacy': 'off',
            'genre': `${RESULTS.firstGenre._id}`
        }).then((res) => {
            console.log(res);
            RESULTS['thirdMeme'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getAllMemes() {
        await request('GET', `${BASE_URL}${MEME_ENTITY}`, HEADER, {}).then((res) => {
            console.log(res);
            RESULTS['allMemes'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getSingleMeme() {
        await request('GET', `${BASE_URL}${MEME_ENTITY}/${RESULTS.firstMeme._id}`, HEADER, {}).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function updateMemeAndGenre() {
        await request('PUT', `${BASE_URL}${MEME_ENTITY}/${RESULTS.secondMeme._id}`, HEADER, {
            'memeName': 'Doge-Updated',
            'description': 'Doge changed Genre',
            'memeSrc': 'http://i0.kym-cdn.com/entries/icons/original/000/013/564/doge.jpg',
            'privacy': 'off',
            'genre': `${RESULTS.firstGenre._id}`
        }).then((res) => {
            console.log(res);
            RESULTS['secondMemeUpdated'] = JSON.parse(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function deleteMeme() {
        await request('DELETE', `${BASE_URL}${MEME_ENTITY}/${RESULTS.thirdMeme._id}`, HEADER, {})
            .then((res) => {
                console.log(res);
                RESULTS['thirdMemeDeleted'] = JSON.parse(res);
            }).catch((err) => {
                console.log(err);
            });
    }

    DDOS_BTN.on('click', () => {
        let id = '';
        MEMES_BTN.prop('disabled', true);
        GENRES_BTN.prop('disabled', true);
        DDOS_BTN.prop('disabled', true);

        async function ddosInit() {
            await request('POST', `${BASE_URL}${GENRE_ENTITY}`, HEADER, { 'genreName': 'first' }).then((res) => {
                let result = JSON.parse(res);
                id = result._id;
            }).catch((err) => {
                console.log(err);
            });
        }

        async function ddosGenres() {
            for (let index = 0; index < 100000; index++) {
                await request('POST', `${BASE_URL}${GENRE_ENTITY}`, HEADER, { 'genreName': `genre${index}` }).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }

        async function ddosMemes() {
            for (let index = 0; index < 100000; index++) {
                await request('POST', `${BASE_URL}${MEME_ENTITY}`, HEADER, {
                    'memeName': `meme${index}`,
                    'description': `desc${index}`,
                    'memeSrc': `img${index}`,
                    'privacy': 'off',
                    'genre': id
                }).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }

        ddosInit().then(() => {
            ddosGenres();
            ddosMemes();
        });
    });

    function request(method, endpoint, headers, body) {
        return $.ajax({
            method: method,
            url: endpoint,
            headers: headers,
            contentType: 'application/json',
            data: JSON.stringify(body)
        });
    }
});
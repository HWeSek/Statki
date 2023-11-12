const Field_size = 10;
const computer_ships_display = true;
/////////////////////////////////////GRACZ///////////////////////////////////////////////////////
const _1x4 = {
    ilosc: 1,
    dlugosc: 4
}
const _2x3 = {
    ilosc: 2,
    dlugosc: 3
}
const _3x2 = {
    ilosc: 3,
    dlugosc: 2
}
const _4x1 = {
    ilosc: 4,
    dlugosc: 1
}

let game = {
    selected_ship: 4,
    pozycja_pionowa: true,
    warship_list: [_1x4, _2x3, _3x2, _4x1],
    plansza: [],

    drawTable: function () {
        for (let i = 0; i < Field_size; i++) {
            for (let j = 0; j < Field_size; j++) {
                let field = document.createElement('div');
                field.classList.add('field')
                field.setAttribute('id', `${i * 10 + j}`)
                field.addEventListener('mouseover', this.placeShipSprite)
                field.addEventListener("contextmenu", function (e) { e.preventDefault(); game.pozycja_pionowa = game.pozycja_pionowa == true ? false : true });
                field.addEventListener("contextmenu", this.placeShipSprite);
                document.getElementById('plansza').append(field);
            }
        }
    },
    drawPlayerMenu: function () {
        document.getElementById('menu').innerHTML = "";
        for (warship of this.warship_list) {
            for (let i = 0; i < warship.ilosc; i++) {
                statek = document.createElement('div');
                statek.classList.add('menu-ship');
                statek.setAttribute('id', `${warship.dlugosc}x${i + 1}`)
                for (let j = 0; j < warship.dlugosc; j++) {
                    let field = document.createElement('div');
                    field.classList.add('field_menu')
                    statek.append(field);
                }
                document.getElementById('menu').append(statek);
            }
        }
    },
    shipSelection: function () {
        for (warship of this.warship_list) {
            for (let i = 0; i < warship.ilosc; i++) {
                let dlugosc = warship.dlugosc;
                let el = document.getElementById(`${dlugosc}x${i + 1}`)
                el.addEventListener('click', function () {
                    for (element of document.querySelectorAll('.menu-ship')) {
                        element.style.backgroundColor = '';
                    }
                    el.style.backgroundColor = 'blue';

                    game.selected_ship = dlugosc;
                })
            }
        }
    },
    init: function () {
        for (let i = 0; i < Field_size + 2; i++) {
            game.plansza.push([]);
            for (let j = 0; j < Field_size + 2; j++) {
                game.plansza[i].push(0);
            }
        }
        document.getElementById('game_start').style.display = 'none';
        this.drawPlayerMenu();
        this.drawTable();
        this.shipSelection();
    },
    randomPositon: function (min, max) {
        return [Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min]
    },
    collisionCheck: function (start_position, ship_lenght, orientation) {
        let return_value = true;
        //console.log(start_position,orientation);
        for (let i = -1; i < ship_lenght + 1; i++) {
            //console.log(i);
            for (n of [-1, 0, 1]) {
                if (orientation) {
                    if (this.plansza[start_position[1] + i][start_position[0] + n] != 0) return_value = false;
                    //console.log([start_position[0]+n,start_position[1]+i]);
                } else {
                    if (this.plansza[start_position[1] + n][start_position[0] + i] != 0) return_value = false;
                    //console.log([start_position[0]+i,start_position[1]+n]);
                }
            }
        }
        return return_value;
    },
    placeShipSprite: function () {
        let type = game.selected_ship;
        let orientation = game.pozycja_pionowa;
        let id = this.id;
        let pozycja = [(id - Math.floor(id / 10) * 10) + 1, Math.floor(id / 10) + 1]
        //console.log(game.selected_ship);
        //Czyszczenie planszy, rysowanie statku, usuwanie EventListenerów
        for (let i = 1; i <= Field_size; i++) {
            for (let j = 1; j <= Field_size; j++) {
                let element = document.getElementById((j - 1) + (i - 1) * 10)
                element.removeEventListener('click', game.placeShip)
                if (game.plansza[i][j] == 0) {
                    element.style.backgroundColor = "";
                } else {
                    element.style.backgroundColor = "yellow";
                }
            }
        }
        document.getElementById(id).addEventListener('click', game.placeShip)
        //Ochrona przed zawijaniem sie statku
        if (orientation) {
            if (pozycja[1] > Field_size + 1 - type) pozycja[1] = Field_size - type + 1;
        } else {
            if (pozycja[0] > Field_size + 1 - type) pozycja[0] = Field_size - type + 1;
        }
        //Sprawdzenie czy statek może zostać postawiony
        let color = game.collisionCheck(pozycja, type, orientation) == true ? 'green' : 'red';
        //Rysowanie ducha statku
        for (let n = 0; n < type; n++) {
            if (orientation) {
                document.getElementById((pozycja[0] - 1) + ((pozycja[1] - 1 + n) * 10)).style.backgroundColor = color;
            } else {
                document.getElementById((pozycja[0] - 1 + n) + ((pozycja[1] - 1) * 10)).style.backgroundColor = color;
            }
        }
    },

    placeShip: function () {
        let type = game.selected_ship;
        let orientation = game.pozycja_pionowa;
        let id = this.id;
        let pozycja = [(id - Math.floor(id / 10) * 10) + 1, Math.floor(id / 10) + 1]
        //Ochrona przed zawijaniem sie statku.
        if (orientation) {
            if (pozycja[1] > Field_size + 1 - type) pozycja[1] = Field_size - type + 1;
        } else {
            if (pozycja[0] > Field_size + 1 - type) pozycja[0] = Field_size - type + 1;
        }
        //Zatwierdzenie miejsca na planszy
        if (game.collisionCheck(pozycja, type, orientation)) {
            for (let n = 0; n < type; n++) {
                if (orientation) {
                    game.plansza[(pozycja[1] + n)][(pozycja[0])] = 1;
                    document.getElementById((pozycja[0] - 1) + ((pozycja[1] - 1 + n) * 10)).style.backgroundColor = "yellow";
                } else {
                    game.plansza[(pozycja[1])][(pozycja[0] + n)] = 1;
                    document.getElementById((pozycja[0] - 1 + n) + ((pozycja[1] - 1) * 10)).style.backgroundColor = "yellow";
                }
            }
            for (warship of game.warship_list) {
                if (warship.dlugosc == type) warship.ilosc -= 1;
            }
            game.preGameLoop();
            game.selected_ship = undefined;
            // console.log(type,orientation,id,pozycja);
            // console.log('Statek postawion');
        }
        document.getElementById(id).removeEventListener('click', game.placeShip)

    },
    preGameLoop: function () {
        this.drawPlayerMenu();
        this.shipSelection();
        let remaining_ships = 0;
        for (warship of this.warship_list) {
            remaining_ships += warship.ilosc;
        }
        if (remaining_ships == 0) {
            for (let i = 0; i < Field_size; i++) {
                for (let j = 0; j < Field_size; j++) {
                    document.getElementById(i * 10 + j).removeEventListener('mouseover', game.placeShipSprite)
                }
            }

            document.getElementById('game_start').style.display = 'block'
        };
    }
}
///////////////////////////////////////KOMPUTER/////////////////////////////////////////////////////////////
const cmp_1x4 = {
    ilosc: 1,
    dlugosc: 4
}
const cmp_2x3 = {
    ilosc: 2,
    dlugosc: 3
}
const cmp_3x2 = {
    ilosc: 3,
    dlugosc: 2
}
const cmp_4x1 = {
    ilosc: 4,
    dlugosc: 1
}

let game_cmp = {
    warship_list: [cmp_1x4, cmp_2x3, cmp_3x2, cmp_4x1],
    plansza: [],
    drawTable: function () {
        for (let i = 0; i < Field_size; i++) {
            for (let j = 0; j < Field_size; j++) {
                let field = document.createElement('div');
                field.classList.add('field')
                field.setAttribute('id', `${i * 10 + j}_cmp`)
                document.getElementById('plansza-cmp').append(field);
            }
        }
    },
    randomPositon: function (min, max) {
        return [Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min]
    },
    collisionCheck: function (start_position, ship_lenght, orientation) {
        let return_value = true;
        //console.log(start_position,orientation);
        for (let i = -1; i < ship_lenght + 1; i++) {
            //console.log(i);
            for (n of [-1, 0, 1]) {
                if (orientation) {
                    if (this.plansza[start_position[1] + i][start_position[0] + n] != 0) return_value = false;
                    //console.log([start_position[0]+n,start_position[1]+i]);
                } else {
                    if (this.plansza[start_position[1] + n][start_position[0] + i] != 0) return_value = false;
                    //console.log([start_position[0]+i,start_position[1]+n]);
                }
            }
        }
        return return_value;
    },
    placeShips: function () {
        for (warship_type of this.warship_list) {

            for (let i = 0; i < warship_type.ilosc; i++) {
                ////Ustalanie pozycji statków
                let pozycja_ustalona = false;
                let pozycje = [];
                while (pozycja_ustalona == false) {
                    pozycje = [];
                    let pozycja_pionowa = Math.random() < 0.5 ? true : false;
                    //pozycja = [x,y]
                    for (let j = 0; j < warship_type.dlugosc; j++) {
                        pozycja_ustalona = true;
                        if (j == 0) {
                            pozycje[0] = this.randomPositon(1, Field_size + 1 - warship_type.dlugosc);
                            if (this.plansza[pozycje[0][0]][pozycje[0][1]] != 0) pozycja_ustalona = false;
                        }
                        else {
                            if (pozycja_pionowa) {
                                pozycje[j] = [pozycje[j - 1][0], pozycje[j - 1][1] + 1];
                            }
                            else if (pozycja_pionowa == false) {
                                pozycje[j] = [pozycje[j - 1][0] + 1, pozycje[j - 1][1]];
                            }
                        }
                    }
                    pozycja_ustalona = this.collisionCheck(pozycje[0], warship_type.dlugosc, pozycja_pionowa)
                    ///// Rysowanie statków
                    if (pozycja_ustalona) {
                        for (pozycja of pozycje) {
                            this.plansza[pozycja[1]][pozycja[0]] = 1;
                            if (computer_ships_display) document.getElementById((pozycja[0] - 1) + ((pozycja[1] - 1) * 10) + "_cmp").style.backgroundColor = 'pink';
                        }
                    };
                }
            }
        }
    }
}



/////////////////////////////////////////////////ROZGRYWKA///////////////////////////////////////////////////////////////////////////       
let game_loop = {
    player_ships_remaining: 20,
    cpm_ships_remaining: 20,
    hit_positions: [],
    loop: function () {
        document.getElementById('game_start').style.display = 'none';
        //Dodawanie listenerów do wszystkich pól
        for (let i = 0; i < Field_size; i++) {
            for (let j = 0; j < Field_size; j++) {
                document.getElementById(i * 10 + j + "_cmp").addEventListener('click', game_loop.player_turn)
            }
        }
        //Usuwanie listenerów klikniętym polom
        for (position of game_loop.hit_positions) {
            document.getElementById((position[0] - 1) + ((position[1] - 1) * 10)).removeEventListener('click', game_loop.player_turn)
        }
        //Sprawdzenie warunku wygranej 
        //Warunek wygranej cpm: player_ships_remaining = 0;
        //Warunek wygranej player: cmp_ships_remaining = 0;
        //potem -> Wyłącz wszystkie event listenery -> Wyświetl ekran wygranej
        if (this.player_ships_remaining == 0 || this.cpm_ships_remaining == 0) {
            console.log('wygrana');
            for (let i = 0; i < Field_size; i++) {
                for (let j = 0; j < Field_size; j++) {
                    document.getElementById(i * 10 + j + "_cmp").addEventListener('click', game_loop.player_turn)
                }
            }
        }
    },
    player_turn: function () {
        //Kliknięcie pola i sprawdzenie trafienia przez gracza
        let id = this.id;
        id = id.split('_')[0]
        //console.log(id);
        let pozycja = [(id - Math.floor(id / 10) * 10) + 1, Math.floor(id / 10) + 1]
        let plansza_cmp = game_cmp.plansza;
        let img = document.createElement('img');
        img.setAttribute('width', '49')
        for (let i = 0; i < Field_size; i++) {
            for (let j = 0; j < Field_size; j++) {
                document.getElementById(i * 10 + j + "_cmp").removeEventListener('click', game_loop.player_turn)
            }
        }
        game_loop.hit_positions.push(pozycja);
        if (plansza_cmp[pozycja[1]][pozycja[0]]) {
            img.setAttribute('src', './imgs/Transparent_X.png')
            game_loop.cpm_ships_remaining -= 1;
            game_loop.loop();
        }
        else {
            img.setAttribute('src', './imgs/splash.png')
            game_loop.cmp_turn();
        }
        document.getElementById(id + "_cmp").append(img);
    },
    randomPositon: function (min, max) {
        return [Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min]
    },
    cmp_turn: function () {
        //Wybranie pola i sprawdzenie trafienia przez bota;
        let plansza = game.plansza;
        let pozycja = this.randomPositon(1, Field_size)
        let img = document.createElement('img');
        img.setAttribute('width', '49')
        setTimeout(() => {
            if (plansza[pozycja[1]][pozycja[0]]) {
                img.setAttribute('src', './imgs/Transparent_X.png')
                this.player_ships_remaining -= 1;
                game_loop.cmp_turn();
            }
            else {
                img.setAttribute('src', './imgs/splash.png')
                game_loop.loop();
            }
            document.getElementById((pozycja[0] - 1) + ((pozycja[1] - 1) * 10)).append(img);
        }, 1000)
    }

}


document.addEventListener("DOMContentLoaded", (e) => {
    for (let i = 0; i < Field_size + 2; i++) {
        game_cmp.plansza.push([]);
        for (let j = 0; j < Field_size + 2; j++) {
            game_cmp.plansza[i].push(0);
        }
    }
    game_cmp.drawTable();
    game_cmp.placeShips();
    game.init();
    game.preGameLoop();
    document.getElementById('game_start').addEventListener('click', game_loop.loop)
    document.getElementById('4x1').style.backgroundColor = 'blue';
});
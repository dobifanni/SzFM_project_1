# Követelmény specifikáció

## Jelenlegi helyzet
A filmekkel kapcsolatos kakukktojás-keresés jelenleg leginkább egyszerű listák vagy felsorolások formájában történik, ahol különböző műfajokat vagy kategóriákat állítanak egymás mellé. A feladat lényege annak felismerése, hogy a felsorolt elemek közül melyik tér el a többitől, ám a megvalósítás jelenleg inkább alapvető és manuális módszereken alapul.

## Jelenlegi üzleti folyamatok modellje
![Jelenlegi üzleti folyamatok modellje](./assets/jelenlegi_uzleti_folyamat_abra.png)

## Követelménylista
| Modul | ID | Név | Verzió | Kifejtés |
|:------|:---|:----|:-------|:---------|
| Felület | K1 | Kezdőoldal kialakítása | 0.1 | A játék kezdőoldala a kiválasztható témákkal |
| Játékfelület | K2 | Játék oldalának kialakítása | 0.1 | A téma kiválasztása után a játékra irányított felület kialakítása |
| Játék mechanika | K3 | Dobozok generálása, kakukktojás | 0.1 | Véletlenszerű dobozok generálása a téma szerint, és a kakukktojás kiválaszthatósága |
| Játékfelület | K4 | Pontozási rendszer megjelenítése | 0.2 | Pontozás, felületen megjelenítve a felhasználónak |
| Játékfelület | K5 | Időzítő hozzáadása | 0.2 | A játékos játék idejének követése |
| Játék mechanika | K6 | Pontozás és időzítő hozzáadása a játék mechanikához | 0.2 | A pontok követésének és az idő mérésének implementálása a játékba |
| Felület | K7 | Reszponzív dizájn | 0.4 | A weboldal felülete különféle eszközökhöz igazodjon |
| Felhasználó kezelés | K8 | Felhasználó regisztráció | 0.6 | A felhasználó regisztrálhat egy új fiókot |
| Felhasználó kezelés | K9 | Felhasználó bejelentkezés | 0.6 | A felhasználó bejelentkezhet a már meglévő fiókjába |
| Felhasználó kezelés | K10 | Felhasználó kijelentkezés | 0.6 | A felhasználó kijelentkezhet a fiókjából |
| Törvényi megfelelés | K11 | GDPR megfelelés | 0.8 | A rendszer nem tárolhat személyes adatot, ami sértheti a GDPR-t |
| Felület | K12 | Regisztrációs oldal | 0.8 | A felület ahol a felhasználó regisztrálhat egy új fiókot |
| Felület | K13 | Bejelentkezési oldal | 0.8 | A felület ahol a felhasználó bejelentkezhet fiókjába |
| Felület | K14 | Singleplayer / Multiplayer lehetőség hozzáadása a felületen | 2.0 | A játékos kiválaszthatja hogy egyedül, vagy másokkal szeretne játszani |
| Játék mechanika | K15 | Multiplayer mód megvalósítása játékon belül | 2.0 | A játékon belül kialakítani a többjátékos módot |

## Szabad riport

Weboldal, amin filmekkel kapcsolatos témák szerinti kakukktojás-kereső játékot lehet játszani. A játék rendelkezne időmérővel és pontszámlálóval. A filmek adatait autómatikusan, külső forrásból gyűjti be. A pontszámokat felhasználói fiókhoz kötve rögzíti az oldal, különböző készülékeken elérhetőek.

## Irányított riport

 - **Külső forrásból milyen adatok lesznek összegyűjtve?**
 - Filmek címe, műfaja, színészei, kiadásuk éve.

 - **Milyen adatok lesznek nyílvánosan elérhetők a felhasználókról?**
 - Csak a felhasználónevük és pontszámaik.

 - **Miből áll egy "kakukktojás-kereső" játék?**
 - Felsorolt filmek közül a felhasználó kiválasztja a valamilyen kritérium alapján többihez nem hasonlót.

 - **Lesznek-e az oldalon hírdetések megjelenítve?**
 - Első verzióban nem, a későbbiekben igen, előfizetett felhasználók kivételével mindenkinek.

## Igényelt üzleti folyamatok

1. Online megjelenés
    1. Belépés: Felhasználónév + jelszó megadása
    2. Regisztráció: Felhasználónév + jelszó kiválasztása ==> Jelszó megerősítése ==> Belépés
    3. Főmenü: Belépés ==> Főmenü
    4. Pontozás: Belépés ==> Főmenü ==> Pontozás
    5. Játék: Belépés ==> Főmenü ==> Játék indítása
    6. Kijelentkezés: Belépés ==> Főmenü ==> Kijelentkezés

## Vágyálomrendszer

A cél egy népszerű netes játék fejlesztése, amin világszerte összemérhetik emberek a filmes tudásukat. Multiplayer implementálásával és új játékmódokkal az emberek hosszú távon élvezhetik a kínált terméket. Több nyelv támogatásával a határainkon túl is népszerűsítve a terméket.

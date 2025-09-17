# Követelmény specifikáció

## Jelenlegi helyzet
A filmekkel kapcsolatos kakukktojás-keresés jelenleg leginkább egyszerű listák vagy felsorolások formájában történik, ahol különböző műfajokat vagy kategóriákat állítanak egymás mellé. A feladat lényege annak felismerése, hogy a felsorolt elemek közül melyik tér el a többitől, ám a megvalósítás jelenleg inkább alapvető és manuális módszereken alapul.

## Jelenlegi üzleti folyamatok modellje
![Jelenlegi üzleti folyamatok modellje](../assets/jelenlegi_uzleti_folyamat_abra.png)

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

## Rendszerre vonatkozó jogszabályok, szabványok és irányelvek
### Adatvédelem és adatkezelés

A rendszer az email-címeket, felhasználóneveket, a jelszavak hashelt formáját, valamint a felhasználók előrehaladási adatait kezeli. Ennek során kötelező a [GDPR (General Data Protection Regulation)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504) előírásainak betartása. Ez magában foglalja a személyes adatok védelmét, a biztonságos adatkezelést és a felhasználói jogok érvényesítését, mint például az adatkezelési tájékoztatáshoz való jog, valamint az adatokhoz való hozzáférés, módosítás és törlés lehetősége.

### Szerzői jogok és külső API-k használata
Az alkalmazásban felhasznált, harmadik félhez tartozó tartalmak esetén be kell tartani a vonatkozó szerzői jogi és licencfeltételeket:
-	Google API: https://developers.google.com/books/terms
-	TheMovieDB: https://www.themoviedb.org/api-terms-of-use

## Fogalomszótár – Filmekkel kapcsolatos fogalmak
### Általános fogalmak
-	Műfaj (genre): A filmek csoportosítása közös témák, stílusok vagy narratív elemek alapján (pl. horror, vígjáték, sci-fi).
-	Alműfaj: Egy műfajon belüli specializált irányzat, például a sci-fi-n belül a cyberpunk.
-	Forgatókönyv: A film történetének írásos alapja, amely tartalmazza a dialógusokat és jelenetleírásokat.
-	Adaptáció: Film, amely egy könyv, képregény, játék vagy más médium alapján készült.
### Filmes műfajok
-	Akciófilm: Látványos, gyors tempójú film, amely harcokra, üldözésekre és izgalmas szituációkra épül.
-	Vígjáték: Olyan film, amely humorral és komikus helyzetekkel szórakoztatja a közönséget.
-	Horror: Félelmet vagy feszültséget keltő film, gyakran természetfeletti vagy ijesztő elemekkel.
-	Thriller: Feszültségközpontú film, amely rejtélyekre, fordulatokra és izgalomra épít.
-	Romantikus film: A szerelem és kapcsolatok állnak a középpontban.
-	Sci-fi: Jövőbeli, tudományos vagy technológiai elemeket feldolgozó film.
-	Fantasy: Mágia és képzeletbeli világok köré épített történet.
-	Dokumentumfilm: Valós eseményekről, emberekről vagy jelenségekről készített film.
### Filmes jelenségek és kifejezések
-	Blockbuster: Magas költségvetésű, széles közönségnek készült kasszasiker film.
-	Kultfilm: Sajátos hangulatú vagy témájú film, amely különleges rajongótáborral rendelkezik.
-	Franchise: Egy film sikerére épülő több részből, folytatásokból és kapcsolódó tartalmakból álló sorozat.
-	Cameo: Rövid, gyakran meglepetésszerű szereplés egy híres színész, rendező vagy közszereplő részéről.
-	Spin-off: Egy meglévő film vagy sorozat mellékszálából vagy karakteréből készített új történet.
-	Reboot: Olyan film vagy filmsorozat újraindítása, amely teljesen új megközelítést ad az eredeti témának.
-	Prequel: Egy már ismert történet előzményeit bemutató film.
-	Sequel: Egy film folytatása, amely az előző események után játszódik.

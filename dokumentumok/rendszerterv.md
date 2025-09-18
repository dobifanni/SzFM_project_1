# Rendszerterv

## Fizikai környezet
Fizikai környezet alapján a rendszer bontható két részre.
### Frontend
A felhasználó számára elérhető rendszerfunkciók kezelőfelületét egy weboldal biztosítja, amely a Svelte keretrendszerre épül. A weboldal vizuális megjelenésének kialakításához a Tailwind CSS-t használjuk, a fejlesztéshez pedig a Vite build eszközt vesszük igénybe, mivel ez natívan támogatja a Tailwindet. Fordítás után az elkészült felületet szabványos HTML, CSS és Javascript fájlok alkotják, így bármilyen webszerveren könnyedén elérhetővé válik.
### Backend
A backend a szerveroldali réteg, amelyen keresztül a frontend eléri a szükséges funkciókat. Ez egy Go nyelven fejlesztett REST API, amely a nyelv beépített standard könyvtárának HTTP keretrendszerét használja a funkciók ellátására. Az adattárolást az SQLite adatbázis biztosítja, ami beépített könyvtárként működik, így nincs szükség külön adatbázis-szerver telepítésére és üzemeltetésére. A rendszer külső adatforrásként a TMDb API-t hívja meg, amely a filmek és tv-sorozatok metaadatait szolgáltatja.

## Funkcionális terv

Rendszerszereplők:

- felhasználó

Használati esetek és lefutásaik:

- új felhasználó regisztráció

![Regisztráció](../assets/hasznalati_esetek_abra/registration.png)

- regisztrált felhasználó bejelentkezik

![Bejelentkezés](../assets/hasznalati_esetek_abra/login.png)

- bejelentkezett felhasználó kijelentkezik

![Kijelentkezés](../assets/hasznalati_esetek_abra/logout.png)

- bejelentkezett felhasználó új játékot indít

![Játékkezdés](../assets/hasznalati_esetek_abra/gamestart.png)

- játékos játékmenet végére ér

![Játékvége](../assets/hasznalati_esetek_abra/gameend.png)

- játékos megnyitja a pontszámtáblát az elért pontszámért

![Pontszámtábla](../assets/hasznalati_esetek_abra/scoreboard.png)



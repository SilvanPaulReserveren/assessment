Onderdeel 2 – Data & API Design (±15 min)
Beantwoord kort:
    Ik doe met opzet geen interfaces meer schrijven moderne typescript maakt gebruik van types.

    location: 
    ```ts
    export type Location = {
        name: string;
        city: string;
    };
    ```

    Show:
    ```ts
    import type { Location } from "./Location";

    export type show = {
        id: number;
        title: string;
        date: string;
        time: string;
        location: Location;
        price: number;
        availableSeats: number;
    }
    ```

    ApiResponse:
    ```ts
    export type ApiResponse = {
        id: string;
        private: boolean;
        createdAt: string;
        name: string;
    }
    ```

    ##2. Zou jij date en time apart opslaan of als één datetime?
        ◦ Wat zijn de voor- en nadelen?

        
Beide gevallen zijn goed maar ik zou liever alles opslaan naar een datetime. dit is accurater en toekomst gestendigd.
Waarom wel?
 - je hebt de voledige datum en tijd en kan makkelijk alles parsen
 - in de toekomst kan je tijd toevoegen indien nodig en dit scheelt veel werk.
waarom niet?
 - extra data
 - Je moet wat performance voor het parsen inleveren voor een betere weergave






    3. Stel dat een show meerdere tijden per dag heeft.
Hoe zou je het datamodel aanpassen?

    Ik zou het aanpassen naar:


    export type showDate = {
        from: date;
        to: date;
    }

    export type show = {
        id: number;
        title: string;
        date: string;
        time: showDate[];
        location: Location;
        price: number;
        availableSeats: number;
    }

    4. Hoe zou je paginatie toevoegen aan deze API?
    Ik zou 2 parameters toevoegen als (page, limit )

    de respsonse zou dan dit terug krijgen

    export type pagination<T> = {
        result: T,
        page: number;
        limit: number;
        total: number;
    }



## onderdeel 3  Backend & Database (±15 min)


```mysql
SELECT * FROM shows
WHERE 
    show_datetime > NOW()
    AND available_tickets > 0
ORDER BY show_datetime ASC
LIMIT 20 OFFSET :offset; // pagination (20 per page, :offset = (page-1)*20)
```


vraag 2

Voor optimale performance voeg je deze samengestelde index toe:
```mysql
CREATE INDEX idx_shows_datetime_available ON shows (show_datetime, available_tickets);
```
show_datetime voor filtering op toekomstige shows en sorting.
available_tickets voor filtering op beschikbaarheid.

vraag 3 Security

$query = $pdo->prepare('SELECT * FROM shows WHERE id = :id');
$query->execute(['id' => (int)$_GET['id']]);


hoe ga je om met typecasting? 

Pff dit was in beta toen ik dit deed.

(integer)$bla volgensmij dit doe je om expliciet te forceren dat iets een integer of een string moet zijn. dit zorgt er voor dat mensen niet makkelijk iets kunnen injecteren om ergens anders te komen.


dit is natuurlijk handig met typescript als je een bff pattern volgt

#Onderdeel 4 – Architectuur & Performance (±15 min)
##De site krijgt 8.000 shows per maand. Wat doe je om performance te waarborgen?
1. Ik zet een goede caching structuur neer en zorg dat mijn queries zo optimaal zijn als het maar kan. verder is het ook handig om aan de frontend niet te veel op de achterkant af te vuren. ik zorg er voor dat de server dit allemaal aankan en kan zelfs een kubernettes structuur maken die meer containers kan opspinnen indien nodig (wat waarschijnlijk niet zo zal zijn want monoliet zou dit aan moeten kunnen met een goede ratelimter and cache).

##Wanneer kies je voor:
2. SSR gebruik je wanneer je kiest om meer aan de kant van de server te doen. de gebruiker hoeft zich dan niet zorgen te maken dat hij/zij een vastloper krijgt in de browser. de meeste dure logica zal dan ook op de server gebeuren. Verder is ssr natuurlijk ook veel beter voor seo wegens hydratie. dit zorgt er voor dat google de belangrijkste stukken zonder javascript kan ophalen. Javascript rendered pagina's zoals bij (CSR) kan er voor zorgen dat je minder makkelijk gevonden word aangezien dan nog bepaalde delen moeten initializen.

Kiezen voor client side (CSR) is vaak voor als je echt een PWA wil maken met veel client side toepassingen er in. iets wat niet op de server side gedaan kan worden. Eeen CSR site is dus bijvoorbeeld handig als je een web versie wil maken voor spotify. waar je alles lokaal cached en met en of soms zonder internet kan gebruiken.

Static Generation gebruik je bij CSR sites als je toch iets van SEO wil hebben. hier genereer je alle routes en paden naar statische bestanden die niet meer aangepast kunnen worden.

Hoe zou je caching toepassen? Browser caching?  API caching?
3. Browser caching ligt er aan. je kan de lokale database gebruiken voor dingen zoals instellingen etc. je kan localstorage gebruiken voor wat grotere data. en cookies voor dingen die persistent moeten blijven.

Api caching doe je zodat als 1000 mensen tegelijkertijd naar de zelfde route gaan je niet 1000 keer dezelfde query hoeft aan te roepen. Vaak word hier een oplossing voor gebruikt zoals nginx caching of redis for grotere applicaties. voor betalingen en dat soort belangrijke dingen maakt men gebruik van rabbitMQ dit is een PUB/SUB systeem waar alle requests messages zijn in een queue die pas goed gaan wanneer het bericht goed is aangekomen.


Ik zou in dit geval alles cachen op de frontend qua shows en een normale cache op de api zetten die zich elk kwartier leegt. dit geeft genoeg speling om een ddos aan queries te voorkomen.
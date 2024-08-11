// Ladda miljövariabler från .env-fil
require("dotenv").config();

// Hämta API-nyckeln från miljövariablerna
const apiKey = process.env.MAP_API_KEY;

// Logga API-nyckeln till konsolen för felsökning (ta bort i produktion)
console.log('Your API Key:', apiKey);

// Funktion för att ladda Google Maps API
function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        // Skapa ett script-element för att ladda Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true; // Ladda scriptet asynkront
        script.defer = true; // Skjut upp körningen tills dokumentet har laddats

        // När scriptet har laddats, lös promise
        script.onload = () => resolve();
        // Om det uppstår ett fel vid laddning, avvisa promise
        script.onerror = () => reject(new Error('Google Maps API failed to load.'));

        // Lägg till script-elementet i dokumentets head
        document.head.appendChild(script);
    });
}

// När fönstret har laddats
window.onload = async () => {
    try {
        // Vänta på att Google Maps API ska laddas
        await loadGoogleMapsAPI();  
        // Initiera kartan
        initMap();
    } catch (error) {
        // Logga felmeddelande om något går fel
        console.error(error);
    }
};

function initMap() {
    const mapContainer = document.getElementById('map');
    const searchInput = document.getElementById('searchInput');
    const locationElement = document.getElementById('location');
    const postalCodeElement = document.getElementById('postal_code');
    const countryElement = document.getElementById('country');
    const latElement = document.getElementById('lat');
    const longElement = document.getElementById('long');
    const mapInfo = document.getElementById('mapInfo');
    
    // Dölj mapInfo från början
    mapInfo.style.display = 'none';
    
    const map = new google.maps.Map(mapContainer, {
        center: { lat: 57.6775, lng: 14.1583 }, // Initialt center (Stockholm)
        zoom: 6,

           //valbara kartkontroller
           mapTypeControl: true,  
           mapTypeControlOptions: {
               style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,  
               mapTypeIds: ['roadmap', 'satellite']  
           },
           fullscreenControl: false,  
           streetViewControl: false,  
           zoomControl: true,  
           scaleControl: false,  
           rotateControl: false,  
    });
    
    // Lägg till sökfältet till Google Maps-kontrollerna
    const searchBox = new google.maps.places.SearchBox(searchInput);
    map.controls[google.maps.ControlPosition.RIGHT].push(searchInput); 

    searchBox.addListener('places_changed', async () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];

        // Centrera kartan på den valda platsen och justera zoomnivån
        map.setCenter(place.geometry.location);
        map.setZoom(15);  // Justera zoomnivån baserat på preferens, 15 är bra för stadsvy
        
        // Lägg till en markör på den valda platsen
        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
        });

        // Hämta detaljerad platsinformation
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${place.geometry.location.lat()},${place.geometry.location.lng()}&key=${apiKey}`);
        const data = await response.json();
        
        // Fyll i informationen i elementen (uppdatera baserat på hämtad data)
        locationElement.textContent = place.formatted_address || data.results[0].formatted_address;
        postalCodeElement.textContent = getComponentValue(data.results[0].address_components, 'postal_code');
        countryElement.textContent = getComponentValue(data.results[0].address_components, 'country');
        latElement.textContent = place.geometry.location.lat();
        longElement.textContent = place.geometry.location.lng();

        // Visa mapInfo endast om latElement har innehåll
        if (latElement.textContent) {
            mapInfo.style.display = 'flex'; // Visa mapInfo
        } else {
            mapInfo.style.display = 'none'; // Dölj mapInfo om ingen postnummer hittas
        }
    });

    // Funktion för att hämta värde från addressComponents baserat på typ
    function getComponentValue(addressComponents, type) {
        for (const component of addressComponents) {
            if (component.types.includes(type)) {
                return component.long_name;
            }
        }
        return '';
    }
}

 
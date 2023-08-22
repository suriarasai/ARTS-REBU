Documentation: https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete
Example: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete


```js
import { Autocomplete } from '@react-google-maps/api'

const [autocomplete, setAutocomplete] = useState<any>(null)

const onRetrieve = () => {
    console.log(autocomplete.getPlace())
}

...

<Autocomplete
    onLoad={setAutocomplete}
    onPlaceChanged={onRetrieve}
    options={{ componentRestrictions: { country: 'sg' } }}
    fields={['address_components', 'geometry', 'formatted_address']}
>
    <input
        type='text'
        placeholder='Where to?'
    />
</Autocomplete>
```

* Note: It is important to specify `fields` to reduce the size (ie. cost) of the response object
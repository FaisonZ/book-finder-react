# V2 Thoughts

The Main Components

1. Book Search and Book Picker
2. In-Book Search and Results

For API calls:
We mostly want to have a black box on the edge that can be called to get the
requested data in the format that is helpful for the App. That way the guts
of the App can focus on the use of the data and not retrieving it. It also
allows us to introduce some form of caching if found necessary.

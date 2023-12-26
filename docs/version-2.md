# V2 Thoughts

## Initial Guiding Ideas

These were my initial thoughts on version 2 before implementing:

### The Main Components

1. Book Search and Book Picker
2. In-Book Search and Results

### For API calls

We mostly want to have a black box on the edge that can be called to get the
requested data in the format that is helpful for the App. That way the guts
of the App can focus on the use of the data and not retrieving it. It also
allows us to introduce some form of caching if found necessary.

## How it's Going

### The Good

Version 2 has gone much smoother than version 1. There was a clear separation
of components; styling with RSCSS has helped inform how to build out the DOM
elements and keep the Sass files simple; and I was able to implement some
caching of book data and book metadata in order to reduce redundant API calls
when searching in books.

### The Bad

I've run into something I'm not happy with though: After searching for books,
selecting some and then searching within those selected books, I end up with
the following data in separate contexts:

1. An unsorted array of Book data, which includes a book's title.
2. An unsorted array of Book metadata, which includes a book's page mapping
   that is needed for proper deep linking.
3. An unsorted array of in-book search results, which contains the book's id,
   and the leaf number which potentially needs to be mapped to a page number.

So I have the raw search result data rendered to the page, but now I have to
get a book's title, deal with the leaf number to page number mapping, and
build a deep link for each result.

I'm not excited about working with all that to build deep links and display the book title in search results.

### And The Ugly

So for the sake of finishing version 2, I'm going to push through and make it
happen. Likely there will be for loops in for loops. Maybe I'll replicate book
titles on search results. Perhaps I'll handle the leaf number to page number
mapping when the search results are initially retrieved. Either way, it ain't
gonna look pretty.

## Takeaways

When I finish version 2, I will add my takeaways.

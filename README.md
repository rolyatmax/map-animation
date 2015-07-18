Map Animation
=============

A little visualization showing BuzzFeed articles that have been read in different
countries around the world using a little animation library I wrote:
https://github.com/rolyatmax/drawer

```
npm install
npm run generate-topo
npm run watch
```

Then:

```
npm run serve
```

And point your browser to `localhost:8282`.

----------------------------

## TODO

 - [ ] add padding to country display
 - [X] get more granular topojson for countries
 - [X] show the full country name
 - [X] figure out topoJSON projections
 - [X] Position origin over country
 - [X] Easing methods / Timing (for line drawing)
 - [X] Order of fade (Words should fade first)
 - [X] Drawing a map onto canvas
 - [X] Add start/stop
 - [ ] Fix drawing so it doesn't duplicate lines and make colors darker (or clear after every frame?)
 - [X] Clean up styling in JS/CSS
 - [ ] Refactor textBg box
 - [X] Fix map width:height ratio
 - [ ] Link up lines to draw a couple long lines instead of thousands?
 - [ ] draw with GPU? (poor performance on ARM - raspberry pi??)
 - [ ] pan / zoom map to specific country / region?
 - [X] position captions by quadrant
 - [X] draw individual countries (draw one country at a time?)

### Scene options

 - [ ] Show circles from all over
 - [ ] Individual countries - show article (or trending from that country)
 - [ ] Pull questions from content
 - [ ] Show breaking news content
 - [ ] Food content - for lunch / dinner
 - [ ] Accidental haikus

# Chunking strategy

There are many kinds of data in the UHD ACM site, and they'll be chunked different depending on their content.

Below are examples of each types' token and metadata structure.

**Page**<br/>
Tokens
```
Page: home-page
<section: "Rise above the noise One step at a time" | "Together, we push past doubts and distractions amplifying
each other’s strengths every step of the way.">
<section: "Be at the Right Place
At the Right Time" | "View our calendar and find what we have planned for you!">
<featured-event-section>
<event-search-calendar-section>
<watch-recent-or-view-all-qna-section>
<section: "Join Today!" | "We await your arrival!">
```
Metadata
```json
{
  "collection": "page-home",
  "page-url": "http://localhost:3000",
  "actions": [
    {
      "label": "Join the club",
      "url": "http://localhost:3000/join"
    },
    {
      "label": "About Us",
      "url": "http://localhost:3000/about"
    },
    {
      "label": "Upcoming Events",
      "url": "http://localhost:3000/events"
    },
    {
      "label": "View all QnAs",
      "url": "http://localhost:3000/qnas"
    },
  ]
}
```

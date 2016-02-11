ng Started
-
## How do I run this project?
You need ruby -v=2.2.2 has been installed    
Follow steps:   
1. bundle install
2. ruby app.rb
3. open http://localhost:1337 in browser

Getting Standards Taxonomy
-
OpenEd also allows you to search for information on the standards themselves (in addition to finding resources for standards). Standards are organized into "standard groups" such as "Common Core Math" and "Common Core Language Arts". Within a standard group there are "grade groups" such as "Elementary" and "Middle School". Each grade group has a set of "categories" (sometimes known as "strands"), such as "Geometry". Within categories there are individual standards. This method of organizing standards was created by the Common Core State Standards, but we use it to structure all standard groups.
###### Get the list of Standard Groups
To navigate the standards hierarchies you first need to get the list of standard groups.   
GET https://partner.opened.com/1/standard_groups.json   
Response:
```javascript
{
    "standard_groups": [
        {
            "id": 2,
            "name": "Common Core Language Arts",
            "title": "Common Core Language Arts",
            "count": 3669
        },
       ...
    ]
}
```

###### Get the list of Grade Groups
Get the list of grade groups, typically for a particular standard group.    
GET https://partner.opened.com/1/grade_groups.json?standard_group=2
Response: 
```javascript
{"grade_groups":
    [
        {"id":46,"title":"Elementary","count":7099},
        {"id":47,"title":"Middle School","count":4536},
        {"id":48,"title":"High School","count":2247},
        {"id":49,"title":"High School: Algebra","count":757},
        {"id":50,"title":"High School: Functions","count":580},
        {"id":51,"title":"High School: Geometry","count":547},
        {"id":52,"title":"High School: Number and Quantity","count":426},
        {"id":53,"title":"High School: Statistics & Probability ","count":430}
    ]
}
```

###### Get the list of Categories
You can list the categories (also known as "strands") based on several criteria. It will also return a count of resources.   
GET https://partner.opened.com/1/categories.json?standard_group=2&grade_group=46  
Response: 
```javascript
{
"categories": [
    {
        "id": 424,
        "title": "A Child’s Place in Time and Space",
        "grade_group": "Elementary",
        "count": 51
    },
    ...
    ]
}
```
###### Get the list of Standards
Get the list of standards with the number of aligned resources   
GET https://partner.opened.com/1/standards.json?category=256&grades_range=K-5
Response: 
```javascript
{
"standards": [
    {
        "id": 21461,
        "identifier": "K.CC.1",
        "title": "Count to 100 by ones and by tens.",
        "description": "Count to 100 by ones and by tens.",
        "key_words": "counting,numbers,digits,count by tens, count by ones, count to 100, k.cc.1\r\n",
        "more_information": "",
        "count": 128
    },
    ...
    ]
}
```

Getting Area / Subject Taxonomy
-
OpenEd categorizes all resources in an area/subject taxonomy. The top level is areas, such as Math and Language Arts. The next level is subject, such as Geometry or Writing.    

###### Get the list of Areas
Get the list of areas
GET https://partner.opened.com/areas.json    
Response: 
```javascript
{
  "areas": [
    {
      "id": 1,
      "title": "Mathematics",
      "count": 7460
    },
    ...
    ]
}
```

###### Get the list of Subjects
Get the list of subjects based on supplied area
GET https://partner.opened.com/1/subjects.json?area=1
Response: 
```javascript
{
  "subjects": [
    {
      "id": 6,
      "title": "Measurement & Data",
      "count": 1041
    },
    ...
    ]
}
```

More info: [Opened Partner API](http://docs.opened.apiary.io/#reference) 


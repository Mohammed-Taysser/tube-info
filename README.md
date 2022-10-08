# `tube-info`

Node.js command line app for exporting video/playlist data from a YouTube to a JSON/CSV file with extra features.

This app lets you download the [`metadata of each video`](#exportable-items) (e.g. video title, URL, uploader, and etc.) from a public/unlisted YouTube playlist and saves it to a JSON or CSV file.

## Features

- Highly customizable
- Promise based HTTP client using [`axios`](https://www.npmjs.com/package/axios)
- Terminal string styling using [`chalk`](https://www.npmjs.com/package/chalk)
- command-line interfaces & implements a help system using [`commander`](https://www.npmjs.com/package/commander)
- Simple config handling using [`conf`](https://www.npmjs.com/package/conf)
- JavaScript code linting is done using [`eslint`](https://www.npmjs.com/package/eslint)
- common interactive command line user interfaces using [`inquirer`](https://www.npmjs.com/package/inquirer)
- validate user input path using [`is-absolute`](https://www.npmjs.com/package/is-absolute)
- Converts json into csv using [`json2csv`](https://www.npmjs.com/package/json2csv)
- Elegant terminal spinner using [`ora`](https://www.npmjs.com/package/ora)
- Delightful JavaScript Testing using [`jest`](https://www.npmjs.com/package/jest)
- create build version using [`babel`](https://babeljs.io/)
- Has [`.editorconfig`](https://editorconfig.org/) which helps developers define and maintain consistent coding styles between different editors and IDEs.

> **Note** This app does **not** download videos from a YouTube playlist. It only downloads **text-based metadata** of videos from a playlist.

## Installation

> Before start [`node.js`](https://nodejs.org/en/) must pre-install in your machine.
> to verify installation, use `node -v` it show something like that `v16.15.0` see [`node.js`](https://nodejs.org/en/) for more details and how to install.

1. Install the app:

   ```shell
   npm install -g tube-info
   ```

2. Run the following command in Terminal to confirm that it's properly installed:

   ```shell
   tube-info --help
   ```

3. Get a YouTube API v3 key for free:

   - 3 min. YouTube tutorial - [`How to Get YouTube API Key 2021`](https://youtu.be/N18czV5tj5o)
   - RapidAPI blog article - [`How To Get a YouTube API Key (in 7 Simple Steps)`](https://rapidapi.com/blog/how-to-get-youtube-api-key/)

4. Run the following command and follow the on-screen instructions to register the YouTube API key:

   ```shell
   tube-info key
   ```

## Usage 🚀

Use the following command to get more info

```shell
tube-info --help
```

This will get the following results:

```txt
Usage: tube-info [options] [command]

Exports video/playlist data from YouTube to JSON/CSV file.


Options:
  -v, --version                   output the version number
  -h, --help                      display help for command

Commands:
  key                             Manage your YouTube API key.
  config [options]                Edit configurations of tube-info app.
  playlist [options] <ID Or URL>  Export playlist metadata its id or url.
  video [options] <ID Or URL>     Export video metadata by id or url.
  help [command]                  display help for command
```

### Export video

Export a YouTube video given its video ID, Or using video url.

```shell
tube-info video <videoId>
```

To find the video ID, go to the video homepage and copy the value of the `list` parameter in the URL `https://www.youtube.com/watch?v=[videoId]`).

For example, the [`Learn Typescript In Arabic 2022 - #01 - Introduction And What Is TypeScript`](https://www.youtube.com/watch?v=yUndnE-2osg) video has a video ID of `yUndnE-2osg`.

![Demo of video "id" command](./assets/demo-video-id.png)

#### Flags

- `-d`/`--default` - Skip all prompt questions and use the default configurations

#### Exportable Items

| Item           | JSON/CSV Key Name |
| -------------- | ----------------- |
| Channel id     | `channelId`       |
| Channel title  | `channelTitle`    |
| Comment count  | `commentCount`    |
| Description    | `description`     |
| Favorite count | `favoriteCount`   |
| Length         | `length`          |
| Likes          | `likeCount`       |
| Privacy status | `privacyStatus`   |
| Publish date   | `publishDate`     |
| Tags           | `tags`            |
| Thumbnail      | `thumbnail`       |
| Title          | `title`           |
| Url            | `url`             |
| View count     | `viewCount`       |

### Export Playlist

Export a YouTube playlist given its playlist ID, Or using playlist url.

```shell
tube-info playlist <playlistId>
```

To find the playlist ID, go to the playlist homepage and copy the value of the `list` parameter in the URL `https://www.youtube.com/playlist?list=[playlistId]`).

For example, the [`Learn Typescript 2022`](https://www.youtube.com/playlist?list=PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ) playlist has a playlist ID of `PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ`.

![Demo of "id" command](./assets/demo-playlist-id.png)

#### Flags

- `-d`/`--default` - Skip all prompt questions and use the default configurations

#### Exportable Items

| Item                      | JSON/CSV Key Name |
| ------------------------- | ----------------- |
| Position in the playlist  | `position`        |
| Title                     | `title`           |
| Uploader                  | `uploader`        |
| thumbnail                 | `thumbnail`       |
| Uploader URL              | `uploaderUrl`     |
| Description               | `description`     |
| Url                       | `url`             |
| Video privacy             | `videoPrivacy`    |
| Publish time (UTC)        | `publishTime`     |

**Note** Playlist position starts from 0

### Save Location

You can specify the absolute path of a folder where the files will be saved to. The default value is `~/tube-info`. Don't worry, the folder will be created if it doesn't exist.

Since it requires an **absolute** path, here are same examples:

- ✔️ `C:\Users\User\Downloads` (Windows)
- ✔️ `/usr/tube-info` (Mac/Linux)
- ❌  `../tube-info`
- ❌  `./tube-info`

### Example Output

#### Playlist Example

The app outputs the following when running `tube-info playlist PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ`:

<details>
   <summary>JSON</summary>

```json
[
  {
    "position": 0,
    "thumbnail": "https://i.ytimg.com/vi/yUndnE-2osg/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #01 - Introduction And What Is TypeScript",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/yUndnE-2osg"
  },
  {
    "position": 1,
    "thumbnail": "https://i.ytimg.com/vi/pc5IlcEn8vw/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #02 - Install TypeScript And Transpile Files",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/pc5IlcEn8vw"
  },
  {
    "position": 2,
    "thumbnail": "https://i.ytimg.com/vi/CSll1rsRPOI/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #03 - Create Configuration And Watch Files",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/CSll1rsRPOI"
  },
  {
    "position": 3,
    "thumbnail": "https://i.ytimg.com/vi/OgxYA7G9HsM/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #04 - Statically vs Dynamically Typed Languages",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/OgxYA7G9HsM"
  },
  {
    "position": 4,
    "thumbnail": "https://i.ytimg.com/vi/quwf-YbyHVg/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #05 - Type Annotations And Any Data Type",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/quwf-YbyHVg"
  },
  {
    "position": 5,
    "thumbnail": "https://i.ytimg.com/vi/U405xMeS4lM/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #06 - Type Annotations With Arrays",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/U405xMeS4lM"
  },
  {
    "position": 6,
    "thumbnail": "https://i.ytimg.com/vi/n6JBmErg1OY/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #07 - Type Annotations With Multidimensional Arrays",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/n6JBmErg1OY"
  },
  {
    "position": 7,
    "thumbnail": "https://i.ytimg.com/vi/ibvt_Ala8wE/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #08 - Type Annotations With Function",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/ibvt_Ala8wE"
  },
  {
    "position": 8,
    "thumbnail": "https://i.ytimg.com/vi/IS2VuO0IWso/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #09 - Function Optional and Default Parameters",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/IS2VuO0IWso"
  },
  {
    "position": 9,
    "thumbnail": "https://i.ytimg.com/vi/RBOpzAQaQos/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #10 - Function Rest Parameter",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/RBOpzAQaQos"
  },
  {
    "position": 10,
    "thumbnail": "https://i.ytimg.com/vi/AWg__YvDdvg/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #11 - Type Annotations With Anonymous And Arrow Function",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/AWg__YvDdvg"
  },
  {
    "position": 11,
    "thumbnail": "https://i.ytimg.com/vi/TWTt63RJ3ic/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #12 - Data Types - Type Alias",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/TWTt63RJ3ic"
  },
  {
    "position": 12,
    "thumbnail": "https://i.ytimg.com/vi/J1WsNERYqYA/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #13 - Data Types - Type Alias Advanced",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/J1WsNERYqYA"
  },
  {
    "position": 13,
    "thumbnail": "https://i.ytimg.com/vi/BmmTQZsKXyw/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #14 - Data Types - Literal Types",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/BmmTQZsKXyw"
  },
  {
    "position": 14,
    "thumbnail": "https://i.ytimg.com/vi/hwTOswoq3BE/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #15 - Data Types - Tuple",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/hwTOswoq3BE"
  },
  {
    "position": 15,
    "thumbnail": "https://i.ytimg.com/vi/tPQCnP2IYn8/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #16 - Data Types - Void And Never",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/tPQCnP2IYn8"
  },
  {
    "position": 16,
    "thumbnail": "https://i.ytimg.com/vi/Lb8-2rI8nco/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #17 - Data Types - Enums Part 1",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/Lb8-2rI8nco"
  },
  {
    "position": 17,
    "thumbnail": "https://i.ytimg.com/vi/gMNoF-BVWpA/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #18 - Data Types - Enums Part 2",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/gMNoF-BVWpA"
  },
  {
    "position": 18,
    "thumbnail": "https://i.ytimg.com/vi/tPSHBw_2huc/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #19 - Data Types - Type Assertions",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/tPSHBw_2huc"
  },
  {
    "position": 19,
    "thumbnail": "https://i.ytimg.com/vi/Uf-ODplNJ7A/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #20 - Data Types - Union And Intersection Types",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/Uf-ODplNJ7A"
  },
  {
    "position": 20,
    "thumbnail": "https://i.ytimg.com/vi/7pjfbbZTOCU/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #21 - Type Annotations With Object",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/7pjfbbZTOCU"
  },
  {
    "position": 21,
    "thumbnail": "https://i.ytimg.com/vi/qopmfZ30_TQ/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #22 - Interface Declaration",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/qopmfZ30_TQ"
  },
  {
    "position": 22,
    "thumbnail": "https://i.ytimg.com/vi/ZOWwVhAUtZQ/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #23 - Interface Method And Parameters",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/ZOWwVhAUtZQ"
  },
  {
    "position": 23,
    "thumbnail": "https://i.ytimg.com/vi/7rJwXk_SuXQ/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #24 - Interface Reopen And Use Cases",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/7rJwXk_SuXQ"
  },
  {
    "position": 24,
    "thumbnail": "https://i.ytimg.com/vi/3iwthBqZwrM/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #25 - Interface Extend",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/3iwthBqZwrM"
  },
  {
    "position": 25,
    "thumbnail": "https://i.ytimg.com/vi/CaBIiFpxFTo/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #26 - Interface Final Discussion",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/CaBIiFpxFTo"
  },
  {
    "position": 26,
    "thumbnail": "https://i.ytimg.com/vi/mD3qHYKNBfo/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #27 - Class Type Annotations",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/mD3qHYKNBfo"
  },
  {
    "position": 27,
    "thumbnail": "https://i.ytimg.com/vi/FzROwTuVKr8/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #28 - Class Access Modifiers And Parameters Properties",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/FzROwTuVKr8"
  },
  {
    "position": 28,
    "thumbnail": "https://i.ytimg.com/vi/kXS5eprio7I/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #29 - Class Get And Set Accessors",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/kXS5eprio7I"
  },
  {
    "position": 29,
    "thumbnail": "https://i.ytimg.com/vi/mFnCSvduc8M/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #30 - Class Static Members",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/mFnCSvduc8M"
  },
  {
    "position": 30,
    "thumbnail": "https://i.ytimg.com/vi/klcmDKP_34s/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #31 - Class Implements Interface",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/klcmDKP_34s"
  },
  {
    "position": 31,
    "thumbnail": "https://i.ytimg.com/vi/nesuaOpNDWU/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #32 - Abstract Classes And Members",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/nesuaOpNDWU"
  },
  {
    "position": 32,
    "thumbnail": "https://i.ytimg.com/vi/V-CEhWbYDYY/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #33 - Polymorphism And Method Override",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/V-CEhWbYDYY"
  },
  {
    "position": 33,
    "thumbnail": "https://i.ytimg.com/vi/b1w1qa3H_vA/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #34 - Generics Introduction",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/b1w1qa3H_vA"
  },
  {
    "position": 34,
    "thumbnail": "https://i.ytimg.com/vi/BA40TsV6LxQ/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #35 - Generics Multiple Types",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/BA40TsV6LxQ"
  },
  {
    "position": 35,
    "thumbnail": "https://i.ytimg.com/vi/Mj6TJAoisxw/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #36 - Generics Classes",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/Mj6TJAoisxw"
  },
  {
    "position": 36,
    "thumbnail": "https://i.ytimg.com/vi/9uwul5pr0YE/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #37 - Generics And Interfaces",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/9uwul5pr0YE"
  },
  {
    "position": 37,
    "thumbnail": "https://i.ytimg.com/vi/Ot5AGaudAcg/sddefault.jpg",
    "title": "Learn Typescript In Arabic 2022 - #38 - The End And How To Master Typescript",
    "uploader": "Elzero Web School",
    "url": "https://youtu.be/Ot5AGaudAcg"
  }
]
```

</details>

<details>
   <summary>CSV</summary>

```csv
"position","title","uploader","url","thumbnail"
0,"Learn Typescript In Arabic 2022 - #01 - Introduction And What Is TypeScript","Elzero Web School","https://youtu.be/yUndnE-2osg","https://i.ytimg.com/vi/yUndnE-2osg/sddefault.jpg"
1,"Learn Typescript In Arabic 2022 - #02 - Install TypeScript And Transpile Files","Elzero Web School","https://youtu.be/pc5IlcEn8vw","https://i.ytimg.com/vi/pc5IlcEn8vw/sddefault.jpg"
2,"Learn Typescript In Arabic 2022 - #03 - Create Configuration And Watch Files","Elzero Web School","https://youtu.be/CSll1rsRPOI","https://i.ytimg.com/vi/CSll1rsRPOI/sddefault.jpg"
3,"Learn Typescript In Arabic 2022 - #04 - Statically vs Dynamically Typed Languages","Elzero Web School","https://youtu.be/OgxYA7G9HsM","https://i.ytimg.com/vi/OgxYA7G9HsM/sddefault.jpg"
4,"Learn Typescript In Arabic 2022 - #05 - Type Annotations And Any Data Type","Elzero Web School","https://youtu.be/quwf-YbyHVg","https://i.ytimg.com/vi/quwf-YbyHVg/sddefault.jpg"
5,"Learn Typescript In Arabic 2022 - #06 - Type Annotations With Arrays","Elzero Web School","https://youtu.be/U405xMeS4lM","https://i.ytimg.com/vi/U405xMeS4lM/sddefault.jpg"
6,"Learn Typescript In Arabic 2022 - #07 - Type Annotations With Multidimensional Arrays","Elzero Web School","https://youtu.be/n6JBmErg1OY","https://i.ytimg.com/vi/n6JBmErg1OY/sddefault.jpg"
7,"Learn Typescript In Arabic 2022 - #08 - Type Annotations With Function","Elzero Web School","https://youtu.be/ibvt_Ala8wE","https://i.ytimg.com/vi/ibvt_Ala8wE/sddefault.jpg"
8,"Learn Typescript In Arabic 2022 - #09 - Function Optional and Default Parameters","Elzero Web School","https://youtu.be/IS2VuO0IWso","https://i.ytimg.com/vi/IS2VuO0IWso/sddefault.jpg"
9,"Learn Typescript In Arabic 2022 - #10 - Function Rest Parameter","Elzero Web School","https://youtu.be/RBOpzAQaQos","https://i.ytimg.com/vi/RBOpzAQaQos/sddefault.jpg"
10,"Learn Typescript In Arabic 2022 - #11 - Type Annotations With Anonymous And Arrow Function","Elzero Web School","https://youtu.be/AWg__YvDdvg","https://i.ytimg.com/vi/AWg__YvDdvg/sddefault.jpg"
11,"Learn Typescript In Arabic 2022 - #12 - Data Types - Type Alias","Elzero Web School","https://youtu.be/TWTt63RJ3ic","https://i.ytimg.com/vi/TWTt63RJ3ic/sddefault.jpg"
12,"Learn Typescript In Arabic 2022 - #13 - Data Types - Type Alias Advanced","Elzero Web School","https://youtu.be/J1WsNERYqYA","https://i.ytimg.com/vi/J1WsNERYqYA/sddefault.jpg"
13,"Learn Typescript In Arabic 2022 - #14 - Data Types - Literal Types","Elzero Web School","https://youtu.be/BmmTQZsKXyw","https://i.ytimg.com/vi/BmmTQZsKXyw/sddefault.jpg"
14,"Learn Typescript In Arabic 2022 - #15 - Data Types - Tuple","Elzero Web School","https://youtu.be/hwTOswoq3BE","https://i.ytimg.com/vi/hwTOswoq3BE/sddefault.jpg"
15,"Learn Typescript In Arabic 2022 - #16 - Data Types - Void And Never","Elzero Web School","https://youtu.be/tPQCnP2IYn8","https://i.ytimg.com/vi/tPQCnP2IYn8/sddefault.jpg"
16,"Learn Typescript In Arabic 2022 - #17 - Data Types - Enums Part 1","Elzero Web School","https://youtu.be/Lb8-2rI8nco","https://i.ytimg.com/vi/Lb8-2rI8nco/sddefault.jpg"
17,"Learn Typescript In Arabic 2022 - #18 - Data Types - Enums Part 2","Elzero Web School","https://youtu.be/gMNoF-BVWpA","https://i.ytimg.com/vi/gMNoF-BVWpA/sddefault.jpg"
18,"Learn Typescript In Arabic 2022 - #19 - Data Types - Type Assertions","Elzero Web School","https://youtu.be/tPSHBw_2huc","https://i.ytimg.com/vi/tPSHBw_2huc/sddefault.jpg"
19,"Learn Typescript In Arabic 2022 - #20 - Data Types - Union And Intersection Types","Elzero Web School","https://youtu.be/Uf-ODplNJ7A","https://i.ytimg.com/vi/Uf-ODplNJ7A/sddefault.jpg"
20,"Learn Typescript In Arabic 2022 - #21 - Type Annotations With Object","Elzero Web School","https://youtu.be/7pjfbbZTOCU","https://i.ytimg.com/vi/7pjfbbZTOCU/sddefault.jpg"
21,"Learn Typescript In Arabic 2022 - #22 - Interface Declaration","Elzero Web School","https://youtu.be/qopmfZ30_TQ","https://i.ytimg.com/vi/qopmfZ30_TQ/sddefault.jpg"
22,"Learn Typescript In Arabic 2022 - #23 - Interface Method And Parameters","Elzero Web School","https://youtu.be/ZOWwVhAUtZQ","https://i.ytimg.com/vi/ZOWwVhAUtZQ/sddefault.jpg"
23,"Learn Typescript In Arabic 2022 - #24 - Interface Reopen And Use Cases","Elzero Web School","https://youtu.be/7rJwXk_SuXQ","https://i.ytimg.com/vi/7rJwXk_SuXQ/sddefault.jpg"
24,"Learn Typescript In Arabic 2022 - #25 - Interface Extend","Elzero Web School","https://youtu.be/3iwthBqZwrM","https://i.ytimg.com/vi/3iwthBqZwrM/sddefault.jpg"
25,"Learn Typescript In Arabic 2022 - #26 - Interface Final Discussion","Elzero Web School","https://youtu.be/CaBIiFpxFTo","https://i.ytimg.com/vi/CaBIiFpxFTo/sddefault.jpg"
26,"Learn Typescript In Arabic 2022 - #27 - Class Type Annotations","Elzero Web School","https://youtu.be/mD3qHYKNBfo","https://i.ytimg.com/vi/mD3qHYKNBfo/sddefault.jpg"
27,"Learn Typescript In Arabic 2022 - #28 - Class Access Modifiers And Parameters Properties","Elzero Web School","https://youtu.be/FzROwTuVKr8","https://i.ytimg.com/vi/FzROwTuVKr8/sddefault.jpg"
28,"Learn Typescript In Arabic 2022 - #29 - Class Get And Set Accessors","Elzero Web School","https://youtu.be/kXS5eprio7I","https://i.ytimg.com/vi/kXS5eprio7I/sddefault.jpg"
29,"Learn Typescript In Arabic 2022 - #30 - Class Static Members","Elzero Web School","https://youtu.be/mFnCSvduc8M","https://i.ytimg.com/vi/mFnCSvduc8M/sddefault.jpg"
30,"Learn Typescript In Arabic 2022 - #31 - Class Implements Interface","Elzero Web School","https://youtu.be/klcmDKP_34s","https://i.ytimg.com/vi/klcmDKP_34s/sddefault.jpg"
31,"Learn Typescript In Arabic 2022 - #32 - Abstract Classes And Members","Elzero Web School","https://youtu.be/nesuaOpNDWU","https://i.ytimg.com/vi/nesuaOpNDWU/sddefault.jpg"
32,"Learn Typescript In Arabic 2022 - #33 - Polymorphism And Method Override","Elzero Web School","https://youtu.be/V-CEhWbYDYY","https://i.ytimg.com/vi/V-CEhWbYDYY/sddefault.jpg"
33,"Learn Typescript In Arabic 2022 - #34 - Generics Introduction","Elzero Web School","https://youtu.be/b1w1qa3H_vA","https://i.ytimg.com/vi/b1w1qa3H_vA/sddefault.jpg"
34,"Learn Typescript In Arabic 2022 - #35 - Generics Multiple Types","Elzero Web School","https://youtu.be/BA40TsV6LxQ","https://i.ytimg.com/vi/BA40TsV6LxQ/sddefault.jpg"
35,"Learn Typescript In Arabic 2022 - #36 - Generics Classes","Elzero Web School","https://youtu.be/Mj6TJAoisxw","https://i.ytimg.com/vi/Mj6TJAoisxw/sddefault.jpg"
36,"Learn Typescript In Arabic 2022 - #37 - Generics And Interfaces","Elzero Web School","https://youtu.be/9uwul5pr0YE","https://i.ytimg.com/vi/9uwul5pr0YE/sddefault.jpg"
37,"Learn Typescript In Arabic 2022 - #38 - The End And How To Master Typescript","Elzero Web School","https://youtu.be/Ot5AGaudAcg","https://i.ytimg.com/vi/Ot5AGaudAcg/sddefault.jpg"
```

</details>

#### Video Example

The app outputs the following when running `tube-info video yUndnE-2osg`:

<details>
   <summary>JSON</summary>

```json
{
  "channelTitle": "Elzero Web School",
  "length": "PT4M",
  "likeCount": "1681",
  "publishDate": "2022-07-24T19:38:54Z",
  "thumbnail": "https://i.ytimg.com/vi/yUndnE-2osg/sddefault.jpg",
  "title": "Learn Typescript In Arabic 2022 - #01 - Introduction And What Is TypeScript",
  "viewCount": "30199"
}
```

</details>

<details>
   <summary>CSV</summary>

```csv
"channelTitle","length","likeCount","publishDate","thumbnail","title","viewCount"
"Elzero Web School","PT4M","1681","2022-07-24T19:38:54Z","https://i.ytimg.com/vi/yUndnE-2osg/sddefault.jpg","Learn Typescript In Arabic 2022 - #01 - Introduction And What Is TypeScript","30199"
```

</details>

### API Key 🔐

Register, modify, or delete your YouTube API key.

```shell
tube-info key
```

First-time users for registering YouTube API key:

![Demo of "key" command for first-time users](./assets/demo-key-first-use.png)

After registering the API key:

![Demo of "key" command after registered API key](./assets/demo-key--after-register.png)

> ✔️ Your API key will only be stored in your local computer.

### Configuration 📫

Configure preferences of this app.

```shell
tube-info config
```

![Demo of "config" command](./assets/demo-config.png)

#### Flags 🚩

- `-p`/`--path` - Show the path of the where the config file is stored
- `-r`/`--reset` - Reset all configurations to default values (see below)

#### Default Config

- Items to export in playlist: `[Position, Title, Uploader, URL, Thumbnail]`
- Items to export in video: `[channelTitle, length, likeCount, publishDate, Title, viewCount, Thumbnail]`
- File extension: `JSON`
- Save location: `~/tube-reports`
- For playlist - skip private/deleted videos: `True`

## Development 🚀

### Quick Start

1. Install yarn if you haven't

 ```shell
 npm install -g yarn
 ```

1. Install dependencies

 ```shell
 yarn
 ```

1. Start the development server

 ```bash
 yarn start
 ```

To run the app, open a new Terminal and run:

```bash
node src/index.js
```

### Available scripts

- `start` : start the app
- `lint` : lint app codebase
- `build` : build the app using [`babel`](https://babeljs.io/)
- `watch` : watch the app and build changes using [`babel`](https://babeljs.io/)
- `clean` : remove `dist` directory
- `test` : start testing using [`jest`](https://jestjs.io/)
- `test:coverage` : create coverage report using [`jest`](https://jestjs.io/)

### Test

All tests are written in [Jest](https://jestjs.io/) and they are located in the `__tests__` folder. To run all tests:

```bash
yarn test
# Alternatively, run this to generate a coverage report
yarn test:coverage
```

Note that [`clearMocks`](https://jestjs.io/docs/configuration#clearmocks-boolean) is set to `true`, which Jest will automatically clear mock calls and instances before every test.

## Limitations 💢

This app uses [`YouTube API v3`](https://developers.google.com/youtube/v3/) under the hood. However, due to limitations of the API, it **cannot** perform the following actions:

- Export your "Watch Later" playlist
- Export private playlists
- Export most metadata of deleted or private videos, such as the original video title and description
- Download each video, not its metadata, in mp3, mp4, wmv, or other formats

## Related Work 🌠

- [`tube-cli`](https://github.com/mohammed-Taysser/tube-cli) - A package for downloading youtube videos video & playlists

## Contribution 🤝

1. Fork it!
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Some commit message'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request 😉😉

## License 📜

MIT © [`Mohammed Taysser`](https://github.com/mohammed-Taysser/)

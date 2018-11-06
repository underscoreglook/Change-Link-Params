# Change Link Params
This is a Firefox extension to add context menu items to open up links in a new tab with parameters changed. Link parameters are those things after the "?" at the end of an URL. For instance, for https://www.youtube.com/watch?v=dQw4w9WgXcQ, there is one parameter of "v" which is equal to "dQw4w9WgXcQ".

## How to use
In the add-ons page (about:addons), you can go to the options page for Change Link Params and it will give you the options page.
"Add Setting" will add a new context menu item, where you can fill in the information for that item in the table. The description of each item is as follows:
- The name will be the text that shows up in the context menu for that item.
- Additions/Replacements will be parameters that are either added to the link or have their values replaced. Clicking "New" adds a new link replacement. If you have 2, with the link parameters being "gig"="1" and "ro"="2" and you right click on a link that goes to "http://test.com", if you click the context menu item, it will go to "http://test.com?gig=1&ro=2".
- Deletions will be parameters that are deleted from the url, so in "http://test.com?test=test", if you have a deletion of "test", selecting the context menu item on the link will take you to "http://test.com". Clicking "New" will give you a new param to delete from a link.
- Clicking the "X" on an addition or deletion will erase that addition or deletion.
- Clicking the "Remove" button on a row will delete the entire row, which will remove that context menu item.
Once you are done with everything, click the "Save" button to save everything and reload the extension. Doing this will hide the options menu for whatever reason (maybe to consider fixing?).

## Examples

### Skip first 30 seconds of a YouTube video
For this, you would set the name to something like "Skip 30 Secs" and add an Addition/Replacement with "t"="30s". When you right click a YouTube video link and click the "Skip 30 Secs" context menu item, it should go to the video you right clicked except starting at 30 seconds in. This can be useful to skip intros and such.

### Open Youtube Video without the Playlist
The name can be "W/O Playlist". You'll need two deletions, "list" and "index". When right clicking on a video link in a Youtube playlist and then clicking "W/O Playlist", it should take you to the video but it won't have the playlist UI, which should also avoid auto-playing the next video in the playlist.

### Rick Roll
Name this one "Rick Roll" and have an Addition/Replacement of "v"="dQw4w9WgXcQ" and a deletion of "t". If you select "Rick Roll" on any Youtube video link, it should take you to Rick Astley's video from the beginning.
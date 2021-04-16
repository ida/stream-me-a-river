test glitch

Stream me a river
=================

Prototype for merging several streams of several
mastodon-accounts into one river.


What
----


1. Show streams of several mastodon-instances in one stream.

2. Prepend one post after another in the stream-view
   with a pause of same duration between the posts,
   and increase height in a smooth transition.

3. Let user configure which kind of streans should be started
   and store selection permanently.


How
---


1. Get authentication-tokens for each of your mastodon-accounts.
You can use this awesome online-tool:
[https://tinysubversions.com/notes/mastodon-bot/index.html](https://tinysubversions.com/notes/mastodon-bot/index.html)



2. [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/stream-me-a-river)
for using and modifying the app right away online in the browser.
*Or* clone it from the repo for local use, see section 'development' below.


3. Add a file '.env' and insert the instances' URLs
(e.g. 'https://mastodon.social') and the tokens in it.
The file './.env.example' shows the expected format.
It is a special file which stays hidden from others and is not
copied on a remix or commited in a repo.
Also, you should not share your tokens with others.




Why
---

The following  numbers correlate with the ones of section 'What' above.

1. One open browser-tab is better than several open browser tabs.

2. The constant movement causes less stress to many readers in
comparison to the standard mastodon-interface where posts plop
in very irregularly and several at once.



Development
-----------


Requirements (must be pre-installed):

- Node's package-manager, aka 'npm'.


Open a console/terminal/shell and do the steps below.


1. Clone repository:

    git clone https://github.com/ida/stream-me-a-river


2. Enter repo:

    cd stream-me-a-river


3. Provide credentials, see point 3 in section 'How' above.


4. Install node-packages:

    npm install


5. Start server:

    npm start


You should get a port-number prompted in the console, copy it
and open 'localhost:[PORT_NR]' in a browser. You're done.



Future
======


- Toot a toot to several accounts.

Nota: For reading non-public posts such as direct-messages,
only a locally installed app would be recommendable, otherwise these
posts are publicly readable.



Credits
=======

This app uses the node-packages express and mastodon-api.



Author
======

Ida Ebkes, 2018.



License
=======

MIT, a copy is attached.

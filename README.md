Stream me a river
=================

Prototype for merging several streams of several
mastodon-accounts into one river.


What
----


1. Show public local streams of several mastodon-instances.

2. Prepend one post after another in the stream-view
   with a pause of same duration between the posts,
   and increase height linear pixel by pixel from
   zero to full height.

3. Don't show images or other media, only textual information.

4. Show only the message and the sender's name in a post.



How
---


1. Get authentication-tokens for each of your mastodon-accounts.
You can use this awesome online-tool:
[https://tinysubversions.com/notes/mastodon-bot/index.html](https://tinysubversions.com/notes/mastodon-bot/index.html)



2. [Remix this on glitch](https://glitch.com/edit/#!/laser-volleyball)
for using the app right away, or clone it from the repo, for local use
and development, see section 'development' below.


3. Add a file '.env' and insert the instances' URLs
(e.g. 'https://mastodon.social') and the tokens in it.
The file './.env.example' shows the expected format.
It is a special file, that stays hidden from others aand is not
copied. Also, you should not share your tokens with others.



Why
---

The following  numbers correlate with the ones of section 'What' above.

1. One open browser-tab is better than several open browser tabs.


2. The constant movement causes less stress to many readers in
comparison to the standard mastodon-interface where posts plop
in very irregularly and several at once.

3. Sometime images can be additional stressful for various reasons,
sometimes all we want are words.


4. Less is more.




Wording
-------


__post__:

In the mastodon-world called "toot". Keeping it
general, as we potentially want to support other
fediverse-compliant instances, too.


__instance__:

A mastodon- or other fediverse-server,
e.g. "mastodon.social".



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

- Provide config in UI for selecting stream-types (direct-messages, follower-toots). If you cloned a development-version you can change the stream-type in
'./stream.js'.

- Toot a toot to several accounts.

Nota: For reading non-public posts such as direct-messages or tooting,
only a locally installed app would be recommendable, otherwise these
posts are publicly readable.



Author
======

Ida Ebkes, 2018.



License
=======

MIT, a copy is attached.
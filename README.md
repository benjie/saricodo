# saricodo

SAm's RIdiculous COunt-DOwn

My friend Sam wanted me to make a "faulty" countdown timer - as if it had been
made by an electrician that had messed up the connection between the minutes
display and the timing circuit - for a role-playing game. This is that counter.

Saricodo splits the countdown into a number (`count`) of "minute"-long
intervals, but each minute is actually a random duration between a minimum
(`min`) and maximum (`max`) number of seconds (inclusive).

The countdown is designed to be displayable on multiple people's computers with
synchronised time (assuming that the computer's clocks are in sync) without
relying on a server - to accomplish this, we use a random seed and a start time
that is shared with everyone via the URL. All members of the party can then
view the timer on their own machines for maximum effect.

## Try it

To try it out, visit:

https://benjie.github.io/saricodo/

And then click the "Generate URL" button. A clickable link will appear that
will open a new tab with the countdown timer.

## The code

You only need `index.html`, `script.js` and the images. The rest are just
support files for running a local server for easier testing.

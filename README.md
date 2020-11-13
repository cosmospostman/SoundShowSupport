# Sound Frequency interactive demo

**What is it?**

A square wave oscillator with a knob to adjust the frequency from 1Hz to 440Hz and see how it sounds. Also remote controllable.

**How**

With [p5js](https://p5js.org), a Javascript library for audiovisual interactive art in the spirit of [Processing](https://processing.org). I love both but have had few excuses to build things with them until now.

We also use [Firebase](https://firebase.google.com) as a data store to keep frequency & other settings in sync for everyone, across all devices. Currently using the free tier of Firebase, so if you use the demo too much then it will run out of quota until the next day.

**Admin mode**

Use `https://cosmospostman.github.io/?admin=true` to control audience access to making sound on their own device, and the individual note buttons.

**Limitations/TODO**

* UI could be much, much nicer
* The experience probably isn't great if multiple people use it at the same time
* The 'dots' visualisation was chosen on a whim for its similarity to musical notes, but there you could probably think of better visualizations
* Firebase makes it dead simple to keep things in sync across multiple browsers/devices, but with a bit more effort you could replicate the sync functionality on a server of your own. Then you don't have to worry about Firebase quota or usage costs.
* Could extend the demo to cover many more questions
  * What about pitches above 440Hz?
  * What about note buttons for other octaves... how about a real keyboard?
  * What do other waveforms sound like (sine, sawtooth)?
  * It would be really cool to let users draw one cycle of a wave form and oscillate with that (→ conversations about synthesis)
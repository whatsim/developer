Developer
=========

###WebGL Color Negative Corrector

Running at : [http://whatsim.github.io/developer/](http://whatsim.github.io/developer/)

I use a DSLR to scan my negatives, but post processing color film has been an ongoing chore on account of the orange cast of the developed film. See [here](http://photo.net/learn/orange-negative-mask) for more about why that orange cast is there, if you're interested. Long story short, you can get acceptable results inverting in Lightroom or Photoshop, and then color correcting with levels, but if you want to minimize not just the blue cast but the color channel contamination, you need to go further. One approach, and the model I'm using, is described [here](http://www.dpreview.com/forums/post/499854)

The results of Burton's technique were pretty good in my opinion, but as you can see from that last link, it's a laborious process to run on a roll of film yourself, I tried to automate with Photoshop actions but workflow wise it still wasn't doing it for me, it was difficult to know without running the whole process if you were going to get good results. I later wrote that same process as an Image Magick script and used the excellent [run any command](http://regex.info/blog/lightroom-goodies/run-any-command) plugin to use it automatically out of lightroom, but I still couldn't see the result of tweaks I made in Lightroom until I'd run an export, which was also not amazing. That script is [here](https://gist.github.com/whatsim/9b503edeb0fa34fc5c42), for the interested.

So! I've taken the lessons learned from these previous attempts and wrote a utility to do this color correction in a browser (really, just in Chrome). Two big advantages here compared to the previous methods:

1. you edit on the positive in real time with the color correction applied auto magically, WYSIWYG.
2. all the color correction is applied as one shader which, trying not to be too technical, should avoid error's compounding stage to stage. ie, the invert can temporarily clip one of the color layers, and the color correction can bring it back into range losslessly. It only gets clamped to an 8 bit image at the end.

So without further ado: [http://whatsim.github.io/developer/](http://whatsim.github.io/developer/)

For best results, use Chrome, it should support any image your browser does, but while Safari supports TIFF, Safari's WebGL performance is abysmal. There seems to be a max size of images that Chrome will let you save, I've had no trouble with 1824 x 2736 JPEGs (half size images from my DSLR). The limitation seems to be file size, not resolution.

To use, drop an image into the grey frame in the center of screen. The left slider next to the image is exposure, the right slider next to the image is contrast. A good first step is to lower contrast until the histograms are fully visible in range. From there you can use the sliders on each histogram to change the black point (left slider) and white point (right slider) for each color channel. Aligning the peaks is a good first take on white balancing, and then you can go from there. If you hit the download link at the top of the screen you'll navigate to the resulting output and are able to save from there.

Potential Questions:
===================

###How does this work, can I change it, can you make the background blue, it doesn't work for me?

All the code is [here](https://github.com/whatsim/developer/). I've made this for me, to the extent it's useful for other people awesome! That said, I can't promise any sort of support. Feel free to hack it to your needs if you're able! If you know JS hopefully it's not too intimidating under the hood. The WebGL part uses the excellent [Seriously.js](https://github.com/brianchirls/Seriously.js/) with a shader plugin I wrote. There are no other dependencies.

###This is too slow to use!

I wrote the first pass of this on a 2010 MacBook Pro, and it remained usable even on images larger than Chrome would save. That said, in Firefox and Safari it was **slow**. If it's too slow and you're already using it in Chrome you can try using smaller input images, but I know thats not a real answer. Sorry!

###Does this send my pictures somewhere, can other people see them?

All the processing on the image happens locally in your browser, your image doesn't get sent anywhere, no one else can see them when you use this tool.

###Can I use this for black and white negatives?

Well, yes, but it's probably not a great idea as it is now. This utility applies the orange cast color correction no matter what, as black and white negatives don't have that mask present, the orange mask removal is adding error to your black and white pictures. I wouldn't recommend it. I probably won't add a black and white mode as other ways of just flipping black and white photos are easy enough to use successfully.

###I use a scanner, is this doing anything negative mode on my scanner isn't.

I have no idea! I think odds are good your scanner is doing this for you, but I don't have a scanner, much less your scanner. I'd be interested if someone did a scanner auto negative correction versus taking a raw scan through this utility.

###Are you aware of [negfix](https://sites.google.com/site/negfix/)?

I actually was not aware of negfix until, in writing this readme, I was checking to see if 'negfix' (the filename of the shader plugin) came back with anything on Google. While I haven't used it, it looks very complete, and is capable of correcting the color mask of color negatives as well as doing black and white negatives. In a workflow where using lossless inputs is important, or you want to automate the processing of a large number of images, I have no doubt it excels. As with scanner auto negative correction, I'd be interested to see a comparison.

###Can I use a RAW / high bit depth image.

This is limited by what images your browser supports. JPEG is the format I've used the most and should just work, with the caveat about saving large files, no promises otherwise.

###Is this 100% the best most accurate color?

_No._ While this is useful for me, and while I think this can get you closer to 'accurate' color to start with, the way you mix the levels is to your taste and thats a good thing! Further, the real world color contamination can vary from the idealized value I use in the orange mask correction.

###How do you scan with a DSLR.

There's a lot of people with examples of their setup, and mine isn't that different. I use a macro lens capable of 1:1 reproduction mounted on a piece of unistrut. I have an enlarger plate I'm drilled a tripod hole into that I then mount to the other end of the unistrut with a Joby Gorillapod tripod head. That keeps everything nice and square. I use an iPad for a backlight, or sometimes sunlight reflecting off my wall, if the world cooperates. It takes me about 15 minutes to do a roll of film that way.

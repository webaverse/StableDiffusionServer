# **GFPGAN and Real-ESRGAN Support**

The script also provides the ability to do face restoration and
upscaling with the help of GFPGAN and Real-ESRGAN respectively.

As of version 1.14, environment.yaml will install the Real-ESRGAN package into the
standard install location for python packages, and will put GFPGAN into a subdirectory of "src" 
in the stable-diffusion directory.
(The reason for this is that the standard GFPGAN distribution has a minor bug that adversely affects image
color.) Upscaling with Real-ESRGAN should "just work" without further intervention. Simply pass the --upscale (-U)
option on the dream> command line, or indicate the desired scale on the popup in the Web GUI.

For **GFPGAN** to work, there is one additional step needed. You will need to download and 
copy the GFPGAN [models file](https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth) 
into **src/gfpgan/experiments/pretrained_models**. On Mac and Linux systems, here's how you'd do it using
**wget**:
~~~~
> wget https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth -P src/gfpgan/experiments/pretrained_models/
~~~~

Make sure that you're in the stable-diffusion directory when you do this.

Alternatively, if you have GFPGAN installed elsewhere, or if you are using
an earlier version of this package which asked you to install GFPGAN in a
sibling directory, you may use the `--gfpgan_dir` argument with `dream.py` to set a
custom path to your GFPGAN directory. _There are other GFPGAN related
boot arguments if you wish to customize further._

**Note: Internet connection needed:**
Users whose GPU machines are isolated from the Internet (e.g. on a
University cluster) should be aware that the first time you run
dream.py with GFPGAN and Real-ESRGAN turned on, it will try to
download model files from the Internet. To rectify this, you may run
`python3 scripts/preload_models.py` after you have installed GFPGAN
and all its dependencies.

**Usage**

You will now have access to two new prompt arguments.

**Upscaling**

`-U : <upscaling_factor> <upscaling_strength>`

The upscaling prompt argument takes two values. The first value is a
scaling factor and should be set to either `2` or `4` only. This will
either scale the image 2x or 4x respectively using different models.

You can set the scaling stength between `0` and `1.0` to control
intensity of the of the scaling. This is handy because AI upscalers
generally tend to smooth out texture details. If you wish to retain
some of those for natural looking results, we recommend using values
between `0.5 to 0.8`.

If you do not explicitly specify an upscaling_strength, it will
default to 0.75.

**Face Restoration**

`-G : <gfpgan_strength>`

This prompt argument controls the strength of the face restoration
that is being applied. Similar to upscaling, values between `0.5 to 0.8` are recommended.

You can use either one or both without any conflicts. In cases where
you use both, the image will be first upscaled and then the face
restoration process will be executed to ensure you get the highest
quality facial features.

`--save_orig`

When you use either `-U` or `-G`, the final result you get is upscaled
or face modified. If you want to save the original Stable Diffusion
generation, you can use the `-save_orig` prompt argument to save the
original unaffected version too.

**Example Usage**

```
dream > superman dancing with a panda bear -U 2 0.6 -G 0.4
```

This also works with img2img:

```
dream> a man wearing a pineapple hat -I path/to/your/file.png -U 2 0.5 -G 0.6
```

**Note**

GFPGAN and Real-ESRGAN are both memory intensive. In order to avoid
crashes and memory overloads during the Stable Diffusion process,
these effects are applied after Stable Diffusion has completed its
work.

In single image generations, you will see the output right away but
when you are using multiple iterations, the images will first be
generated and then upscaled and face restored after that process is
complete. While the image generation is taking place, you will still
be able to preview the base images.

If you wish to stop during the image generation but want to upscale or
face restore a particular generated image, pass it again with the same
prompt and generated seed along with the `-U` and `-G` prompt
arguments to perform those actions.

# Export main YAML without prefixes
conda env export | grep -v "prefix" > environment-webv.yaml

# Remove the pip installation of k-diffusion
#sed -i '/k-diffusion/d' environment-webv.yaml

# Add packages from git and install local packages
#echo "    - -e git+https://github.com/openai/CLIP.git@main#egg=clip
#    - -e git+https://github.com/CompVis/taming-transformers.git@master#egg=taming-transformers
#    - -e git+https://github.com/lstein/k-diffusion.git@master#egg=k-diffusion
#    - -e git+https://github.com/lstein/GFPGAN@fix-dark-cast-images#egg=gfpgan
#    - -e ." >> environment-webv.yaml